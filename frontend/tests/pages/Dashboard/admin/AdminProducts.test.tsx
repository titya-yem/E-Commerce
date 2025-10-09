/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, beforeEach, vi } from "vitest";
import type { Mock } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import AdminProducts from "@/pages/Dashboard/admin/AdminProducts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { useFetch } from "@/hooks/useFetch";

// --- Mocks ---
vi.mock("axios");
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
  success: vi.fn(),
  error: vi.fn(),
}));
vi.mock("@/components/dashboard/admin/AdminProductForm", () => ({
  default: ({ onCancel }: any) => (
    <div>
      <p>Mocked AdminProductForm</p>
      <button onClick={onCancel}>Cancel Edit</button>
    </div>
  ),
}));
vi.mock("@/components/dashboard/admin/AdminAddProduct", () => ({
  default: () => <p>Mocked AdminAddProduct</p>,
}));
vi.mock("@/hooks/useFetch");

// Helper to wrap component with react-query
const renderWithClient = (ui: React.ReactNode) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

describe("AdminProducts Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows loading state", () => {
    (useFetch as unknown as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderWithClient(<AdminProducts />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("shows error state", () => {
    (useFetch as unknown as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch"),
    });

    renderWithClient(<AdminProducts />);
    expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
  });

  test("shows empty state", () => {
    (useFetch as unknown as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    renderWithClient(<AdminProducts />);
    expect(screen.getByText(/No products available/i)).toBeInTheDocument();
  });

  test("renders product list and opens Edit dialog", async () => {
    (useFetch as unknown as Mock).mockReturnValue({
      data: [
        {
          _id: "1",
          name: "Perfume A",
          category: "Luxury",
          stock: 100,
          price: 50,
          image: "image.jpg",
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
      isError: false,
    });

    renderWithClient(<AdminProducts />);

    // Find the product row containing "Perfume A"
    const productNameElements = screen.getAllByText("Perfume A");
    expect(productNameElements.length).toBeGreaterThan(0);

    const productRow = productNameElements[0].closest("div");
    expect(productRow).toBeTruthy();

    if (productRow) {
      const { getByText, getAllByRole } = within(productRow);

      expect(getByText("$50")).toBeInTheDocument();
      expect(getByText("Luxury")).toBeInTheDocument();
      expect(getByText("100")).toBeInTheDocument();

      // Scope to the product row for "Edit Product" button
      const editButtons = getAllByRole("button", { name: /Edit Product/i });
      expect(editButtons.length).toBeGreaterThan(0);

      await userEvent.click(editButtons[0]);
    }

    expect(screen.getByText(/Mocked AdminProductForm/i)).toBeInTheDocument();

    await userEvent.click(screen.getByText(/Cancel Edit/i));
    await waitFor(() => {
      expect(
        screen.queryByText(/Mocked AdminProductForm/i)
      ).not.toBeInTheDocument();
    });
  });

  test("opens Add Product dialog", async () => {
    (useFetch as unknown as Mock).mockReturnValue({
      data: [
        {
          _id: "1",
          name: "Perfume A",
          category: "Luxury",
          stock: 100,
          price: 50,
          image: "image.jpg",
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
      isError: false,
    });

    renderWithClient(<AdminProducts />);

    const addButton = screen.getByRole("button", { name: /\+ Add Product/i });
    await userEvent.click(addButton);

    expect(screen.getByText(/Mocked AdminAddProduct/i)).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await userEvent.click(cancelButton);
    await waitFor(() => {
      expect(
        screen.queryByText(/Mocked AdminAddProduct/i)
      ).not.toBeInTheDocument();
    });
  });
});
