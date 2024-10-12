import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { motion } from "framer-motion";
import ReactHelmet from "./shared/ReactHelmet";
import { getAllJobs } from "@/redux/slices/job.slice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./shared/Loader";

const Jobs = () => {
  const dispatch = useDispatch();
  const [allJobs, setAllJobs] = useState([]);
  const [filterJobs, setFilterJobs] = useState([]);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const res = await dispatch(getAllJobs());
        if (res?.payload?.status === 200) {
          console.log("jobsData", res?.payload);
          setAllJobs(res?.payload?.jobs);
          setFilterJobs(res?.payload?.jobs); // Initialize filtered jobs as well
        } else {
          setError("Failed to load jobs."); // Handle unexpected response status
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("An error occurred while fetching jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [dispatch]);

  const recommendedJobs = allJobs.filter((job) => job.position === 1);
  const searchHistory = allJobs.filter((job) => job.salary > 15);

  useEffect(() => {
    let filteredJobs = allJobs;

    if (searchedQuery) {
      filteredJobs = allJobs.filter((job) => {
        return (
          job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchedQuery.toLowerCase())
        );
      });
      setCurrentCategory("search");
    } else {
      if (currentCategory === "recommended") {
        filteredJobs = recommendedJobs;
      } else if (currentCategory === "trending") {
        filteredJobs = searchHistory;
      } else {
        filteredJobs = allJobs; // Reset to all jobs when "all" is selected
      }
    }

    setFilterJobs(filteredJobs);
  }, [searchedQuery, currentCategory, allJobs, recommendedJobs, searchHistory]);

  return (
    <div>
      <Navbar />
      {loading && <Loader />}
      {error && (
        <div className="text-red-500 text-center my-4">{error}</div> // Display error message
      )}
      <ReactHelmet
        title="Job Openings - Next_Hire"
        description="Explore the latest job opportunities tailored to your skills and experience. Find your perfect role and apply today with Next_Hire."
        canonicalUrl="http://mysite.com/job"
      />

      <div className="max-w-7xl mx-auto mt-20 px-4">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-1/4 lg:w-1/5">
            <FilterCard setSearchedQuery={setSearchedQuery} />
          </div>
          <div className="flex-1 h-[80vh] overflow-y-auto pb-5">
            {/* Search Field Above Headings */}
            <div className="my-5">
              <input
                type="text"
                value={searchedQuery}
                onChange={(e) => setSearchedQuery(e.target.value)}
                placeholder="Search for jobs..."
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Stylish and Responsive Headings */}
            <div className="flex flex-col sm:flex-row items-center justify-between my-5 sm:space-x-4 space-y-3 sm:space-y-0">
              <h2
                onClick={() => {
                  setCurrentCategory("all");
                  setSearchedQuery(""); // Clear search when going back to all
                }}
                className={`cursor-pointer text-sm md:text-lg lg:text-xl font-bold transition duration-300 hover:text-blue-500 ${
                  currentCategory === "all" ? "text-blue-600" : "text-gray-800"
                }`}
              >
                All Jobs ({allJobs.length})
              </h2>
              <h2
                onClick={() => setCurrentCategory("recommended")}
                className={`cursor-pointer text-sm md:text-lg lg:text-xl font-bold transition duration-300 hover:text-blue-500 ${
                  currentCategory === "recommended"
                    ? "text-blue-600"
                    : "text-gray-800"
                }`}
              >
                Recommended ({recommendedJobs.length})
              </h2>
              <h2
                onClick={() => setCurrentCategory("trending")}
                className={`cursor-pointer text-sm md:text-lg lg:text-xl font-bold transition duration-300 hover:text-blue-500 ${
                  currentCategory === "trending"
                    ? "text-blue-600"
                    : "text-gray-800"
                }`}
              >
                Based On Search ({searchHistory.length})
              </h2>
              {searchedQuery && (
                <h2 className="text-sm md:text-lg lg:text-xl font-bold text-red-500">
                  Based on Search Results ({filterJobs.length})
                </h2>
              )}
            </div>

            {filterJobs.length <= 0 ? (
              <span>Job not found</span>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filterJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    key={job._id}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
