import { render, screen } from "@testing-library/react";
import OurBrands from "../../src/components/OurBrands";
import { MemoryRouter } from "react-router-dom";

describe("OurBrands", () => {
  it("renders the component with all brand images", () => {
    render(<OurBrands />, { wrapper: MemoryRouter });

    const mockImages = [
      { src: "/src/assets/svg/products/moderna.svg", alt: "Moderna brand" },
      { src: "/src/assets/svg/products/me-o.svg", alt: "Me-o brand" },
    ];

    expect(
      screen.getByRole("heading", { name: "Our cooporate brands" })
    ).toBeInTheDocument();

    expect(screen.getAllByRole("img")).toHaveLength(7);

    mockImages.forEach(({ src, alt }) => {
      const image = screen.getByRole("img", { name: alt });
      expect(image).toHaveAttribute("src", src);
    });
  });
});
