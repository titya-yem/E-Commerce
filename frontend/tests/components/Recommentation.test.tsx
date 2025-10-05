import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Recommendation from "@/components/Recommendation";
import { vi, describe, it, expect, afterEach } from "vitest";

vi.mock("@/hooks/useFetch", () => ({
  useFetch: vi.fn(),
}));

import { useFetch } from "@/hooks/useFetch";
const mockUseFetch = useFetch as unknown as ReturnType<typeof vi.fn>;

describe("Recommendation Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseFetch.mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
      error: null,
    });

    render(<Recommendation />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUseFetch.mockReturnValue({
      isLoading: false,
      isError: true,
      data: null,
      error: new Error("Failed to fetch"),
    });

    render(<Recommendation />);
    expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
  });

  it("renders 'No comments found' when data is empty", () => {
    mockUseFetch.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
      error: null,
    });

    render(<Recommendation />);
    expect(screen.getByText(/No comments found/i)).toBeInTheDocument();
  });

  it("renders a comment", () => {
    const mockData = [
      {
        _id: "1",
        title: "Excellent Service",
        text: "Loved it!",
        type: "Review",
        userName: { userName: "John Doe" },
      },
    ];

    mockUseFetch.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockData,
      error: null,
    });

    render(<Recommendation />);
    expect(screen.getByText(/Excellent Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Loved it!/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it("navigates forward and backward between comments", async () => {
    const user = userEvent.setup();

    const mockData = [
      {
        _id: "1",
        title: "Excellent Service",
        text: "Loved it!",
        type: "Review",
        userName: { userName: "John Doe" },
      },
      {
        _id: "2",
        title: "Great Staff",
        text: "Friendly and helpful.",
        type: "Feedback",
        userName: { userName: "Jane Smith" },
      },
    ];

    mockUseFetch.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockData,
      error: null,
    });

    render(<Recommendation />);

    expect(screen.getByText(/Excellent Service/i)).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    const prevBtn = buttons[0];
    const nextBtn = buttons[1];

    await user.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByText(/Great Staff/i)).toBeInTheDocument();
    });

    await user.click(prevBtn);

    await waitFor(() => {
      expect(screen.getByText(/Excellent Service/i)).toBeInTheDocument();
    });
  });
});
