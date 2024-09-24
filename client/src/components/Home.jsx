import React from "react";
import Navbar from "@/components/shared/Navbar";
import HeroSection from "./HeroSection";
import Footer from "@/components/shared/Footer";
import CategoryCarousel from "./CategoryCarousel";

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection/>
      <CategoryCarousel/>
      <Footer />
    </div>
  );
};

export default Home;
