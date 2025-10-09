/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-as-const */
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";
import UserOrders from "@/pages/Dashboard/user/UserOrders";
import authReducer from "@/store/slices/Auth-Slice";

// Mock the custom useFetch hook
vi.mock("@/hooks/useFetch", () => ({
  useFetch: vi.fn(),
}));

// Mock the UserOrderDetails component to keep it simple
vi.mock("@/pages/Dashboard/user/userDetailOrder", () => ({
  __esModule: true,
  default: ({ order }: { order: any }) => (
    <div>View Details for {order.user?.email}</div>
  ),
}));

// Import mocked useFetch
import { useFetch } from "@/hooks/useFetch";

// Helper function to render component with Redux
const renderWithRedux = (component: React.ReactNode) => {
  const mockAuthState = {
    user: {
      id: "1",
      userName: "TestUser",
      email: "test@example.com",
      role: "user" as "user",
    },
    isAuthenticated: true,
    loading: false,
  };

  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: mockAuthState },
  });

  return render(<Provider store={store}>{component}</Provider>);
};

describe("UserOrders Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    (useFetch as any).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });

    renderWithRedux(<UserOrders />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useFetch as any).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch"),
    });

    renderWithRedux(<UserOrders />);
    expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
  });

  it("renders no orders message", () => {
    (useFetch as any).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    renderWithRedux(<UserOrders />);
    expect(screen.getByText(/No Order available/i)).toBeInTheDocument();
  });

  it("renders orders with pagination", async () => {
    const mockOrders = Array.from({ length: 10 }, (_, i) => ({
      _id: `order-${i + 1}`,
      user: { email: `user${i + 1}@example.com` },
      createdAt: "2025-10-08T00:00:00.000Z",
      totalAmount: 50 + i,
      status: i % 2 === 0 ? "Pending" : "Shipped",
    }));

    (useFetch as any).mockReturnValue({
      data: mockOrders,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderWithRedux(<UserOrders />);

    // Verify first 5 emails (page 1)
    expect(
      screen.getByRole("link", { name: /user1@example\.com/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /user5@example\.com/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /user6@example\.com/i })
    ).not.toBeInTheDocument();

    // Click the "Next Page" button
    const pageButtons = screen.getAllByRole("button");
    expect(pageButtons.length).toBe(2);

    await userEvent.click(pageButtons[1]);

    // Wait for page 2 content to render
    expect(
      await screen.findByRole("link", { name: /user6@example\.com/i })
    ).toBeInTheDocument();
  });
});
