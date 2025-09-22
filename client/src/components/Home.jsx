import React from "react";
import Navbar from "@/components/shared/Navbar";
import HeroSection from "./HeroSection";
import Footer from "@/components/shared/Footer";
import CategoryCarousel from "./CategoryCarousel";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        {/* <CategoryCarousel /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
