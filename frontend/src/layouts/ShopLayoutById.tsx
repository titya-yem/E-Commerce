import OurBrands from "@/components/OurBrands";
import ScrollToTop from "@/components/scollToTop";
import Footer from "@/components/shared/Footer";
import { Outlet } from "react-router-dom";

const ShopDetailLayout = () => {
  return (
    <>
      <main>
        <Outlet />
        <OurBrands />
        <ScrollToTop />
      </main>
      <Footer />
    </>
  );
};

export default ShopDetailLayout;