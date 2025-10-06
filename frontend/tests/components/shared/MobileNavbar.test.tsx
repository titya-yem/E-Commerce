import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import MobileNavbar from "@/components/shared/MobileNavbar";
import cartReducer from "@/store/slices/Cart-Slice";
import authReducer from "@/store/slices/Auth-Slice";
import type { User, AuthState } from "@/store/slices/Auth-Slice";

// Mock user object with correct type
const mockUser: User = {
  role: "admin",
  id: "123",
  userName: "Test User",
  email: "test@example.com",
};

const renderMobileNavbar = (
  cartQuantity = 0,
  isAuthenticated = false,
  user: User | null = null
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
        totalQuantity: cartQuantity,
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
      <MemoryRouter>
        <MobileNavbar />
      </MemoryRouter>
    </Provider>
  );
};

describe("MobileNavbar", () => {
  it("renders toggle button", () => {
    renderMobileNavbar();
    expect(screen.getByAltText(/toggle menu/i)).toBeInTheDocument();
  });

  it("opens sheet when toggle clicked", () => {
    renderMobileNavbar();
    fireEvent.click(screen.getByAltText(/toggle menu/i));
    expect(screen.getByText(/Pet Shop/i)).toBeInTheDocument();
  });

  it("shows auth links when not authenticated", () => {
    renderMobileNavbar(0, false);
    fireEvent.click(screen.getByAltText(/toggle menu/i));
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it("shows sign out button when authenticated", () => {
    renderMobileNavbar(0, true, mockUser);
    fireEvent.click(screen.getByAltText(/toggle menu/i));
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });

  it("opens dashboard menu", () => {
    renderMobileNavbar(0, true, mockUser);
    fireEvent.click(screen.getByAltText(/toggle menu/i));
    const dashboardToggle = screen.getByText(/dashboard/i);
    fireEvent.click(dashboardToggle);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});
