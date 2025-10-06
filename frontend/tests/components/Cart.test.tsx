import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/store/slices/Cart-Slice";
import Cart from "@/components/Cart";
import type { CartState, CartItem } from "@/store/slices/Cart-Slice";

const mockCartItem: CartItem = {
  id: "1",
  name: "Test Product",
  category: "Test Category",
  price: 20,
  quantity: 2,
  image: "test.jpg",
  description: "Test product description",
};

const renderCart = (cartState: CartState) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: cartState,
    },
  });

  return render(
    <Provider store={store}>
      <Cart />
    </Provider>
  );
};

describe("Cart Component", () => {
  it("renders empty cart message", () => {
    renderCart({ items: [], totalPrice: 0, totalQuantity: 0 });

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  it("renders cart items and total price", () => {
    renderCart({
      items: [mockCartItem],
      totalPrice: mockCartItem.price * mockCartItem.quantity,
      totalQuantity: mockCartItem.quantity,
    });

    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    expect(screen.getByText(/\$20\.00/i)).toBeInTheDocument();
    expect(screen.getByText(/Qty: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Total:/i)).toHaveTextContent("$40.00");
  });

  it("increases quantity when + button is clicked", () => {
    renderCart({
      items: [mockCartItem],
      totalPrice: mockCartItem.price * mockCartItem.quantity,
      totalQuantity: mockCartItem.quantity,
    });

    const plusButton = screen.getByText("+");
    fireEvent.click(plusButton);

    expect(screen.getByText(/Qty: 3/i)).toBeInTheDocument();
  });

  it("decreases quantity when - button is clicked", () => {
    renderCart({
      items: [mockCartItem],
      totalPrice: mockCartItem.price * mockCartItem.quantity,
      totalQuantity: mockCartItem.quantity,
    });

    const minusButton = screen.getByText("-");
    fireEvent.click(minusButton);

    expect(screen.getByText(/Qty: 1/i)).toBeInTheDocument();
  });

  it("disables checkout button if cart is empty", () => {
    renderCart({ items: [], totalPrice: 0, totalQuantity: 0 });

    const checkoutButton = screen.getByRole("button", { name: /checkout/i });
    expect(checkoutButton).toBeDisabled();
  });
});
