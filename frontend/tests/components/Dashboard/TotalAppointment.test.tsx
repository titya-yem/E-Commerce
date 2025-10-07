/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { vi } from "vitest";
import TotalAppointments from "@/components/dashboard/admin/TotalAppointments";
import { useFetch } from "@/hooks/useFetch";
import authReducer from "@/store/slices/Auth-Slice";
import type { AuthState } from "@/store/slices/Auth-Slice";
import type { AppointmentTypes } from "@/types/AppointmentTypes";

vi.mock("@/hooks/useFetch", () => ({
  useFetch: vi.fn(),
}));

function renderWithStore(
  ui: React.ReactElement,
  preloadedState?: { auth?: AuthState }
) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: preloadedState?.auth || {
        isAuthenticated: true,
        user: {
          id: "1",
          email: "test@example.com",
          userName: "John",
          role: "admin",
        },
        loading: false,
      },
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
}

describe("TotalAppointments Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state", () => {
    (useFetch as any).mockReturnValue({
      isLoading: true,
      isError: false,
      data: [],
      error: null,
    });

    renderWithStore(<TotalAppointments />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("should render error state", () => {
    (useFetch as any).mockReturnValue({
      isLoading: false,
      isError: true,
      data: [],
      error: new Error("Failed to fetch"),
    });

    renderWithStore(<TotalAppointments />);
    expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
  });

  it("should render no appointments", () => {
    (useFetch as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
      error: null,
    });

    renderWithStore(<TotalAppointments />);
    expect(screen.getByText(/No appointment available/i)).toBeInTheDocument();
  });

  it("should render appointments list", () => {
    const mockAppointments: AppointmentTypes[] = [
      {
        _id: "1",
        email: "user1@example.com",
        time: "09:00",
        type: "Consultation",
        date: "2025-10-06",
        status: "Completed",
      },
      {
        _id: "2",
        email: "user2@example.com",
        time: "10:30",
        type: "Follow-up",
        date: "2025-10-07",
        status: "Pending",
      },
    ];

    (useFetch as any).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockAppointments,
      error: null,
    });

    renderWithStore(<TotalAppointments />);

    expect(
      screen.getByText(/Total Appointments \(monthly\)/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText("John").length).toBe(mockAppointments.length);
    expect(screen.getByText("Consultation")).toBeInTheDocument();
    expect(screen.getByText("Follow-up")).toBeInTheDocument();
  });
});
