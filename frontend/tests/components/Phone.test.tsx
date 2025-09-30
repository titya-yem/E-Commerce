import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Phone from "@/components/Phone";
import userEvent from "@testing-library/user-event";

describe("OurBrands", () => {
  it("Phone component navigates on click", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Phone title="Call Us" link="contact" />} />
          <Route path="/contact" element={<div>Contact Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /Call Us/i });
    expect(link).toHaveAttribute("href", "/contact");

    const img = screen.getByRole("img", { name: /phone icon/i });
    expect(img).toBeInTheDocument();

    // simulate click
    await user.click(link);

    // assert navigation
    expect(screen.getByText("Contact Page")).toBeInTheDocument();
  });
});
