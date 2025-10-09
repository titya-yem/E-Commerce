import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import type { Mock } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";

import AdminAppointments from "@/pages/Dashboard/admin/AdminAppointment";
import { useFetch } from "@/hooks/useFetch";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import axios from "axios";

// --- Mocks ---
vi.mock("@/hooks/useFetch");
vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));
vi.mock("@/hooks/useMediaQuery", () => ({
  useMediaQuery: vi.fn(),
}));
vi.mock("axios");

// --- Fix for Radix UI in Vitest ---
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.hasPointerCapture = () => false;
});

// Helper to wrap component with react-query and theme
const renderWithClient = (ui: React.ReactNode) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <Theme>{ui}</Theme>
    </QueryClientProvider>
  );
};

describe("AdminAppointments Component", () => {
  const mockUseFetch = useFetch as unknown as Mock;
  const mockUseSelector = useSelector as unknown as Mock;
  const mockUseMediaQuery = useMediaQuery as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSelector.mockReturnValue({ userName: "TestUser" });
    mockUseMediaQuery.mockImplementation((query) => {
      if (query === "(min-width: 768px)") return true;
      if (query === "(min-width: 1280px)") return true;
      return false;
    });
  });

  it("shows loading state", () => {
    mockUseFetch.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderWithClient(<AdminAppointments />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUseFetch.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch"),
    });

    renderWithClient(<AdminAppointments />);
    expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
  });

  it("shows empty state", () => {
    mockUseFetch.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    renderWithClient(<AdminAppointments />);
    expect(screen.getByText(/No Appointments available/i)).toBeInTheDocument();
  });

  it("renders appointments and allows status change", async () => {
    mockUseFetch.mockReturnValue({
      data: [
        {
          _id: "1",
          name: "John Doe",
          email: "john@example.com",
          type: "Consultation",
          time: "14:30",
          date: "2025-10-10",
          status: "Incomplete",
        },
        {
          _id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          type: "Therapy",
          time: "09:00",
          date: "2025-10-11",
          status: "Completed",
        },
      ],
      isLoading: false,
      isError: false,
    });

    renderWithClient(<AdminAppointments />);

    expect(screen.getByText(/Appointments/i)).toBeInTheDocument();

    const nameCells = screen.getAllByText("TestUser");
    expect(nameCells.length).toBeGreaterThan(0);

    const firstRow = nameCells[0].closest("div");
    expect(firstRow).toBeTruthy();

    if (firstRow) {
      const { getByText } = within(firstRow);
      expect(getByText("john@example.com")).toBeInTheDocument();
      expect(getByText("Consultation")).toBeInTheDocument();
      expect(getByText(/2:30\s*PM/i)).toBeInTheDocument();
      expect(getByText("2025-10-10")).toBeInTheDocument();
    }

    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes.length).toBeGreaterThan(0);

    await userEvent.click(comboboxes[0]);

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "Cancelled" })
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("option", { name: "Cancelled" }));

    expect(axios.patch).toHaveBeenCalledWith(
      expect.stringContaining("/api/appointment/1/status"),
      { status: "Cancelled" }
    );
  });

  it("filters appointments by search term", async () => {
    mockUseFetch.mockReturnValue({
      data: [
        {
          _id: "1",
          name: "John Doe",
          email: "john@example.com",
          type: "Consultation",
          time: "14:30",
          date: "2025-10-10",
          status: "Incomplete",
        },
        {
          _id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          type: "Therapy",
          time: "09:00",
          date: "2025-10-11",
          status: "Completed",
        },
      ],
      isLoading: false,
      isError: false,
    });

    renderWithClient(<AdminAppointments />);

    const searchInput = screen.getByPlaceholderText(/Search by name or email/i);
    await userEvent.type(searchInput, "Jane");

    await waitFor(() => {
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
      expect(screen.queryByText("john@example.com")).not.toBeInTheDocument();
    });
  });
});
