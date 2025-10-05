import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TopCategories from "@/components/cateogry/TopCategories";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useFetch } from "@/hooks/useFetch";

vi.mock("@/hooks/useFetch", () => ({
  useFetch: vi.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

describe("TopCategories Component", () => {
  const mockUseFetch = useFetch as unknown as ReturnType<typeof vi.fn>;

  const renderWithProviders = () => {
    const queryClient = createTestQueryClient();
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <TopCategories />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", async () => {
    mockUseFetch.mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
      error: null,
    });

    renderWithProviders();
    expect(await screen.findByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders error message", async () => {
    mockUseFetch.mockReturnValue({
      isLoading: false,
      isError: true,
      data: null,
      error: new Error("Network Error"),
    });

    renderWithProviders();
    expect(
      await screen.findByText(/Error: Network Error/i)
    ).toBeInTheDocument();
  });

  it("renders no products message when no data", async () => {
    mockUseFetch.mockReturnValue({
      isLoading: false,
      isError: false,
      data: null,
      error: null,
    });

    renderWithProviders();
    expect(
      await screen.findByText(/No Products Available/i)
    ).toBeInTheDocument();
  });

  it("renders heading and all pet categories", async () => {
    mockUseFetch.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        {
          _id: "1",
          id: "1",
          name: "Dog Food",
          category: "Dog",
          price: 10,
          image: "https://via.placeholder.com/150",
          rating: 4.5,
          description: "Best dog food",
        },
        {
          _id: "2",
          id: "2",
          name: "Cat Food",
          category: "Cat",
          price: 20,
          image: "https://via.placeholder.com/150",
          rating: 4.0,
          description: "Healthy cat food",
        },
      ],
      error: null,
    });

    renderWithProviders();

    expect(await screen.findByText("Top Categories")).toBeInTheDocument();

    const categoryNames = ["Rabbit", "Cat", "Dog", "Bird", "Fish"];
    for (const name of categoryNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("handles forward and backward navigation correctly", async () => {
    const user = userEvent.setup();

    mockUseFetch.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        {
          _id: "1",
          id: "1",
          name: "Dog Food",
          category: "Dog",
          price: 10,
          image: "https://via.placeholder.com/150",
          rating: 4.5,
          description: "Best dog food",
        },
        {
          _id: "2",
          id: "2",
          name: "Cat Food",
          category: "Cat",
          price: 20,
          image: "https://via.placeholder.com/150",
          rating: 4.0,
          description: "Healthy cat food",
        },
        {
          _id: "3",
          id: "3",
          name: "Fish Food",
          category: "Fish",
          price: 15,
          image: "https://via.placeholder.com/150",
          rating: 4.2,
          description: "Nutritious fish food",
        },
        {
          _id: "4",
          id: "4",
          name: "Bird Food",
          category: "Bird",
          price: 12,
          image: "https://via.placeholder.com/150",
          rating: 4.1,
          description: "Premium bird food",
        },
        {
          _id: "5",
          id: "5",
          name: "Rabbit Food",
          category: "Rabbit",
          price: 9,
          image: "https://via.placeholder.com/150",
          rating: 3.9,
          description: "Organic rabbit food",
        },
      ],
      error: null,
    });

    renderWithProviders();

    const forwardButton = screen
      .getByAltText("Forward Arrow")
      .closest("button")!;
    const backwardButton = screen
      .getByAltText("Backward Arrow")
      .closest("button")!;

    expect(backwardButton).toBeDisabled();

    await user.click(forwardButton);
    expect(backwardButton).not.toBeDisabled();

    await user.click(backwardButton);
    expect(backwardButton).toBeDisabled();
  });
});
