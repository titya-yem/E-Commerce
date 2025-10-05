import { render, screen } from "@testing-library/react";
import AboutSection from "@/components/shared/AboutSection";
import { MemoryRouter } from "react-router-dom";

describe("AboutSection", () => {
  it("should render text contents, image, and button", () => {
    render(<AboutSection />, { wrapper: MemoryRouter });

    expect(screen.getByTestId("about-us-heading")).toBeInTheDocument();

    const image = screen.getByAltText("about image") as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain("About-image.png");

    expect(
      screen.getByRole("link", { name: /Explore Our Services/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Until one has loved an animal/i)
    ).toBeInTheDocument();
  });
});
