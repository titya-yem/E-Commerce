import TopCategories from "@/components/cateogry/TopCategories";
import HeroCat from "@/components/HeroCat";
import OurBrands from "@/components/OurBrands";
import Recommendation from "@/components/Recommendation";
import Services from "@/components/services/Services";
import AboutSection from "@/components/shared/AboutSection";
import React from "react";
import { Outlet } from "react-router-dom";

const RootLayout: React.FC = () => {

  return (
    <>
      <Outlet />
      <HeroCat />
      <AboutSection />
      <TopCategories />
      <Services />
      <Recommendation />
      <OurBrands />
    </>
  );
};

export default RootLayout;
