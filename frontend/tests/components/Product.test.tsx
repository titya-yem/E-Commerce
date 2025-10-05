import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductsComponent from "@/components/Products";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/store/slices/Cart-Slice";
import { Theme } from "@radix-ui/themes";
import { vi } from "vitest";

// 👇 POLYFILL MISSING JSDOM METHODS (critical for Radix UI)
beforeAll(() => {
  HTMLElement.prototype.scrollIntoView = vi.fn();
  HTMLElement.prototype.hasPointerCapture = () => true;
  HTMLElement.prototype.releasePointerCapture = () => {};
});

afterEach(() => {
  vi.clearAllMocks();
});

// Mock useFetch
vi.mock("@/hooks/useFetch", () => ({
  useFetch: vi.fn(),
}));

import { useFetch } from "@/hooks/useFetch";

type UseFetchReturn<T> = {
  isLoading: boolean;
  isError: boolean;
  data: T | null;
  error: Error | null;
};

const mockUseFetch = useFetch as unknown as ReturnType<typeof vi.fn> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockReturnValue: (value: UseFetchReturn<any>) => void;
};

const renderWithProviders = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: { cart: cartReducer },
  });
  return render(
    <Provider store={store}>
      <Theme>
        <MemoryRouter>{ui}</MemoryRouter>
      </Theme>
    </Provider>
  );
};

describe("ProductsComponent", () => {
  it("renders loading state", () => {
    mockUseFetch.mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
      error: null,
    });

    renderWithProviders(<ProductsComponent />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUseFetch.mockReturnValue({
      isLoading: false,
      isError: true,
      data: null,
      error: new Error("Failed to fetch products"),
    });

    renderWithProviders(<ProductsComponent />);
    expect(
      screen.getByText(/error: failed to fetch products/i)
    ).toBeInTheDocument();
  });

  it("renders 'No product available' when data is empty", () => {
    mockUseFetch.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
      error: null,
    });

    renderWithProviders(<ProductsComponent />);
    expect(screen.getByText(/no product available/i)).toBeInTheDocument();
  });

  it("renders products and handles category filter", async () => {
    const user = userEvent.setup();

    const mockData = [
      {
        _id: "1",
        name: "Dog Food",
        image: "/dogfood.jpg",
        price: 20,
        rating: 4.5,
        category: "Dog",
      },
      {
        _id: "2",
        name: "Cat Toy",
        image: "/cattoy.jpg",
        price: 10,
        rating: 4.8,
        category: "Cat",
      },
    ];

    mockUseFetch.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockData,
      error: null,
    });

    renderWithProviders(<ProductsComponent />);

    expect(screen.getByText(/dog food/i)).toBeInTheDocument();
    expect(screen.getByText(/\$20/i)).toBeInTheDocument();
    expect(screen.getByText(/cat toy/i)).toBeInTheDocument();
    expect(screen.getByText(/\$10/i)).toBeInTheDocument();

    // Open dropdown
    const selectTrigger = screen.getByRole("combobox", {
      name: /all categories/i,
    });
    await user.click(selectTrigger);

    const catOption = await within(document.body).findByTestId(
      "category-option-Cat",
      {},
      { timeout: 3000 }
    );
    await user.click(catOption);

    await waitFor(() => {
      expect(screen.queryByText(/dog food/i)).not.toBeInTheDocument();
      expect(screen.getByText(/cat toy/i)).toBeInTheDocument();
    });
  });

  it("adds product to cart", async () => {
    const user = userEvent.setup();

    const mockData = [
      {
        _id: "1",
        name: "Dog Food",
        image: "/dogfood.jpg",
        price: 20,
        rating: 4.5,
        category: "Dog",
      },
    ];

    mockUseFetch.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockData,
      error: null,
    });

    renderWithProviders(<ProductsComponent />);

    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });

    await user.click(addToCartButton);
  });
});
