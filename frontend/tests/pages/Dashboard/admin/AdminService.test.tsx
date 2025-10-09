import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import type { Mock } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";

import AdminServices from "@/pages/Dashboard/admin/AdminServices";
import { useFetch } from "@/hooks/useFetch";
import axios from "axios";

// --- Mocks ---
vi.mock("@/hooks/useFetch");
vi.mock("axios");
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

// --- Fix for Radix UI ---
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.hasPointerCapture = () => false;
});

const renderWithClient = (ui: React.ReactNode) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <Theme>{ui}</Theme>
    </QueryClientProvider>
  );
};

describe("AdminServices Component", () => {
  const mockUseFetch = useFetch as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    mockUseFetch.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderWithClient(<AdminServices />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUseFetch.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Fetch failed"),
    });

    renderWithClient(<AdminServices />);
    expect(screen.getByText(/Error: Fetch failed/i)).toBeInTheDocument();
  });

  it("shows empty state but still renders Add Service button", () => {
    mockUseFetch.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    renderWithClient(<AdminServices />);
    expect(screen.getByText(/No Services available/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "+ Add Service" })
    ).toBeInTheDocument();
  });

  it("renders service cards", () => {
    mockUseFetch.mockReturnValue({
      data: [
        {
          _id: "1",
          title: "Test Service",
          description: "Test Description",
          duration: 2,
          price: 99,
          image: "test.jpg",
        },
      ],
      isLoading: false,
      isError: false,
    });

    renderWithClient(<AdminServices />);
    expect(screen.getByText("Test Service")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText(/Duration: 2 hours/i)).toBeInTheDocument();
    expect(screen.getByText(/Price: \$99/i)).toBeInTheDocument();
  });

  it("opens Add Service dialog", async () => {
    mockUseFetch.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    renderWithClient(<AdminServices />);
    const addButton = screen.getByRole("button", { name: "+ Add Service" });
    await userEvent.click(addButton);

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("heading", { name: "Add Service" })
    ).toBeInTheDocument();
  });

  it("opens Update Service dialog", async () => {
    mockUseFetch.mockReturnValue({
      data: [
        {
          _id: "1",
          title: "Test Service",
          description: "Test Description",
          duration: 2,
          price: 99,
          image: "test.jpg",
        },
      ],
      isLoading: false,
      isError: false,
    });

    renderWithClient(<AdminServices />);
    const updateButton = screen.getByRole("button", { name: "Update" });
    await userEvent.click(updateButton);

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("heading", { name: "Update Service" })
    ).toBeInTheDocument();
  });

  it("deletes a service", async () => {
    mockUseFetch.mockReturnValue({
      data: [
        {
          _id: "1",
          title: "Test Service",
          description: "Test Description",
          duration: 2,
          price: 99,
          image: "test.jpg",
        },
      ],
      isLoading: false,
      isError: false,
    });

    (axios.delete as Mock).mockResolvedValue({ data: {} });

    renderWithClient(<AdminServices />);
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await userEvent.click(deleteButton);

    const dialog = await screen.findByRole("alertdialog"); // ✅ fixed
    expect(
      within(dialog).getByRole("heading", { name: "Delete Service" })
    ).toBeInTheDocument();

    const confirmButton = within(dialog).getByRole("button", {
      name: "Delete",
    });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledTimes(1);
    });
  });
});
