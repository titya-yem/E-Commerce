import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserDashboard from "@/pages/Dashboard/user/UserDashboard";
import { useFetch } from "@/hooks/useFetch";
import type { Mock } from "vitest";
import type { AppointmentTypes } from "@/types/AppointmentTypes";

vi.mock("@/hooks/useFetch");

vi.mock("@/components/dashboard/WelcomeDashboard", () => ({
  default: () => <div data-testid="mock-welcome-dashboard" />,
}));

vi.mock("@/pages/Dashboard/user/UserProfile", () => ({
  default: () => <div data-testid="mock-user-profile" />,
}));

const mockUseFetch = useFetch as unknown as Mock;

const createMockAppointment = (
  overrides: Partial<AppointmentTypes> = {}
): AppointmentTypes => ({
  _id: "1",
  type: "Checkup",
  date: new Date().toISOString(),
  time: "14:00",
  email: "user@mail.com",
  status: "Pending",
  user: {
    _id: "u1",
    userName: "John Doe",
    email: "john@example.com",
  },
  ...overrides,
});

const mockData: AppointmentTypes[] = Array.from({ length: 5 }, (_, i) =>
  createMockAppointment({
    _id: `${i + 1}`,
    type: `Type ${i + 1}`,
    date: new Date(Date.now() + i * 1000 * 60 * 60 * 24).toISOString(),
    time: "14:00",
    email: `user${i + 1}@mail.com`,
    status: "Confirmed",
    user: {
      _id: `u${i + 1}`,
      userName: `User${i + 1}`,
      email: `user${i + 1}@mail.com`,
    },
  })
);

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("UserDashboard Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    mockUseFetch.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => renderWithQueryClient(<UserDashboard />);

  it("shows loading state", () => {
    mockUseFetch.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });

    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUseFetch.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: "Fetch error" },
    });

    renderComponent();
    expect(screen.getByText(/error: fetch error/i)).toBeInTheDocument();
  });

  it("shows empty state", () => {
    mockUseFetch.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    renderComponent();
    expect(screen.getByText(/no appointments available/i)).toBeInTheDocument();
  });

  it("renders appointments list", async () => {
    renderComponent();

    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();

    mockData.forEach((appointment) => {
      expect(
        screen.getByText(appointment.user?.userName || "Unknown")
      ).toBeInTheDocument();
      expect(screen.getByText(appointment.email || "—")).toBeInTheDocument();
      expect(screen.getByText(appointment.type)).toBeInTheDocument();
    });

    // Ensure mocked child components are rendered
    expect(screen.getByTestId("mock-welcome-dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("mock-user-profile")).toBeInTheDocument();
  });

  it("shows correct date colors for past and future appointments", async () => {
    const pastAppointment = createMockAppointment({
      _id: "past",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      time: "10:00",
      status: "Past",
    });

    const futureAppointment = createMockAppointment({
      _id: "future",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      time: "12:00",
      status: "Upcoming",
    });

    mockUseFetch.mockReturnValue({
      data: [pastAppointment, futureAppointment],
      isLoading: false,
      isError: false,
      error: null,
    });

    renderComponent();

    const pastDateText = new Date(pastAppointment.date)
      .toISOString()
      .split("T")[0];
    const futureDateText = new Date(futureAppointment.date)
      .toISOString()
      .split("T")[0];

    const pastDateEl = await screen.findByText((content) =>
      content.includes(pastDateText)
    );

    const futureDateEl = await screen.findByText((content) =>
      content.includes(futureDateText)
    );

    expect(pastDateEl).toBeInTheDocument();
    expect(futureDateEl).toBeInTheDocument();

    expect(pastDateEl.getAttribute("data-accent-color")).toBe("red");
    expect(futureDateEl.getAttribute("data-accent-color")).toBe("green");
  });
});
