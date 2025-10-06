import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import DesktopNavbar from "@/components/shared/DesktopNavbar";
import cartReducer from "@/store/slices/Cart-Slice";
import authReducer from "@/store/slices/Auth-Slice";
import type { User, AuthState } from "@/store/slices/Auth-Slice";

// Mock user
const mockUser: User = {
  role: "admin",
  id: "123",
  userName: "Test User",
  email: "test@example.com",
};

// Helper to render DesktopNavbar
const renderDesktopNavbar = (
  isAuthenticated = false,
  user: User | null = null,
  pathname = "/"
) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
    },
    preloadedState: {
      cart: {
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
        timestamp: Date.now(),
      },
      auth: {
        isAuthenticated,
        user,
        loading: false,
      } as AuthState,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[pathname]}>
        <DesktopNavbar location={{ pathname }} />
      </MemoryRouter>
    </Provider>
  );
};

describe("DesktopNavbar", () => {
  it("renders main nav items", () => {
    renderDesktopNavbar();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Shop/i)).toBeInTheDocument();
    expect(screen.getByText(/Services/i)).toBeInTheDocument();
  });

  it("renders 'More' menu button", () => {
    renderDesktopNavbar();
    const moreButton = screen.getByText(/More/i);
    expect(moreButton).toBeInTheDocument();
  });

  it("shows auth links when not authenticated", () => {
    renderDesktopNavbar(false, null);
    fireEvent.click(screen.getByText(/More/i));
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it("shows sign out button when authenticated", () => {
    renderDesktopNavbar(true, mockUser);
    fireEvent.click(screen.getByText(/More/i));
    expect(screen.getByText(/Sign Out/i)).toBeInTheDocument();
  });

  it("marks active link correctly", () => {
    renderDesktopNavbar(false, null, "/shop");
    const shopLink = screen.getByText(/Shop/i);
    expect(shopLink).toHaveClass("underline");
  });
});
