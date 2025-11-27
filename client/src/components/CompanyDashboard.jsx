import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { useDispatch } from "react-redux";
import { getCompanyById, getJobsByCompany } from "@/redux/slices/company.slice";
import Navbar from "./shared/Navbar";
import Loader from "./shared/Loader";
import { Button } from "./ui/button";
import { toast } from "react-toastify";

const CompanyDashboard = () => {
  const { id } = useParams(); // Get company ID from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate for back button

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function for truncating long descriptions
  const truncateDescription = (description) => {
    return description.length > 100
      ? description.substring(0, 100) + "..."
      : description;
  };

  // Fetch company and jobs by companyId
  const fetchCompanyAndJobs = useCallback(() => {
    setLoading(true);

    // Fetch company details
    dispatch(getCompanyById(id))
      .then((res) => {
        if (res?.payload?.company) {
          setCompany(res.payload.company);
        } else {
          toast.error("Failed to fetch company details.");
        }
      })
      .catch(() => toast.error("Error fetching company details."));

    // Fetch jobs by company
    dispatch(getJobsByCompany(id))
      .then((res) => {
        if (res?.payload?.status === 200) {
          setJobs(res.payload.jobs || []);
        } else {
          toast.error("Failed to fetch jobs.");
        }
      })
      .catch(() => toast.error("Error fetching jobs."))
      .finally(() => setLoading(false));
  }, [id, dispatch]);

  useEffect(() => {
    fetchCompanyAndJobs();
  }, [fetchCompanyAndJobs]);

  if (loading) {
    return <Loader />;
  }


  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-[#6A38C2]/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-[#F83002]/5 rounded-full blur-3xl'></div>
      </div>

      <Navbar />
      <div className='max-w-7xl mx-auto mt-24 px-4 sm:px-6 lg:px-8 py-8 relative z-10'>
        {/* Go Back and Company Details Layout */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
          {/* Go Back Button */}
          <Button
            onClick={() => navigate(-1)}
            variant='outline'
            className='rounded-xl bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 hover:border-[#6A38C2] text-gray-700 hover:text-[#6A38C2] shadow-md hover:shadow-lg transition-all duration-300'
          >
            ← Go Back
          </Button>

          {/* Company Details */}
          {company ? (
            <div className='bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-2 border-gray-200/60 w-full md:w-auto'>
              <div className='md:flex md:justify-between md:items-center'>
                <div className='flex items-center mb-4 md:mb-0'>
                  {/* Company Logo */}
                  {company.logo?.url && (
                    <div className='relative mr-4'>
                      <img
                        src={company.logo.url}
                        alt={`${company.companyName} logo`}
                        className='h-20 w-20 object-cover rounded-2xl border-2 border-gray-200 ring-4 ring-[#6A38C2]/10'
                      />
                    </div>
                  )}

                  {/* Company Info */}
                  <div>
                    <h1 className='text-2xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                      {company.companyName || "Company Name not available"}
                    </h1>
                    <div className='space-y-1'>
                      <p className='text-sm md:text-base text-gray-600 flex items-center gap-2'>
                        <svg className='w-4 h-4 text-[#6A38C2]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                        </svg>
                        {company.location || "Not available"}
                      </p>
                      <p className='text-sm md:text-base text-gray-600 flex items-center gap-2'>
                        <svg className='w-4 h-4 text-[#6A38C2]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' />
                        </svg>
                        <a
                          href={company.website || "#"}
                          className='text-[#6A38C2] hover:text-[#F83002] font-semibold transition-colors duration-200'
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {company.website || "No website available"}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className='mt-4 text-gray-700 leading-relaxed bg-gray-50/80 rounded-xl p-4 border border-gray-200/60'>
                {company.description || "Description not available."}
              </p>
            </div>
          ) : (
            <div className='bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200/60 shadow-lg'>
              <p className='text-gray-500'>Company details not found.</p>
            </div>
          )}
        </div>

        <div className='mt-10'>
          <h2 className='text-3xl md:text-4xl font-extrabold mb-6'>
            <span className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
              Jobs Posted by{" "}
            </span>
            <span className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent'>
              {company?.companyName || "This Company"}
            </span>
          </h2>
          {jobs.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {jobs?.map((job) => (
                <div
                  key={job._id}
                  className='group relative bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-[#6A38C2]/30 overflow-hidden flex flex-col'
                >
                  {/* Gradient overlay */}
                  <div className='absolute inset-0 bg-gradient-to-br from-[#6A38C2]/5 to-[#F83002]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  
                  <div className='relative z-10 flex flex-col h-full'>
                    <h3 className='text-lg md:text-xl font-extrabold mb-3 text-gray-900 group-hover:text-[#6A38C2] transition-colors duration-300'>
                      {job.title}
                    </h3>
                    <p className='text-gray-600 mb-4 line-clamp-3 flex-grow'>
                      {truncateDescription(job.description)}
                    </p>
                    
                    <div className='space-y-2 mb-4 bg-gray-50/80 rounded-xl p-3 border border-gray-200/60'>
                      <p className='text-sm text-gray-700'>
                        <span className='font-semibold text-gray-900'>Location:</span> {job.location}
                      </p>
                      <p className='text-sm text-gray-700'>
                        <span className='font-semibold text-gray-900'>Salary:</span> <span className='text-[#6A38C2] font-bold'>₹{job.salary.toLocaleString()} LPA</span>
                      </p>
                      <p className='text-sm text-gray-700'>
                        <span className='font-semibold text-gray-900'>Experience:</span> {job.experienceLevel} years
                      </p>
                    </div>

                    <div className='mt-auto pt-4'>
                      <Button
                        className='w-full rounded-xl bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300'
                        onClick={() => navigate(`/description/${job._id}`)}
                      >
                        View Job Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200/60 shadow-lg text-center'>
              <p className='text-gray-600 text-lg'>
                No jobs available at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
