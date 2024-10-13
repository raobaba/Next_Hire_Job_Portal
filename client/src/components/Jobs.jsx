import React, { useEffect, useState, useRef } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { motion } from "framer-motion";
import ReactHelmet from "./shared/ReactHelmet";
import { getAllJobs } from "@/redux/slices/job.slice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./shared/Loader";

// Pagination constants
const PAGE_SIZE = 10; // Number of jobs per page

const Jobs = () => {
  const dispatch = useDispatch();
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state
  const [currentPage, setCurrentPage] = useState(1); // Pagination page state
  const [sortOption, setSortOption] = useState(""); // Sorting state
  const observer = useRef(null); // Reference for intersection observer

  const [appliedFilters, setAppliedFilters] = useState({
    location: "",
    industry: "",
    salary: "",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const res = await dispatch(getAllJobs());
        if (res?.payload?.status === 200) {
          setAllJobs(res?.payload?.jobs);
          setFilteredJobs(res?.payload?.jobs.slice(0, PAGE_SIZE)); // Initial page
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

  const loadMoreJobs = () => {
    const nextPage = currentPage + 1;
    const newJobs = allJobs.slice(0, nextPage * PAGE_SIZE);
    setFilteredJobs(newJobs);
    setCurrentPage(nextPage);
  };

  // Intersection Observer to trigger pagination on scroll
  useEffect(() => {
    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        loadMoreJobs();
      }
    };

    const option = { threshold: 0.5 };
    observer.current = new IntersectionObserver(handleObserver, option);
    if (observer.current && observer.current.observe) {
      observer.current.observe(document.querySelector("#paginationObserver"));
    }

    return () => observer.current.disconnect(); // Cleanup observer on component unmount
  }, [filteredJobs, currentPage]);

  // Filter Jobs based on search query, filters, and sort options
  useEffect(() => {
    let filtered = [...allJobs];

    // Apply search query filter
    if (searchedQuery) {
      filtered = filtered.filter((job) =>
        [job.title, job.description, job.location]
          .map((field) => field.toLowerCase())
          .some((field) => field.includes(searchedQuery.toLowerCase()))
      );
    }

    // Apply other filters
    if (appliedFilters.location) {
      filtered = filtered.filter((job) => job.location === appliedFilters.location);
    }
    if (appliedFilters.industry) {
      filtered = filtered.filter((job) => job.industry === appliedFilters.industry);
    }
    if (appliedFilters.salary) {
      filtered = filtered.filter((job) => job.salary === appliedFilters.salary);
    }

    // Apply sorting options
    if (sortOption === "salary") {
      filtered.sort((a, b) => a.salary - b.salary);
    } else if (sortOption === "date") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredJobs(filtered.slice(0, currentPage * PAGE_SIZE));
  }, [searchedQuery, appliedFilters, sortOption, allJobs, currentPage]);

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
          {/* Filter Sidebar */}
          <div className="w-full md:w-1/4 lg:w-1/5">
            <FilterCard setSearchedQuery={setSearchedQuery} setAppliedFilters={setAppliedFilters} />
          </div>

          {/* Job Listings Section */}
          <div className="flex-1 h-[85vh] overflow-y-auto pb-5">
            {/* Search Field */}
            <div className="my-1">
              <input
                type="text"
                value={searchedQuery}
                onChange={(e) => setSearchedQuery(e.target.value)}
                placeholder="Search for jobs..."
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Sorting Options */}
            <div className="flex justify-end my-2">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Sort by</option>
                <option value="salary">Salary</option>
                <option value="date">Date Posted</option>
              </select>
            </div>

            {/* Job List Headings */}
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
                Recommended Jobs
              </h2>
              <h2
                onClick={() => setCurrentCategory("trending")}
                className={`cursor-pointer text-sm md:text-lg lg:text-xl font-bold transition duration-300 hover:text-blue-500 ${
                  currentCategory === "trending"
                    ? "text-blue-600"
                    : "text-gray-800"
                }`}
              >
                Trending Jobs
              </h2>
              {searchedQuery && (
                <h2 className="text-sm md:text-lg lg:text-xl font-bold text-red-500">
                  Search Results ({filteredJobs.length})
                </h2>
              )}
            </div>

            {/* Job Cards */}
            {filteredJobs.length <= 0 ? (
              <span>Job not found</span>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredJobs.map((job) => (
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

      {/* Observer for Infinite Scroll */}
      <div id="paginationObserver"></div>
    </div>
  );
};

export default Jobs;
