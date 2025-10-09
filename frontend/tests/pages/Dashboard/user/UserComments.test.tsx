/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserComments from "@/pages/Dashboard/user/UserComments";
import { useFetch } from "@/hooks/useFetch";
import axios from "axios";

// Mock useFetch and axios
vi.mock("@/hooks/useFetch", () => ({
  useFetch: vi.fn(),
}));

vi.mock("axios");
const mockedAxios = axios as unknown as {
  delete: ReturnType<typeof vi.fn>;
};
mockedAxios.delete = vi.fn();

// Mock UserCommentForm (skip testing it)
vi.mock("@/components/dashboard/UserCommentForm", () => ({
  __esModule: true,
  default: ({ onSuccess }: { onSuccess: () => void }) => (
    <div>
      Mocked Comment Form
      <button onClick={onSuccess}>Submit</button>
    </div>
  ),
}));

// Helper to render with React Query provider
const renderWithClient = (ui: React.ReactNode) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("UserComments Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    (useFetch as any).mockReturnValue({
      data: null,
      isError: false,
      isLoading: true,
      error: null,
    });

    renderWithClient(<UserComments />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useFetch as any).mockReturnValue({
      data: null,
      isError: true,
      isLoading: false,
      error: new Error("Network Error"),
    });

    renderWithClient(<UserComments />);
    expect(screen.getByText(/Error: Network Error/i)).toBeInTheDocument();
  });

  it("renders empty state", () => {
    (useFetch as any).mockReturnValue({
      data: [],
      isError: false,
      isLoading: false,
      error: null,
    });

    renderWithClient(<UserComments />);
    expect(screen.getByText(/No comments available/i)).toBeInTheDocument();
  });

  it("renders comments and handles pagination", async () => {
    const mockComments = Array.from({ length: 8 }, (_, i) => ({
      _id: `comment-${i + 1}`,
      title: `Title ${i + 1}`,
      text: `Comment text ${i + 1}`,
      type: i % 2 === 0 ? "Cat" : "Dog",
      createdAt: "2025-10-08T00:00:00.000Z",
      status: i % 2 === 0 ? "Approved" : "Pending",
    }));

    (useFetch as any).mockReturnValue({
      data: mockComments,
      isError: false,
      isLoading: false,
      error: null,
    });

    renderWithClient(<UserComments />);

    // First page
    expect(screen.getByText(/Title 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Title 6/i)).not.toBeInTheDocument();

    // Switch to page 2
    const nextPageBtn = screen.getByRole("button", { name: "2" });
    await userEvent.click(nextPageBtn);

    await waitFor(() => {
      expect(screen.getByText(/Title 6/i)).toBeInTheDocument();
    });
  });

  it("opens and closes the Add Comment dialog", async () => {
    (useFetch as any).mockReturnValue({
      data: [],
      isError: false,
      isLoading: false,
      error: null,
    });

    renderWithClient(<UserComments />);

    const addBtn = screen.getByRole("button", { name: /\+ Add Comment/i });
    await userEvent.click(addBtn);

    expect(screen.getByText(/Mocked Comment Form/i)).toBeInTheDocument();

    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    await userEvent.click(cancelBtn);

    await waitFor(() => {
      expect(
        screen.queryByText(/Mocked Comment Form/i)
      ).not.toBeInTheDocument();
    });
  });

  it("deletes a comment after confirmation", async () => {
    const mockComments = [
      {
        _id: "comment-1",
        title: "Sample Title",
        text: "Sample text",
        type: "Dog",
        createdAt: "2025-10-08T00:00:00.000Z",
        status: "Approved",
      },
    ];

    (useFetch as any).mockReturnValue({
      data: mockComments,
      isError: false,
      isLoading: false,
      error: null,
    });

    mockedAxios.delete.mockResolvedValue({ data: { success: true } });

    renderWithClient(<UserComments />);

    const deleteBtn = screen.getByRole("button", { name: /^Delete$/i });
    await userEvent.click(deleteBtn);

    const confirmBtn = await screen.findByRole("button", { name: /^Delete$/i });
    await userEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
    });
  });
});
