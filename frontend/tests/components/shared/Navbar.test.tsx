import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import cartReducer from "@/store/slices/Cart-Slice";
import authReducer from "@/store/slices/Auth-Slice";
import { Theme } from "@radix-ui/themes";

const renderNavbar = (cartQuantity = 0, isAuthenticated = false) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
    },
    preloadedState: {
      cart: {
        items: [],
        totalPrice: 0,
        totalQuantity: cartQuantity,
        timestamp: Date.now(),
      },
      auth: {
        isAuthenticated,
        user: null,
        loading: false, // ✅ Add missing loading property
      },
    },
  });

  return render(
    <Provider store={store}>
      <Theme>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Theme>
    </Provider>
  );
};

describe("Navbar", () => {
  it("renders logo", () => {
    renderNavbar();
    expect(screen.getByAltText(/pet shop logo/i)).toBeInTheDocument();
  });

  it("renders cart icon", () => {
    renderNavbar();
    expect(screen.getByAltText(/shopping bag/i)).toBeInTheDocument();
  });

  it("shows badge when cart has items", () => {
    renderNavbar(5);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("does not show badge when cart is empty", () => {
    renderNavbar(0);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("renders menu links", () => {
    renderNavbar();
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/shop/i)).toBeInTheDocument();
    expect(screen.getByText(/services/i)).toBeInTheDocument();
  });

  it("renders auth links when not authenticated", () => {
    renderNavbar(0, false);

    // Open menu if links are hidden
    const menuButton = screen.queryByRole("button", { name: /toggle menu/i });
    if (menuButton) {
      fireEvent.click(menuButton);
    }

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it("renders sign out button when authenticated", () => {
    renderNavbar(0, true);

    // Open menu if links are hidden
    const menuButton = screen.queryByRole("button", { name: /toggle menu/i });
    if (menuButton) {
      fireEvent.click(menuButton);
    }

    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });
});
