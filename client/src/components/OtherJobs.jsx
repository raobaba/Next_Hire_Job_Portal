import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./shared/Loader";
import Navbar from "./shared/Navbar";

const OtherJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Pagination state

  useEffect(() => {
    const fetchJobData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://api.adzuna.com/v1/api/jobs/in/search/${page}?app_id=${
            import.meta.env.VITE_APPLICATION_ID
          }&app_key=${import.meta.env.VITE_APPLICATION_KEY}`
        );
        setJobs(response.data.results);
      } catch (error) {
        setError("Failed to load jobs");
        console.error("Error fetching job data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [page]);

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <>
      <Navbar />
      <div className='p-6'>
        <h2 className='text-3xl font-bold mb-6'>Job Listings</h2>
        {loading && <Loader />}
        {error && <p className='text-red-500'>{error}</p>}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {jobs?.map((job, index) => (
            <div
              key={index}
              className='bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300'
            >
              <h3 className='text-xl font-semibold text-blue-600'>
                {job.title}
              </h3>
              <p className='text-gray-700 mt-1'>
                <span className='font-medium'>Company:</span>{" "}
                {job.company?.display_name}
              </p>
              <p className='text-gray-700'>
                <span className='font-medium'>Contract:</span>{" "}
                {job.contract_type || "N/A"} / {job.contract_time || "N/A"}
              </p>
              <p className='text-gray-600 mt-2 line-clamp-3'>
                {job.description}
              </p>
              <p className='text-gray-700 mt-2'>
                <span className='font-medium'>Salary:</span>{" "}
                {job.salary_min
                  ? `₹${Math.round(job.salary_min)} - ₹${Math.round(
                      job.salary_max
                    )}`
                  : "Not specified"}
              </p>
              <a
                href={job.redirect_url}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-block mt-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-200'
              >
                View Job
              </a>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className='flex justify-center items-center gap-4 mt-10'>
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Previous
          </button>
          <span className='font-semibold text-lg'>Page {page}</span>
          <button
            onClick={handleNext}
            className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white'
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default OtherJobs;
