/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminContact from "@/pages/Dashboard/admin/AdminContact";
import { useQuery } from "@tanstack/react-query";
import type { Mock } from "vitest";
import type { Contact } from "@/types/contactTypes";

vi.mock("@tanstack/react-query");
vi.mock("axios");
vi.mock("@/components/shared/SearchText", () => ({
  default: ({ value, onChange, placeholder }: any) => (
    <input
      role="searchbox"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const mockUseQuery = useQuery as unknown as Mock;

const createMockContact = (overrides: Partial<Contact> = {}): Contact => ({
  _id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phoneNumber: "1234567890",
  message: "Hello!",
  createdAt: new Date().toISOString(),
  ...overrides,
});

const mockData: Contact[] = Array.from({ length: 15 }, (_, i) =>
  createMockContact({
    _id: `${i + 1}`,
    firstName: `First${i + 1}`,
    lastName: `Last${i + 1}`,
    email: `user${i + 1}@mail.com`,
    phoneNumber: `12345${i}`,
    message: `Message ${i + 1}`,
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
  })
);

describe("AdminContact Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    mockUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => render(<AdminContact />);

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
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    renderComponent();
    expect(screen.getByText(/no contacts available/i)).toBeInTheDocument();
  });

  it("renders contacts and paginates", async () => {
    renderComponent();

    expect(await screen.findByText("First1 Last1")).toBeInTheDocument();
    expect(screen.queryByText("First9 Last9")).toBeNull();

    const page2Button = screen.getByRole("button", { name: "2" });
    await userEvent.click(page2Button);

    await waitFor(() => {
      expect(screen.getByText("First9 Last9")).toBeInTheDocument();
      expect(screen.queryByText("First1 Last1")).toBeNull();
    });
  });

  it("filters contacts by email", async () => {
    renderComponent();

    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toBeInTheDocument();

    await userEvent.type(searchInput, "user10@mail.com");

    await waitFor(() => {
      expect(screen.getByText("First10 Last10")).toBeInTheDocument();
      expect(screen.queryByText("First1 Last1")).toBeNull();
    });
  });

  it("opens contact message dialog", async () => {
    renderComponent();

    const viewButtons = screen.getAllByRole("button", { name: /view/i });
    expect(viewButtons.length).toBeGreaterThan(0);

    await userEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(mockData[0].message)).toBeInTheDocument();
    });
  });
});
