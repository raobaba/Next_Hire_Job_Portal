import React from "react";
import Navbar from "@/components/shared/Navbar";
import HeroSection from "./HeroSection";
import Footer from "@/components/shared/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection/>
      <Footer />
    </div>
  );
};

export default Home;
