import React, { useEffect, useState, useRef } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { motion } from "framer-motion";
import ReactHelmet from "./shared/ReactHelmet";
import { getAllJobs } from "@/redux/slices/job.slice";
import { useDispatch } from "react-redux";
import Loader from "./shared/Loader";

const Jobs = () => {
  const dispatch = useDispatch();
  const [allJobs, setAllJobs] = useState([]);
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
  const lastScrollTopRef = useRef(0); // To track the last scroll position

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

          // Update allJobs and filterJobs
          if (currentPageRef.current === 1) {
            setAllJobs(newJobs); // Clear previous jobs on new search
            setFilterJobs(newJobs); // Set filterJobs initially
          } else {
            const uniqueJobs = [
              ...new Set([...allJobs, ...newJobs].map((job) => job._id)),
            ].map((id) =>
              [...allJobs, ...newJobs].find((job) => job._id === id)
            );

            setAllJobs(uniqueJobs);
            setFilterJobs(uniqueJobs); // Update filterJobs as well
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

  const handleScroll = () => {
    if (observerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = observerRef.current;
      const lastScrollTop = lastScrollTopRef.current;

      // Only trigger if scrolling down
      if (scrollTop > lastScrollTop) {
        if (
          scrollTop + clientHeight >= scrollHeight - 50 &&
          hasMore &&
          !loading &&
          currentPageRef.current <= totalPagesRef.current
        ) {
          fetchJobs();
        }
      }

      // Update the last scroll position
      lastScrollTopRef.current = scrollTop;
    }
  };

  useEffect(() => {
    currentPageRef.current = 1;
    setHasMore(true);
    fetchJobs();
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
          <div className="w-full md:w-1/4 lg:w-1/5">
            <FilterCard
              setFilterJobs={setFilterJobs}
              setSearchParams={setSearchParams}
            />
          </div>
          <div
            className="flex-1 h-[85vh] overflow-y-auto pb-5"
            ref={observerRef}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between my-1 sm:space-x-4 space-y-3 sm:space-y-0">
              <h2
                onClick={() => setCurrentCategory("all")}
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
                Recommended (0)
              </h2>
              <h2
                onClick={() => setCurrentCategory("trending")}
                className={`cursor-pointer text-sm md:text-lg lg:text-xl font-bold transition duration-300 hover:text-blue-500 ${
                  currentCategory === "trending"
                    ? "text-blue-600"
                    : "text-gray-800"
                }`}
              >
                Based On Search (0)
              </h2>
            </div>
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
