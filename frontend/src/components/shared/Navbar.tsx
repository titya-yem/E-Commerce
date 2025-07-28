import logo from "@/assets/image/Logo.png";
import ShoppingBag from "@/assets/svg/ShoppingBag.svg";
import toggle from "@/assets/svg/Toggle.svg";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logout } from "@/store/slices/Auth-Slice";
import type { RootState } from "@/store/store";
import { Box, Container, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { NavbarLists } from "../../constants/Navbar";

const Navbar: React.FC = () => {
  const totalQuantity = useSelector((state: RootState) => state.cart.totalQuantity);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  const closeSheet = () => setIsSheetOpen(false);

  const handleSignOut = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signout`, { withCredentials: true });
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const mainNavItems = NavbarLists.slice(0, 3); // Home, Shop, Services
  const extraNavItems = NavbarLists.filter((item) => {
    if (item.label === "Dashboard") {
      return isAuthenticated; 
    }
    return ["Appointment", "Contact"].includes(item.label)
  });
  const authItems = NavbarLists.filter((item) =>
    ["Sign In", "Sign Up"].includes(item.label)
  );

  return (
    <Container className="bg-[#e3462c]">
      <Flex justify="between" align="center" className="py-4 px-4">
        <Box>
          <Link to="/">
            <img src={logo} alt="Pet Shop logo" width={80} height={80} />
          </Link>
        </Box>

        <Flex gap="5" align="center">
          {/* Desktop Nav */}
          {mainNavItems.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              className={`hidden lg:block text-white hover:font-medium duration-200 ${
                location.pathname === item.link
                  ? "underline underline-offset-4 font-medium"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Desktop Dropdown Menu */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="cursor-pointer text-[15px] text-white bg-[#e3462c]">
                  More
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[240px] gap-2 p-4 shadow-md rounded-md">
                    {extraNavItems.map((item) => (
                      <li key={item.link}>
                        <NavigationMenuLink asChild>
                          <Link to={item.link} className="block p-2 rounded-md">
                            <div className="font-medium">{item.label}</div>
                            {item.description && (
                              <div className="text-sm text-muted-foreground">
                                {item.description}
                              </div>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}

                    <li className="border-t pt-2 mt-2">
                      {!isAuthenticated ? (
                        authItems.map((item) => (
                          <NavigationMenuLink asChild key={item.link}>
                            <Link
                              to={item.link}
                              className="block p-2 my-2 rounded-md text-[15px] text-center font-medium text-white hover:text-white bg-red-500 hover:bg-red-600"
                            >
                              {item.label}
                            </Link>
                          </NavigationMenuLink>
                        ))
                      ) : (
                        <button
                          onClick={handleSignOut}
                          className="w-full p-2 rounded-md cursor-pointer text-white bg-red-500 hover:bg-red-600"
                        >
                          Sign Out
                        </button>
                      )}
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <img
              src={ShoppingBag}
              alt="Shopping Bag"
              width={25}
              className="hidden md:block invert"
            />
            {totalQuantity > 0 && (
              <span className="absolute bottom-2 left-3 bg-yellow-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger>
              <img
                src={toggle}
                alt="toggle"
                width={25}
                className="lg:hidden invert focus:outline-none"
              />
            </SheetTrigger>
            <SheetContent className="w-3/4 sm:w-1/2">
              <SheetHeader>
                <SheetTitle className="text-[#e3462c] pb-10 pt-6 text-center">
                  Pet Shop
                </SheetTitle>
                <Box className="text-center space-y-4">
                  {NavbarLists.filter((item) => {
                    if (item.label === "Cart") return true;
                    if (["Sign In", "Sign Up"].includes(item.label)) return false;
                    if (isAuthenticated && ["Sign In", "Sign Up"].includes(item.label)) return false;
                    return true;
                  }).map((item) => (
                    <div
                      key={item.link}
                      onClick={closeSheet}
                      className={`hover:font-medium duration-200 hover:bg-[#e3462c] rounded-lg p-2 hover:text-white ${
                        location.pathname === item.link
                          ? "underline underline-offset-4 font-medium"
                          : ""
                      }`}
                    >
                      <Link to={item.link}>{item.label}</Link>
                    </div>
                  ))}

                  <div className="border-t pt-4 mt-4">
                    {!isAuthenticated ? (
                      authItems.map((item) => (
                        <div key={item.link} onClick={closeSheet}>
                          <Link
                            to={item.link}
                            className="block py-2 rounded-md text-[#e3462c] font-semibold hover:bg-[#e3462c] hover:text-white"
                          >
                            {item.label}
                          </Link>
                        </div>
                      ))
                    ) : (
                      <button
                        onClick={() => {
                          handleSignOut();
                          closeSheet();
                        }}
                        className="w-full py-2 mt-2 rounded-lg text-white bg-red-500 hover:bg-red-600 cursor-pointer transition"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                </Box>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Navbar;
