import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppointmentPage from "@/pages/AppointmentPage";
import { Theme } from "@radix-ui/themes";
import { vi } from "vitest";

vi.mock("@/components/AppointmentForm", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-appointment-form">Mock Form</div>,
}));

beforeAll(() => {
  HTMLElement.prototype.scrollIntoView = vi.fn();
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Theme>
      <MemoryRouter>{ui}</MemoryRouter>
    </Theme>
  );
};

describe("AppointmentPage", () => {
  it("renders hero heading text", () => {
    renderWithProviders(<AppointmentPage />);
    const heading = screen.getByRole("heading", {
      name: /Book an Appointment with us today for your pets/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders hero image", () => {
    renderWithProviders(<AppointmentPage />);
    const heroImage = screen.getByAltText("cute innocent dog");
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute("src");
  });

  it("renders form section image", () => {
    renderWithProviders(<AppointmentPage />);
    const formImage = screen.getByAltText(
      "cute cat and dog sitting on a chair"
    );
    expect(formImage).toBeInTheDocument();
    expect(formImage).toHaveAttribute("src");
  });

  it("renders AppointmentForm component (mocked)", () => {
    renderWithProviders(<AppointmentPage />);
    const form = screen.getByTestId("mock-appointment-form");
    expect(form).toBeInTheDocument();
  });
});
