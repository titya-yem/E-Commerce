import Recommendation from "@/components/Recommendation";
import Services from "@/components/services/Services";
import { Outlet } from "react-router";

const ServicesLayout = () => {
  return (
    <>
      <Outlet />
      <Services />
      <Recommendation />
    </>
  );
};

export default ServicesLayout;