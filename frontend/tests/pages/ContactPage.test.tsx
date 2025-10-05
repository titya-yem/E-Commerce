import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import { vi } from "vitest";
import ContactPage from "@/pages/ContactPage";

vi.mock("@/components/ContactForm", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-contact-form">Mock Contact Form</div>,
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

describe("ContactPage", () => {
  it("renders contact image", () => {
    renderWithProviders(<ContactPage />);
    const image = screen.getByAltText("cute cat and dog sitting on a chair");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src");
  });

  it("renders ContactForm component (mocked)", () => {
    renderWithProviders(<ContactPage />);
    const form = screen.getByTestId("mock-contact-form");
    expect(form).toBeInTheDocument();
  });
});
