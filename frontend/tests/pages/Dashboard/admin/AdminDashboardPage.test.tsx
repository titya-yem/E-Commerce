import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import type { Mock } from "vitest";
import AdminDashboard from "@/pages/Dashboard/admin/AdminDashboardPage";
import { useFetchWithCredentail } from "@/hooks/useFetchWithCredentail";
import type { TotalProps } from "@/components/dashboard/admin/Total";

vi.mock("@/components/dashboard/WelcomeDashboard", () => ({
  default: () => <div data-testid="welcome-dashboard">Welcome Dashboard</div>,
}));

vi.mock("@/components/dashboard/admin/LineGraph", () => ({
  default: ({ data }: { data: { month: string; totalRevenue: number }[] }) => (
    <div data-testid="line-graph">LineGraph - {data.length} points</div>
  ),
}));

vi.mock("@/components/dashboard/admin/Total", () => ({
  default: ({ title, value, percentage, isCurrency }: TotalProps) => (
    <div data-testid={`total-${title}`}>
      {title}: {isCurrency ? `$${value}` : value} ({percentage.toFixed(2)}%)
    </div>
  ),
}));

vi.mock("@/components/dashboard/admin/TotalAppointments", () => ({
  default: () => (
    <div data-testid="total-appointments">Total Appointments Component</div>
  ),
}));

vi.mock("@/hooks/useFetchWithCredentail", () => ({
  useFetchWithCredentail: vi.fn(),
}));

describe("AdminDashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dashboard with computed totals", () => {
    (useFetchWithCredentail as unknown as Mock).mockImplementation(
      ({ queryKey }: { queryKey: string[] }) => {
        switch (queryKey[0]) {
          case "sales":
            return { data: [{ totalSales: 100 }, { totalSales: 200 }] };
          case "orders":
            return { data: [{ totalOrders: 50 }, { totalOrders: 75 }] };
          case "revenue":
            return { data: [{ month: "Jan", totalRevenue: 5000 }] };
          case "users":
            return { data: [{ totalUsers: 20 }, { totalUsers: 40 }] };
          default:
            return { data: [] };
        }
      }
    );

    render(<AdminDashboard />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("welcome-dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("line-graph")).toHaveTextContent("LineGraph");

    expect(screen.getByTestId("total-Total Sales")).toHaveTextContent(
      "Total Sales: $200 (100.00%)"
    );
    expect(screen.getByTestId("total-Total Orders")).toHaveTextContent(
      "Total Orders: 75 (50.00%)"
    );
    expect(screen.getByTestId("total-Total Users")).toHaveTextContent(
      "Total Users: 40 (100.00%)"
    );

    expect(screen.getByText("Vitals per Month")).toBeInTheDocument();
    expect(screen.getByTestId("total-appointments")).toBeInTheDocument();
  });

  it("renders correctly when no data is returned", () => {
    (useFetchWithCredentail as unknown as Mock).mockReturnValue({
      data: [],
    });

    render(<AdminDashboard />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("line-graph")).toHaveTextContent("0 points");
  });
});
