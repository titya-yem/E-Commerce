import Recommendation from "@/components/Recommendation";
import Services from "@/components/services/Services";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Outlet } from "react-router-dom";

const ServicesLayout = () => {
  return (
    <>
      <Navbar />
        <main>
          <Outlet />
          <Services />
          <Recommendation />
        </main>
      <Footer />
    </>
  );
};

export default ServicesLayout;