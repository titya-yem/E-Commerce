import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ServicesPage from "@/pages/ServicePage";
import { Theme } from "@radix-ui/themes";
import { vi } from "vitest";

// Polyfill for framer-motion viewport animation
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

describe("ServicesPage", () => {
  it("renders main heading", () => {
    renderWithProviders(<ServicesPage />);
    const heading = screen.getByRole("heading", {
      name: /Love is a for- legs words/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders subheading text", () => {
    renderWithProviders(<ServicesPage />);
    const subheading = screen.getByText(
      (_content, element) =>
        element?.tagName === "P" &&
        element?.textContent?.includes(
          "Affordable pet services that you cannot find anywhere but here"
        )
    );
    expect(subheading).toBeInTheDocument();
  });

  it("renders appointment link", () => {
    renderWithProviders(<ServicesPage />);
    const appointmentLink = screen.getByText(
      /Schedule your appointment Today/i
    );
    expect(appointmentLink).toBeInTheDocument();
    expect(appointmentLink.closest("a")).toHaveAttribute(
      "href",
      "/appointment"
    );
  });

  it("renders Book Appointment button", () => {
    renderWithProviders(<ServicesPage />);
    const button = screen.getByRole("link", { name: /Book Appointment/i });
    expect(button).toBeInTheDocument();
  });

  it("renders service image", () => {
    renderWithProviders(<ServicesPage />);
    const image = screen.getByAltText("Smiling dog and cat sitting together");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src");
  });
});
