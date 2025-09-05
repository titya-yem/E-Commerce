import OurBrands from "@/components/OurBrands";
import ScrollToTop from "@/components/scollToTop";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Outlet } from "react-router-dom";

const ShopDetailLayout = () => {
  return (
    <>
      <Navbar />
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