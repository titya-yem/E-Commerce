/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminComments from "@/pages/Dashboard/admin/AdminComments";
import { useFetch } from "@/hooks/useFetch";
import type { Comment } from "@/types/commentTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";

vi.mock("@/hooks/useFetch");
vi.mock("@tanstack/react-query");
vi.mock("axios");

// FIXED MOCK FOR RADIX SELECT (no portal issues)
vi.mock("@radix-ui/react-select", () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children, ...props }: any) => (
    <button role="combobox" {...props}>
      {children}
    </button>
  ),
  SelectValue: ({ children }: any) => <span>{children}</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectViewport: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value, ...props }: any) => (
    <div role="option" data-value={value} {...props}>
      {children}
    </div>
  ),
}));

const mockUseFetch = useFetch as unknown as Mock;

const createMockComment = (overrides: Partial<Comment> = {}): Comment => ({
  _id: "1",
  userName: { userName: "Test User", email: "test@example.com" },
  title: "Test Title",
  text: "Test comment text",
  type: "Dogs Lover",
  status: "Pending",
  ...overrides,
});

const mockData: Comment[] = Array.from({ length: 15 }, (_, i) =>
  createMockComment({
    _id: `${i + 1}`,
    userName: {
      userName: `User${i + 1}`,
      email: `user${i + 1}@mail.com`,
    },
    title: `Title ${i + 1}`,
    text: `Comment text ${i + 1}`,
    type: "Dogs Lover",
    status: "Pending",
  })
);

describe("AdminComments Component", () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    mockUseFetch.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    });

    (useMutation as Mock).mockReturnValue({
      mutate: mockMutate,
    });

    (useQueryClient as Mock).mockReturnValue({
      invalidateQueries: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithTheme = (component: React.ReactNode) =>
    render(<Theme>{component}</Theme>, { container: document.body });

  describe("Loading, Error, and Empty States", () => {
    it("shows loading state", () => {
      mockUseFetch.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      });

      renderWithTheme(<AdminComments />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("shows error state", () => {
      mockUseFetch.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: new Error("Fetch error"),
      });

      renderWithTheme(<AdminComments />);

      expect(screen.getByText(/error: fetch error/i)).toBeInTheDocument();
    });

    it("shows empty state", () => {
      mockUseFetch.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      });

      renderWithTheme(<AdminComments />);

      expect(screen.getByText(/no comments available/i)).toBeInTheDocument();
    });
  });

  describe("Comment Rendering and Interaction", () => {
    it("renders comments and handles pagination", async () => {
      renderWithTheme(<AdminComments />);

      expect(await screen.findByText("Title 1")).toBeInTheDocument();
      expect(screen.queryByText("Title 11")).toBeNull();

      const page2Button = screen.getByRole("button", { name: "2" });
      await userEvent.click(page2Button);

      await waitFor(() => {
        expect(screen.getByText("Title 11")).toBeInTheDocument();
        expect(screen.queryByText("Title 1")).toBeNull();
      });
    });

    it("deletes a comment", async () => {
      renderWithTheme(<AdminComments />);

      const deleteButtons = screen.getAllByRole("button", {
        name: /delete/i,
      });
      expect(deleteButtons.length).toBeGreaterThan(0);

      await userEvent.click(deleteButtons[0]);

      const confirmDeleteButton = await screen.findByRole("button", {
        name: /^delete$/i,
      });
      expect(confirmDeleteButton).toBeEnabled();

      await userEvent.click(confirmDeleteButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith("1");
      });
    });
  });
});
