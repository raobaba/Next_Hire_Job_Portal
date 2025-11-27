import React from "react";
import Navbar from "@/components/shared/Navbar";
import HeroSection from "./HeroSection";
import Footer from "@/components/shared/Footer";
import CategoryCarousel from "./CategoryCarousel";
import FeaturesSection from "./FeaturesSection";
import LatestJobs from "./LatestJobs";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <CategoryCarousel />
        <FeaturesSection />
        <LatestJobs />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
