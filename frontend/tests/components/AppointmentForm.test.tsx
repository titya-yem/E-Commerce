import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { Theme } from "@radix-ui/themes";
import { vi } from "vitest";
import AppointmentForm from "@/components/AppointmentForm";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

// Mock Redux store
const mockStore = (user: { id: string } | null = { id: "123" }) =>
  configureStore({
    preloadedState: {
      auth: { user },
    },
    reducer: {
      auth: (state = { user }) => state,
    },
  });

// Mock dependencies
vi.mock("axios");
vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  success: vi.fn(),
  error: vi.fn(),
}));

// Polyfill for scrollIntoView
beforeAll(() => {
  HTMLElement.prototype.scrollIntoView = vi.fn();
});

const renderWithProviders = (
  ui: React.ReactElement,
  user: { id: string } | null = { id: "123" }
) => {
  const store = mockStore(user);
  return render(
    <Provider store={store}>
      <Theme>
        <MemoryRouter>{ui}</MemoryRouter>
      </Theme>
    </Provider>
  );
};

describe("AppointmentForm", () => {
  it("renders the form title", () => {
    renderWithProviders(<AppointmentForm />);
    const heading = screen.getByRole("heading", {
      name: /schedule an appointment/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders all input fields", () => {
    renderWithProviders(<AppointmentForm />);
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/additional message/i)
    ).toBeInTheDocument();
  });

  it("renders appointment type buttons", () => {
    renderWithProviders(<AppointmentForm />);
    const buttons = [
      "Vacation",
      "Bathing",
      "Cut & Trim hair",
      "Food & Supplies",
      "Party",
    ];
    buttons.forEach((type) => {
      expect(screen.getByRole("button", { name: type })).toBeInTheDocument();
    });
  });

  it("renders time and date pickers", () => {
    renderWithProviders(<AppointmentForm />);
    expect(screen.getByRole("combobox")).toBeInTheDocument(); // time select
    expect(
      screen.getByDisplayValue(new Date().toLocaleDateString())
    ).toBeInTheDocument(); // default date
  });

  it("renders submit button", () => {
    renderWithProviders(<AppointmentForm />);
    const submitButton = screen.getByRole("button", {
      name: /book appointment/i,
    });
    expect(submitButton).toBeInTheDocument();
  });

  it("shows AppointmentDirection when user is not logged in", () => {
    vi.mock("@/components/AppointmentDirection", () => ({
      __esModule: true,
      AppointmentDirection: () => (
        <div data-testid="mock-direction">Login prompt</div>
      ),
    }));

    renderWithProviders(<AppointmentForm />, null);
    expect(screen.getByTestId("mock-direction")).toBeInTheDocument();
  });
});
