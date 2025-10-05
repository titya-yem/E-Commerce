import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Services from "@/components/Services";
import { vi, describe, it, expect, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/hooks/useFetch", () => ({
  useFetch: vi.fn(),
}));

import { useFetch } from "@/hooks/useFetch";
const mockUseFetch = useFetch as unknown as ReturnType<typeof vi.fn>;

const renderWithRouter = (ui: React.ReactNode) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Services Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseFetch.mockReturnValue({
      data: null,
      isError: false,
      error: null,
      isLoading: true,
    });

    renderWithRouter(<Services />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUseFetch.mockReturnValue({
      data: null,
      isError: true,
      error: new Error("Failed to fetch services"),
      isLoading: false,
    });

    renderWithRouter(<Services />);
    expect(
      screen.getByText(/Error: Failed to fetch services/i)
    ).toBeInTheDocument();
  });

  it("renders 'No Services available' when data is empty", () => {
    mockUseFetch.mockReturnValue({
      data: [],
      isError: false,
      error: null,
      isLoading: false,
    });

    renderWithRouter(<Services />);
    expect(screen.getByText(/No Services available/i)).toBeInTheDocument();
  });

  it("renders a list of services", () => {
    const mockData = [
      {
        _id: "1",
        title: "Dog Grooming",
        image: "/dog.jpg",
        price: 40,
        duration: 2,
        description: "A full grooming service for your dog.",
      },
      {
        _id: "2",
        title: "Cat Bathing",
        image: "/cat.jpg",
        price: 25,
        duration: 1,
        description: "Gentle bathing service for your cat.",
      },
    ];

    mockUseFetch.mockReturnValue({
      data: mockData,
      isError: false,
      error: null,
      isLoading: false,
    });

    renderWithRouter(<Services />);

    expect(screen.getByText(/Dog Grooming/i)).toBeInTheDocument();
    expect(screen.getByText(/Cat Bathing/i)).toBeInTheDocument();
    expect(screen.getByText(/Price: \$40/i)).toBeInTheDocument();
    expect(screen.getByText(/Price: \$25/i)).toBeInTheDocument();
  });

  it("navigates to contact and appointment links", async () => {
    const user = userEvent.setup();

    const mockData = [
      {
        _id: "1",
        title: "Dog Grooming",
        image: "/dog.jpg",
        price: 40,
        duration: 2,
        description: "A full grooming service for your dog.",
      },
    ];

    mockUseFetch.mockReturnValue({
      data: mockData,
      isError: false,
      error: null,
      isLoading: false,
    });

    renderWithRouter(<Services />);

    const contactLink = screen.getByRole("link", { name: /\$40/i });
    const appointmentLink = screen.getByRole("link", { name: /2 hours/i });

    expect(contactLink).toHaveAttribute("href", "/contact");
    expect(appointmentLink).toHaveAttribute("href", "/appointment");

    await user.click(contactLink);
    await user.click(appointmentLink);
  });
});
