import React, { useEffect, useState, useRef, useCallback } from "react";
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
    description: "",
    companyName: "",
    requirements: "",
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

  const observer = useRef();

  const lastJobRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setSearchParams((prevParams) => ({
            ...prevParams,
            page: prevParams.page ? prevParams.page + 1 : 2,
          }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (!hasMore) return;

    setLoading(true);
    setError(null);

    const sanitizedParams = {
      ...searchParams,
      page: searchParams.page || 1,
      limit: searchParams.limit || 10,
    };

    dispatch(getAllJobs(sanitizedParams))
      .then((res) => {
        if (res?.payload?.status === 200) {
          const newJobs = res?.payload?.jobs;
          setAllJobs((prevJobs) => [...prevJobs, ...newJobs]);
          setFilterJobs((prevJobs) => [...prevJobs, ...newJobs]);

          const { currentPage, totalPages } = res.payload;
          setHasMore(currentPage < totalPages);
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
  }, [dispatch, searchParams, hasMore]);

  const recommendedJobs = allJobs.filter((job) => job.position === 1);
  const searchHistory = allJobs.filter((job) => job.salary > 15);

  useEffect(() => {
    let filteredJobs = allJobs;

    if (currentCategory === "recommended") {
      filteredJobs = recommendedJobs;
    } else if (currentCategory === "trending") {
      filteredJobs = searchHistory;
    } else {
      filteredJobs = allJobs;
    }

    setFilterJobs(filteredJobs);
  }, [currentCategory, allJobs, recommendedJobs, searchHistory]);

  useEffect(() => {
    const filterJobsBasedOnSearch = () => {
      let filteredJobs = allJobs;

      if (searchParams.title) {
        filteredJobs = filteredJobs.filter((job) =>
          job.title.toLowerCase().includes(searchParams.title.toLowerCase())
        );
      }

      if (searchParams.location.length > 0) {
        filteredJobs = filteredJobs.filter((job) =>
          searchParams.location.includes(job.location)
        );
      }

      if (searchParams.jobType.length > 0) {
        filteredJobs = filteredJobs.filter((job) =>
          searchParams.jobType.includes(job.jobType)
        );
      }

      if (searchParams.salary) {
        const [min, max] = searchParams.salary.split("-").map(Number);
        filteredJobs = filteredJobs.filter((job) => {
          const salary = job.salary;
          return (min ? salary >= min : true) && (max ? salary <= max : true);
        });
      }

      setFilterJobs(filteredJobs);
    };

    filterJobsBasedOnSearch();
  }, [searchParams, allJobs]);

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
          <div className="flex-1 h-[85vh] overflow-y-auto pb-5">
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filterJobs.length > 0 ? (
                filterJobs.map((job, index) => (
                  <motion.div
                    ref={lastJobRef}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    key={job._id}
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
