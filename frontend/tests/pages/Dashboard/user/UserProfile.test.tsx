import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProfile from "@/pages/Dashboard/user/UserProfile";
import axios from "axios";
import type { Mock } from "vitest";

vi.mock("axios");

const mockedAxios = axios as unknown as {
  get: Mock;
  put: Mock;
};

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // prevent retrying in tests
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

const mockProfileData = {
  id: "u1",
  userName: "John Doe",
  email: "john@example.com",
  role: "User",
  isActive: true,
};

describe("UserProfile", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockedAxios.get.mockImplementationOnce(() => new Promise(() => {}));
    renderWithQueryClient(<UserProfile />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows error state when fetch fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Fetch error"));

    renderWithQueryClient(<UserProfile />);

    await waitFor(() =>
      expect(screen.getByText(/error: fetch error/i)).toBeInTheDocument()
    );
  });

  it("shows no profile available when data.user is null", async () => {
    // Mock returns data.user = null for null profile case
    mockedAxios.get.mockResolvedValueOnce({ data: { user: null } });

    renderWithQueryClient(<UserProfile />);

    await waitFor(() =>
      expect(screen.getByText(/no profile available/i)).toBeInTheDocument()
    );
  });

  it("renders profile data correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { user: mockProfileData } });

    renderWithQueryClient(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText("User")).toBeInTheDocument();
      expect(screen.getByText(mockProfileData.userName)).toBeInTheDocument();
      expect(screen.getByText(mockProfileData.email)).toBeInTheDocument();
    });
  });

  it("opens edit form and saves profile successfully", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { user: mockProfileData } });
    mockedAxios.put.mockResolvedValueOnce({ data: { success: true } });

    renderWithQueryClient(<UserProfile />);

    await waitFor(() =>
      expect(screen.getByText(/edit profile/i)).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText(/edit profile/i));

    const nameInput = screen.getByPlaceholderText(/enter your full name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
    fireEvent.change(emailInput, { target: { value: "jane@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "newpassword" } });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() =>
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          userName: "Jane Doe",
          email: "jane@example.com",
          password: "newpassword",
        },
        { withCredentials: true }
      )
    );
  });
});
