import { render, screen } from "@testing-library/react";
import Total from "@/components/dashboard/admin/Total";
import type { TotalProps } from "@/components/dashboard/admin/Total";

describe("Total Component", () => {
  const defaultProps: TotalProps = {
    title: "Total Sales",
    value: 12345,
    percentage: 10,
    isCurrency: true,
  };

  it("renders the title", () => {
    render(<Total {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  it("renders value formatted as currency when isCurrency is true", () => {
    render(<Total {...defaultProps} />);
    expect(
      screen.getByText(`$${defaultProps.value.toLocaleString()}`)
    ).toBeInTheDocument();
  });

  it("renders value without currency when isCurrency is false", () => {
    render(<Total {...defaultProps} isCurrency={false} />);
    expect(
      screen.getByText(defaultProps.value.toLocaleString())
    ).toBeInTheDocument();
  });

  it("renders positive percentage with green text", () => {
    render(<Total {...defaultProps} percentage={5} />);
    const percentageElement = screen.getByText("5.00%");
    expect(percentageElement).toBeInTheDocument();
    expect(percentageElement).toHaveClass("text-green-500");
  });

  it("renders negative percentage with red text", () => {
    render(<Total {...defaultProps} percentage={-8.5} />);
    const percentageElement = screen.getByText("-8.50%");
    expect(percentageElement).toBeInTheDocument();
    expect(percentageElement).toHaveClass("text-red-500");
  });

  it("renders 'vs last month' text", () => {
    render(<Total {...defaultProps} />);
    expect(screen.getByText(/vs last month/i)).toBeInTheDocument();
  });
});
