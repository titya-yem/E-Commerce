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

// Components
import AuthWrapper from "./auth/AuthWrapper.tsx";
import Cart from "./components/Cart.tsx";
import ProductDetailPage from "./components/ProductDetails.tsx";
import Footer from "./components/shared/Footer.tsx";
import Navbar from "./components/shared/Navbar.tsx";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import RootLayout from "./layouts/RootLayout.tsx";
import ServicesLayout from "./layouts/ServicesLayout.tsx";
import ShopLayout from "./layouts/ShopLayout.tsx";
import ShopDetailLayout from "./layouts/ShopLayoutById.tsx";

// Pages
import AdminWrapper from "./auth/AdminWrapper.tsx";
import AppointmentPage from "./pages/AppointmentPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import AppointmentsPage from "./pages/Dashboard/appointment.tsx";
import CommentsPage from "./pages/Dashboard/comments.tsx";
import ContactsPage from "./pages/Dashboard/contacts.tsx";
import OrdersPage from "./pages/Dashboard/orders.tsx";
import ProductsPage from "./pages/Dashboard/products.tsx";
import ServicesPage from "./pages/Dashboard/services.tsx";
import UsersPage from "./pages/Dashboard/users.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import ServicePage from "./pages/ServicePage.tsx";
import ShopPage from "./pages/ShopPage.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";

axios.defaults.withCredentials = true;
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Theme appearance="inherit">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthWrapper>
              <Navbar />
              <Routes>
                {/* Home Page */}
                <Route path="/" element={<RootLayout />}>
                  <Route index element={<HomePage />} />
                </Route>

                {/* Appointment Page */}
                <Route path="/appointment" element={<AppointmentPage />} />

                {/* Shop Pages */}
                <Route path="/shop" element={<ShopLayout />}>
                  <Route index element={<ShopPage />} />
                </Route>
                <Route path="/shop/:slug" element={<ShopDetailLayout />}>
                  <Route index element={<ProductDetailPage />} />
                </Route>

                {/* Services Page */}
                <Route path="/services" element={<ServicesLayout />}>
                  <Route index element={<ServicePage />} />
                </Route>

                {/* Contact Page */}
                <Route path="/contact" element={<ContactPage />} />

                {/* Dashboard Page for admin */}
                <Route path="/dashboard" element={<AdminWrapper><DashboardLayout /></AdminWrapper>}>
                  <Route index element={<DashboardPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="appointments" element={<AppointmentsPage />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="comments" element={<CommentsPage />} />
                  <Route path="contacts" element={<ContactsPage />} />
                </Route>

                {/* Dashboard Page for user */}

                {/* SignIn Page */}
                <Route path="/signin" element={<SignInPage />} />

                {/* SignUp Page */}
                <Route path="/signup" element={<SignUpPage />} />

                {/* Cart Page */}
                <Route path="/cart" element={<Cart />} />
              </Routes>
              <Footer />
            </AuthWrapper> 
          </BrowserRouter>
        </QueryClientProvider>
      </Theme>
    </Provider>
  </StrictMode>
);