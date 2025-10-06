import { render, screen } from "@testing-library/react";
import Footer from "@/components/shared/Footer";
import { MemoryRouter } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import { NavbarLists } from "@/constants/Navbar";

describe("Footer", () => {
  const renderFooter = () =>
    render(
      <Theme>
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      </Theme>
    );

  it("renders logo with correct alt text", () => {
    renderFooter();
    const logo = screen.getByAltText(/pet shop logo/i);
    expect(logo).toBeInTheDocument();
  });

  it("renders menu section with correct links from NavbarLists", () => {
    renderFooter();

    expect(screen.getByRole("heading", { name: /menu/i })).toBeInTheDocument();

    NavbarLists.slice(0, 8).forEach((item) => {
      const link = screen.getByRole("link", {
        name: new RegExp(item.label, "i"),
      });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", item.link);
    });
  });

  it("renders contact us section with correct contact info", () => {
    renderFooter();

    expect(
      screen.getByRole("heading", { name: /contact us/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/9400 s normandie ave/i)).toBeInTheDocument();

    const emailLink = screen.getByRole("link", {
      name: /thitya\.yem\.photo@gmail\.com/i,
    });
    expect(emailLink).toHaveAttribute(
      "href",
      "mailto:thitya.yem.photo@gmail.com"
    );

    expect(screen.getByText(/\(323\) 238-0696/i)).toBeInTheDocument();
  });

  it("renders the send email button", () => {
    renderFooter();

    const button = screen.getByRole("link", { name: /send email/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "mailto:thitya.yem.photo@gmail.com");
  });

  it("renders footer copyright text", () => {
    renderFooter();

    expect(
      screen.getByText(/copyright by pet shop\. \(titya yem\)/i)
    ).toBeInTheDocument();
  });
});
