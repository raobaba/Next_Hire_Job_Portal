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
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
        <div className='container mx-auto px-6 py-8'>
          {/* Header Section */}
          <div className='text-center mb-12'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6A38C2]/10 to-[#F83002]/10 text-[#6A38C2] font-semibold text-sm border border-[#6A38C2]/20 shadow-sm mb-4'>
              <span className='w-2 h-2 bg-[#6A38C2] rounded-full'></span>
              External Job Listings
            </div>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>
              Discover <span className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent'>Amazing Jobs</span>
            </h1>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Explore thousands of job opportunities from top companies worldwide
            </p>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className='flex justify-center items-center py-20'>
              <div className='text-center'>
                <Loader />
                <p className='text-gray-600 mt-4'>Loading amazing job opportunities...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className='text-center py-20'>
              <div className='bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto'>
                <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg className='w-8 h-8 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-red-800 mb-2'>Oops! Something went wrong</h3>
                <p className='text-red-600'>{error}</p>
              </div>
            </div>
          )}

          {/* Job Cards Grid */}
          {!loading && !error && (
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
              {jobs?.map((job, index) => (
                <div
                  key={index}
                  className='group bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:border-[#6A38C2]/30 hover:-translate-y-2'
                >
                  {/* Job Header */}
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1'>
                      <h3 className='text-xl font-bold text-gray-800 group-hover:text-[#6A38C2] transition-colors duration-200 line-clamp-2'>
                        {job.title}
                      </h3>
                      <div className='flex items-center gap-2 mt-2'>
                        <div className='w-2 h-2 bg-[#6A38C2] rounded-full'></div>
                        <p className='text-gray-600 font-medium'>
                          {job.company?.display_name || 'Company Not Specified'}
                        </p>
                      </div>
                    </div>
                    <div className='w-12 h-12 bg-gradient-to-br from-[#6A38C2]/10 to-[#F83002]/10 rounded-xl flex items-center justify-center ml-4'>
                      <svg className='w-6 h-6 text-[#6A38C2]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6' />
                      </svg>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className='space-y-3 mb-6'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center'>
                        <svg className='w-4 h-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                        </svg>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Contract Type</p>
                        <p className='font-medium text-gray-700'>
                          {job.contract_type || "N/A"} / {job.contract_time || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <div className='w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center'>
                        <svg className='w-4 h-4 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
                        </svg>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Salary Range</p>
                        <p className='font-medium text-gray-700'>
                          {job.salary_min
                            ? `₹${Math.round(job.salary_min).toLocaleString()} - ₹${Math.round(job.salary_max).toLocaleString()}`
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className='mb-6'>
                    <p className='text-gray-600 line-clamp-3 leading-relaxed'>
                      {job.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <a
                    href={job.redirect_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group/btn w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
                  >
                    <span>View Job Details</span>
                    <svg className='w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && !error && (
            <div className='flex justify-center items-center gap-6 mt-16'>
              <button
                onClick={handlePrevious}
                disabled={page === 1}
                className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-[#6A38C2] hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-200 hover:border-[#6A38C2]"
                }`}
              >
                <svg className={`w-4 h-4 transition-transform duration-200 ${page !== 1 ? 'group-hover:-translate-x-1' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
                Previous
              </button>
              
              <div className='flex items-center gap-2 bg-white rounded-xl px-6 py-3 shadow-lg border border-gray-200'>
                <div className='w-2 h-2 bg-[#6A38C2] rounded-full'></div>
                <span className='font-bold text-lg text-gray-800'>Page {page}</span>
                <div className='w-2 h-2 bg-[#F83002] rounded-full'></div>
              </div>
              
              <button
                onClick={handleNext}
                className='group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
              >
                Next
                <svg className='w-4 h-4 transition-transform duration-200 group-hover:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OtherJobs;
