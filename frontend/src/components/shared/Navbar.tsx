import logo from "@/assets/image/Logo.png";
import ShoppingBag from "@/assets/svg/shoppingBag.svg";
import { Box, Container, Flex } from "@radix-ui/themes";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import type { RootState } from "@/store/store";

import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

const Navbar: React.FC = () => {
  const totalQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const location = useLocation();

  return (
    <Container className="cursor-pointer bg-[#e3462c]">
      <Flex justify="between" align="center" className="py-4 px-4">
        {/* Logo */}
        <Box>
          <Link to="/">
            <img src={logo} alt="Pet Shop logo" width={80} height={80} />
          </Link>
        </Box>

        {/* Navigation */}
        <Flex gap="5" align="center">
          <DesktopNavbar location={location} />
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
          <MobileNavbar />
        </Flex>
      </Flex>
    </Container>
  );
};

export default Navbar;
