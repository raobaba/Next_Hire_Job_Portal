import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "./HeroSection";
import Footer from "@/components/layout/Footer";
import CategoryCarousel from "./CategoryCarousel";
import FeaturesSection from "./FeaturesSection";
import LatestJobs from "./LatestJobs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHighlights } from "@/redux/slices/job.slice";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const dispatch = useDispatch();
  const { highlights } = useSelector((state) => state.job);

  useEffect(() => {
    dispatch(getHighlights());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        {highlights && highlights.length > 0 && <HighlightsSection highlights={highlights} />}
        <CategoryCarousel />
        <FeaturesSection />
        <LatestJobs />
      </main>
      <Footer />
    </div>
  );
};

const HighlightsSection = ({ highlights }) => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50/60 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Featured on NextHire
            </h2>
            <p className="text-gray-600 mt-2">
              Discover top employers and success stories curated by our team.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item) => (
            <article
              key={item._id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/70 shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge variant="outline" className="text-xs font-semibold">
                  {item.type === "company" ? "Featured Employer" : "Success Story"}
                </Badge>
                {item.company?.badges && item.company.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.company.badges.slice(0, 2).map((badge) => (
                      <Badge
                        key={badge}
                        className="bg-purple-50 text-purple-700 border-purple-200 text-[11px] font-semibold"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
              {item.subtitle && (
                <p className="text-sm font-semibold text-gray-600">{item.subtitle}</p>
              )}
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
              )}
              {item.company && (
                <div className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold">{item.company.companyName}</span>
                  {item.company.location && ` • ${item.company.location}`}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
