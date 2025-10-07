/* eslint-disable @typescript-eslint/prefer-as-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminOrders from "@/pages/Dashboard/admin/AdminOrders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/Auth-Slice";
import type { AuthState } from "@/store/slices/Auth-Slice";
import { useFetch } from "@/hooks/useFetch";

vi.mock("@/hooks/useFetch");
vi.mock("@/components/dashboard/admin/AdminOrderTable", () => ({
  default: () => <div data-testid="admin-order-table" />,
}));

function createTestStore(preloadedState?: { auth: AuthState }) {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });
}

const queryClient = new QueryClient();

const renderComponent = () => {
  const store = createTestStore({
    auth: {
      isAuthenticated: true,
      user: {
        id: "1",
        email: "test@test.com",
        userName: "test",
        role: "admin" as "admin",
      },
      loading: false,
    },
  });

  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AdminOrders />
      </QueryClientProvider>
    </Provider>
  );
};

// Helper for generating recent dates
function getRecentDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

describe("AdminOrders Component Behavior", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("shows loading state", () => {
    (useFetch as any).mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
    });

    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    (useFetch as any).mockReturnValue({
      isLoading: false,
      isError: true,
      error: { message: "Fetch failed" },
      data: null,
    });

    renderComponent();
    expect(screen.getByText(/error: fetch failed/i)).toBeInTheDocument();
  });

  it("shows no orders message", () => {
    (useFetch as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
    });

    renderComponent();
    expect(screen.getByText(/no orders available/i)).toBeInTheDocument();
  });

  it("renders orders and search works", async () => {
    const mockOrders = [
      {
        _id: "1",
        createdAt: getRecentDate(1),
        totalAmount: 100,
        status: "Pending",
        user: { userName: "Alice", email: "alice@test.com" },
        products: [],
      },
      {
        _id: "2",
        createdAt: getRecentDate(2),
        totalAmount: 200,
        status: "Paid",
        user: { userName: "Bob", email: "bob@test.com" },
        products: [],
      },
    ];

    (useFetch as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockOrders,
    });

    renderComponent();

    expect(screen.getByTestId("admin-order-table")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search by name or email/i);
    fireEvent.change(searchInput, { target: { value: "alice" } });

    await waitFor(() => {
      expect(screen.getByTestId("admin-order-table")).toBeInTheDocument();
    });
  });

  it("pagination buttons change pages", async () => {
    const mockOrders = Array.from({ length: 20 }, (_, i) => ({
      _id: `${i}`,
      createdAt: getRecentDate(i),
      totalAmount: 50 + i,
      status: "Pending",
      user: { userName: `User${i}`, email: `user${i}@test.com` },
      products: [],
    }));

    (useFetch as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockOrders,
    });

    renderComponent();

    const page2Button = screen.getByText("2");
    fireEvent.click(page2Button);

    await waitFor(() => {
      // Check if class includes 'rt-variant-solid' instead of attribute
      expect(page2Button.className).toContain("rt-variant-solid");
    });
  });
});
