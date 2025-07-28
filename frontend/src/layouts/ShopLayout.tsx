import OurBrands from "@/components/OurBrands";
import Products from "@/components/Products";
import { Outlet } from "react-router-dom";

const ShopLayout = () => {
  return (
    <>
      <Outlet />
      <Products />
      <OurBrands />
    </>
  );
};

export default ShopLayout;