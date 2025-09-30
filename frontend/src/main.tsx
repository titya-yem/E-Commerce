import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { store } from "./store/store.ts";

// Guards & Layouts
import AuthWrapper from "./auth/AuthWrapper.tsx";
import AdminLayout from "./layouts/Dashboard/AdminDashboardLayout.tsx";
import UserLayout from "./layouts/Dashboard/UserDashboardLayout.tsx";
import AuthRedirect from "./lib/AuthRedirect.tsx";

// Layouts
import RootLayout from "./layouts/RootLayout.tsx";
import ServicesLayout from "./layouts/ServicesLayout.tsx";
import ShopLayout from "./layouts/ShopLayout.tsx";
import ShopDetailLayout from "./layouts/ShopLayoutById.tsx";

// Public Pages
import AppointmentPage from "./pages/AppointmentPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import ServicePage from "./pages/ServicePage.tsx";
import ShopPage from "./pages/ShopPage.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import SuccessPage from "./pages/SuccessPage.tsx";

// Admin Pages
import AdminDashboard from "./pages/Dashboard/admin/AdminDashboardPage.tsx";
import AdminProfile from "./pages/Dashboard/admin/AdminProfile.tsx";
import AdminAppointmentsPage from "./pages/Dashboard/admin/AdminAppointment.tsx";
import AdminCommentsPage from "./pages/Dashboard/admin/AdminComments.tsx";
import AdminOrdersPage from "./pages/Dashboard/admin/AdminOrders.tsx";
import AdminProductsPage from "./pages/Dashboard/admin/AdminProducts.tsx";
import AdminServicesPage from "./pages/Dashboard/admin/AdminServices.tsx";
import AdminUsersPage from "./pages/Dashboard/admin/AdminUsersPage.tsx";
import AdminContactPage from "./pages/Dashboard/admin/AdminContact.tsx";

// User Pages
import UserComments from "./pages/Dashboard/user/UserComments.tsx";
import UserDashboard from "./pages/Dashboard/user/UserDashboard.tsx";
import UserOrders from "./pages/Dashboard/user/UserOrders.tsx";

// Components
import Cart from "./components/Cart.tsx";
import ProductDetailPage from "./components/ProductDetails.tsx";

axios.defaults.withCredentials = true;
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Theme appearance="inherit">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthWrapper>
              <Routes>
                {/* Role-based redirect */}
                <Route path="/dashboard" element={<AuthRedirect />} />

                {/* Public Routes wrapped with RootLayout */}
                <Route path="/" element={<RootLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="appointment" element={<AppointmentPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="services" element={<ServicesLayout />}>
                    <Route index element={<ServicePage />} />
                  </Route>

                  {/* Shop Routes */}
                  <Route path="shop" element={<ShopLayout />}>
                    <Route index element={<ShopPage />} />
                    <Route path=":slug" element={<ShopDetailLayout />}>
                      <Route index element={<ProductDetailPage />} />
                    </Route>
                  </Route>

                  <Route path="cart" element={<Cart />} />
                  <Route path="signin" element={<SignInPage />} />
                  <Route path="signup" element={<SignUpPage />} />
                  <Route path="success" element={<SuccessPage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route
                    path="appointments"
                    element={<AdminAppointmentsPage />}
                  />
                  <Route path="services" element={<AdminServicesPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="comments" element={<AdminCommentsPage />} />
                  <Route path="contact" element={<AdminContactPage />} />
                  <Route path="profile" element={<AdminProfile />} />
                </Route>

                {/* User Routes */}
                <Route path="/user/dashboard" element={<UserLayout />}>
                  <Route index element={<UserDashboard />} />
                  <Route path="orders" element={<UserOrders />} />
                  <Route path="comments" element={<UserComments />} />
                </Route>
              </Routes>
            </AuthWrapper>
          </BrowserRouter>
        </QueryClientProvider>
      </Theme>
    </Provider>
  </StrictMode>
);
