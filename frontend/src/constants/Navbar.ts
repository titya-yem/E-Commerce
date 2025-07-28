interface NavbarList {
  label: string;
  link: string;
  description?: string;
}

export const NavbarLists: NavbarList[] = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Shop",
    link: "/shop",
  },
  {
    label: "Services",
    link: "/services",
  },
  {
    label: "Appointment",
    link: "/appointment",
    description: "Book an appointment with our team",
  },
  {
    label: "Dashboard",
    link: "/dashboard",
    description: "Manage your website fully functional",
  },
  {
    label: "Contact",
    link: "/contact",
    description: "Get in touch with us",
  },
  {
    label: "Sign In",
    link: "/signin",
    description: "Sign in to your account",
  },
  {
    label: "Sign Up",
    link: "/signup",
    description: "Create an account",
  },
  {
    label: "Cart",
    link: "/cart",
  },
];