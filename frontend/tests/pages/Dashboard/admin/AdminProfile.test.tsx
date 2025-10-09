import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminProfile from "@/pages/Dashboard/admin/AdminProfile";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Mock } from "vitest";
import type { getMe } from "@/types/userTypes";

vi.mock("@tanstack/react-query");
vi.mock("axios");

const mockUseQuery = useQuery as unknown as Mock;
const mockUseMutation = useMutation as unknown as Mock;
const mockUseQueryClient = vi.fn();

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
    useQueryClient: () => mockUseQueryClient(),
  };
});

const mockProfile: getMe = {
  id: "123",
  role: "admin",
  userName: "John Doe",
  email: "john@example.com",
  isActive: true,
};

describe("AdminProfile Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    mockUseQuery.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      isError: false,
      error: null,
    });

    mockUseMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => render(<AdminProfile />);

  it("shows loading state", () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });

    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error("Fetch error"),
    });

    renderComponent();
    expect(screen.getByText(/error: fetch error/i)).toBeInTheDocument();
  });

  it("shows empty state", () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    });

    renderComponent();
    expect(screen.getByText(/no profile available/i)).toBeInTheDocument();
  });

  it("renders profile details", async () => {
    renderComponent();

    expect(await screen.findByText("Profile")).toBeInTheDocument();
    expect(screen.getByText(mockProfile.userName)).toBeInTheDocument();
    expect(
      screen.getByText(mockProfile.role, { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText(mockProfile.email)).toBeInTheDocument();
  });

  it("opens edit profile dialog and updates", async () => {
    renderComponent();

    const editButton = screen.getByRole("button", { name: /edit profile/i });
    expect(editButton).toBeInTheDocument();

    await userEvent.click(editButton);

    const nameInput = screen.getByPlaceholderText(/enter your full name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Doe");

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "jane@example.com");

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeInTheDocument();

    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUseMutation().mutate).toHaveBeenCalledWith({
        userName: "Jane Doe",
        email: "jane@example.com",
        password: "",
      });
    });
  });
});
