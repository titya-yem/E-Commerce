import { describe, it, expect, afterEach, vi } from "vitest";
import type { Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminUsersPage from "@/pages/Dashboard/admin/AdminUsersPage";
import { useFetch } from "@/hooks/useFetch";
import type { User } from "@/types/userTypes";

vi.mock("@/hooks/useFetch");

const mockUseFetch = useFetch as unknown as Mock;

const createMockUser = (overrides: Partial<User> = {}): User => ({
  _id: "1",
  userName: "Test User",
  email: "test@example.com",
  role: "User",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const users: User[] = [
  createMockUser({
    _id: "1",
    userName: "John Doe",
    email: "john@example.com",
    role: "Admin",
    isActive: true,
    createdAt: "2025-10-01T12:00:00Z",
    updatedAt: "2025-10-01T12:00:00Z",
  }),
  createMockUser({
    _id: "2",
    userName: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    isActive: false,
    createdAt: "2025-09-15T12:00:00Z",
    updatedAt: "2025-09-15T12:00:00Z",
  }),
];

describe("AdminUsersPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    mockUseFetch.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<AdminUsersPage />);
    expect(screen.getByText(/Loading.../i)).toBeDefined();
  });

  it("shows error state", () => {
    mockUseFetch.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: "Failed to fetch" },
    });

    render(<AdminUsersPage />);
    expect(screen.getByText(/Error: Failed to fetch/i)).toBeDefined();
  });

  it("shows empty state", () => {
    mockUseFetch.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<AdminUsersPage />);
    expect(screen.getByText(/No users available/i)).toBeDefined();
  });

  it("renders users and pagination", async () => {
    mockUseFetch.mockReturnValue({
      data: users,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<AdminUsersPage />);
    expect(await screen.findByText("Users")).toBeDefined();

    expect(screen.getByText("John Doe")).toBeDefined();
    expect(screen.getByText("john@example.com")).toBeDefined();
    expect(screen.getByText("Admin")).toBeDefined();
    expect(screen.getByText("Active")).toBeDefined();

    expect(screen.getByText("Jane Smith")).toBeDefined();
    expect(screen.getByText("jane@example.com")).toBeDefined();
    expect(screen.getByText("User")).toBeDefined();
    expect(screen.getByText("Inactive")).toBeDefined();

    expect(screen.getByRole("button", { name: "1" })).toBeDefined();
  });

  it("filters users by search", async () => {
    mockUseFetch.mockReturnValue({
      data: users,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<AdminUsersPage />);
    const searchInput = screen.getByPlaceholderText(/Search Name/i);

    await userEvent.type(searchInput, "Jane");

    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeDefined();
      expect(screen.queryByText("John Doe")).toBeNull();
    });
  });

  it("changes page when pagination button is clicked", async () => {
    const manyUsers = Array.from({ length: 20 }, (_, i) =>
      createMockUser({
        _id: `${i + 1}`,
        userName: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: "User",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );

    mockUseFetch.mockReturnValue({
      data: manyUsers,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<AdminUsersPage />);
    expect(screen.getByText("User 1")).toBeDefined();

    const page2Btn = screen.getByRole("button", { name: "2" });
    await userEvent.click(page2Btn);

    expect(screen.getByText("User 9")).toBeDefined();
  });
});
