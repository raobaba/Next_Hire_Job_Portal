import React, { useEffect, useState, useRef } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { motion } from "framer-motion";
import ReactHelmet from "./shared/ReactHelmet";
import { getAllJobs } from "@/redux/slices/job.slice";
import {
  getRecommendedJobs,
  getSearchResult,
  clearSearchHistory,
} from "@/redux/slices/user.slice";
import { useDispatch } from "react-redux";
import Loader from "./shared/Loader";
import { toast } from "react-toastify";

const Jobs = () => {
  const dispatch = useDispatch();
  const [allJobs, setAllJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [filterJobs, setFilterJobs] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams, setSearchParams] = useState({
    title: "",
    salaryMin: "",
    salaryMax: "",
    experienceLevel: "",
    location: "",
    jobType: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  const observerRef = useRef(null);
  const currentPageRef = useRef(1);
  const totalPagesRef = useRef(null);
  const lastScrollTopRef = useRef(0);

  const fetchJobs = () => {
    if (!hasMore || loading) return;
    setLoading(true);
    setError(null);
    const sanitizedParams = {
      ...searchParams,
      page: currentPageRef.current,
      limit: searchParams.limit || 10,
    };
    dispatch(getAllJobs(sanitizedParams))
      .then((res) => {
        if (res?.payload?.status === 200) {
          const newJobs = res?.payload?.jobs;
          if (currentPageRef.current === 1) {
            setAllJobs(newJobs);
            setFilterJobs(newJobs);
          } else {
            const uniqueJobs = [
              ...new Set([...allJobs, ...newJobs].map((job) => job._id)),
            ].map((id) =>
              [...allJobs, ...newJobs].find((job) => job._id === id)
            );

            setAllJobs(uniqueJobs);
            setFilterJobs(uniqueJobs);
          }

          const { currentPage, totalPages } = res.payload;
          totalPagesRef.current = totalPages;
          setHasMore(currentPage < totalPages);
          if (sanitizedParams.page === currentPageRef.current) {
            currentPageRef.current += 1;
          }
        } else {
          setError("Failed to load jobs.");
        }
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setError("An error occurred while fetching jobs.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchRecommendedJobs = () => {
    if (!hasMore || loading) return;
    setLoading(true);
    setError(null);
    const sanitizedParams = {
      ...searchParams,
      page: currentPageRef.current,
      limit: searchParams.limit || 10,
    };
    dispatch(getRecommendedJobs(sanitizedParams))
      .then((res) => {
        if (res?.payload?.status === 200) {
          const newJobs = res?.payload?.jobs;

          if (currentPageRef.current === 1) {
            setRecommendedJobs(newJobs);
            setFilterJobs(newJobs);
          } else {
            const uniqueJobs = [
              ...new Set(
                [...recommendedJobs, ...newJobs].map((job) => job._id)
              ),
            ].map((id) =>
              [...recommendedJobs, ...newJobs].find((job) => job._id === id)
            );

            setRecommendedJobs(uniqueJobs);
            setFilterJobs(uniqueJobs);
          }

          const { currentPage, totalPages } = res.payload;
          totalPagesRef.current = totalPages;
          setHasMore(currentPage < totalPages);
          if (sanitizedParams.page === currentPageRef.current) {
            currentPageRef.current += 1;
          }
        } else {
          setError("Failed to load recommended jobs.");
        }
      })
      .catch((error) => {
        console.error("Error fetching recommended jobs:", error);
        setError("An error occurred while fetching recommended jobs.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchSearchResult = () => {
    if (!hasMore || loading) return;
    setLoading(true);
    setError(null);
    const sanitizedParams = {
      ...searchParams,
      page: currentPageRef.current,
      limit: searchParams.limit || 10,
    };
    dispatch(getSearchResult(sanitizedParams))
      .then((res) => {
        if (res?.payload?.status === 200) {
          const newJobs = res?.payload?.jobs;

          if (currentPageRef.current === 1) {
            setSearchResult(newJobs);
            setFilterJobs(newJobs);
          } else {
            const uniqueJobs = [
              ...new Set([...searchResult, ...newJobs].map((job) => job._id)),
            ].map((id) =>
              [...searchResult, ...newJobs].find((job) => job._id === id)
            );

            setSearchResult(uniqueJobs);
            setFilterJobs(uniqueJobs);
          }

          const { currentPage, totalPages } = res.payload;
          totalPagesRef.current = totalPages;
          setHasMore(currentPage < totalPages);
          if (sanitizedParams.page === currentPageRef.current) {
            currentPageRef.current += 1;
          }
        } else {
          setError("Failed to load recommended jobs.");
        }
      })
      .catch((error) => {
        console.error("Error fetching recommended jobs:", error);
        setError("An error occurred while fetching recommended jobs.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleScroll = () => {
    if (observerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = observerRef.current;
      const lastScrollTop = lastScrollTopRef.current;
      if (scrollTop > lastScrollTop) {
        if (
          scrollTop + clientHeight >= scrollHeight - 50 &&
          hasMore &&
          !loading &&
          currentPageRef.current <= totalPagesRef.current
        ) {
          if (currentCategory === "recommended") {
            fetchRecommendedJobs();
          } else if (currentCategory === "trending") {
          } else {
            fetchJobs();
          }
        }
      }
      lastScrollTopRef.current = scrollTop;
    }
  };

  useEffect(() => {
    currentPageRef.current = 1;
    setHasMore(true);
    if (currentCategory === "recommended") {
      fetchRecommendedJobs();
    } else if (currentCategory === "searchedBased") {
      fetchSearchResult();
    } else {
      fetchJobs();
    }
  }, [searchParams]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore, loading]);

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    currentPageRef.current = 1;
    setHasMore(true);

    if (category === "recommended") {
      fetchRecommendedJobs();
    } else if (category === "searchedBased") {
      fetchSearchResult();
    } else {
      fetchJobs();
    }
  };

  const handleClearSearchHistory = () => {
    dispatch(clearSearchHistory())
      .then((res) => {
        setLoading(true);
        if (res?.payload?.status === 200) {
          setLoading(false);
          console.log("clearSearchHistory", res?.payload);
          toast.success(res?.payload?.message);
        } else {
          toast.error("falied while deleting search history");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("falied while deleting search history");
        setLoading(false);
      });
  };
  return (
    <div>
      <Navbar />
      {loading && <Loader />}
      <ReactHelmet
        title="Job Openings - Next_Hire"
        description="Explore the latest job opportunities tailored to your skills and experience. Find your perfect role and apply today with Next_Hire."
        canonicalUrl="http://mysite.com/job"
      />
      <div className="max-w-7xl mt-20 mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-5">
          {currentCategory !== "searchedBased" ? (
            <div className="w-full md:w-1/4 lg:w-1/5">
              <FilterCard
                setFilterJobs={setFilterJobs}
                setSearchParams={setSearchParams}
              />
            </div>
          ) : null}

          <div
            className="flex-1 h-[85vh] overflow-y-auto pb-5"
            ref={observerRef}
          >
            {currentCategory !== "searchedBased" ? (
              <div className="flex flex-col sm:flex-row items-center justify-between my-1 sm:space-x-4 space-y-3 sm:space-y-0">
                <h2
                  onClick={() => handleCategoryChange("all")}
                  className={`cursor-pointer text-sm md:text-lg lg:text-xl font-bold transition duration-300 hover:text-blue-500 ${
                    currentCategory === "all"
                      ? "text-blue-600"
                      : "text-gray-800"
                  }`}
                >
                  All Jobs ({allJobs.length})
                </h2>
                <h2
                  onClick={() => handleCategoryChange("recommended")}
                  className={`cursor-pointer text-sm md:text-lg lg:text-xl font-bold transition duration-300 hover:text-blue-500 ${
                    currentCategory === "recommended"
                      ? "text-blue-600"
                      : "text-gray-800"
                  }`}
                >
                  Recommended ({recommendedJobs.length})
                </h2>
                <h2
                  onClick={() => handleCategoryChange("searchedBased")}
                  className={`cursor-pointer text-sm md:text-lg lg:text-xl font-bold transition duration-300 hover:text-blue-500 ${
                    currentCategory === "searchedBased"
                      ? "text-blue-600"
                      : "text-gray-800"
                  }`}
                >
                  Based On Search ({searchResult.length})
                </h2>
              </div>
            ) : (
              <div className="flex justify-between items-center my-4 sm:space-x-4 space-y-3 sm:space-y-0">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className="px-4 py-2 text-sm md:text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  &larr; Back
                </button>
                <button
                  onClick={() => handleClearSearchHistory()}
                  className="px-4 py-2 text-sm md:text-lg font-semibold text-white bg-red-500 rounded-lg shadow-md transition duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                >
                  Clear Search
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filterJobs.length > 0 ? (
                filterJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Job job={job} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-5">
                  <span>No jobs found matching the criteria.</span>
                </div>
              )}
            </div>
            {loading && <Loader />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
