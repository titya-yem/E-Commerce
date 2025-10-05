import { render, screen } from "@testing-library/react";
import AboutSection from "../../../src/components/shared/AboutSection";
import { MemoryRouter } from "react-router-dom";

describe("AboutSection", () => {
  it("should render text contents, image and buttoner", () => {
    render(<AboutSection />, { wrapper: MemoryRouter });

    // Check the heading
    expect(screen.getByTestId("about-us-heading")).toBeInTheDocument();

    // Check image
    const image = screen.getByAltText("about image") as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain("About-image.png");

    // Check button
    expect(
      screen.getByRole("link", { name: /Explore Our Services/i })
    ).toBeInTheDocument();
  });
});
