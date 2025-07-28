import OurBrands from "@/components/OurBrands";
import ScrollToTop from "@/components/scollToTop";
import { Outlet } from "react-router-dom";

const ShopDetailLayout = () => {
  return (
    <>
      <Outlet />
      <OurBrands />
      <ScrollToTop />
    </>
  );
};

export default ShopDetailLayout;