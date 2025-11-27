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

  console.log("company",company)

  return (
    <div className='min-h-screen mt-7 bg-gray-50'>
      <Navbar />
      <div className='max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8'>
        {/* Go Back and Company Details Layout */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
          {/* Go Back Button on the left */}
          <Button
            onClick={() => navigate(-1)}
            variant='outline'
            className='md:mr-8 mb-4 md:mb-0'
          >
            Go Back
          </Button>

          {/* Company Details on the right */}
          {company ? (
            <div className='bg-white p-6 rounded-lg shadow-md w-full md:w-auto'>
              <div className='md:flex md:justify-between md:items-center'>
                <div className='flex items-center mb-4 md:mb-0'>
                  {/* Company Logo */}
                  {company.logo?.url && (
                    <img
                      src={company.logo.url}
                      alt={`${company.companyName} logo`}
                      className='h-16 w-16 object-cover rounded-full mr-4'
                    />
                  )}

                  {/* Company Info: Name, Location, Website */}
                  <div>
                    <h1 className='text-2xl md:text-4xl font-bold'>
                      {company.companyName || "Company Name not available"}
                    </h1>
                    <p className='text-sm md:text-base text-gray-600'>
                      Location: {company.location || "Not available"}
                    </p>
                    <p className='text-sm md:text-base text-gray-600'>
                      Website:{" "}
                      <a
                        href={company.website || "#"}
                        className='text-blue-500'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {company.website || "No website available"}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <p className='mt-4 text-gray-700'>
                {company.description || "Description not available."}
              </p>
            </div>
          ) : (
            <p className='text-gray-500'>Company details not found.</p>
          )}
        </div>

        <div className='mt-10'>
          <h2 className='text-xl md:text-3xl font-bold'>
            Jobs Posted by {company?.companyName || "This Company"}
          </h2>
          {jobs.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6'>
              {jobs?.map((job) => (
                <div
                  key={job._id}
                  className='flex flex-col border border-gray-300 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow'
                >
                  <h3 className='text-lg md:text-xl font-semibold mb-2'>
                    {job.title}
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    {truncateDescription(job.description)}
                  </p>
                  <p className='text-gray-700'>Location: {job.location}</p>
                  <p className='text-gray-700'>
                    Salary: ₹{job.salary.toLocaleString()}
                  </p>
                  <p className='text-gray-700'>
                    Experience: {job.experienceLevel} years
                  </p>

                  <div className='mt-auto pt-4'>
                    <Button
                      variant='outline'
                      className='w-full'
                      onClick={() => navigate(`/description/${job._id}`)}
                    >
                      View Job
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 mt-4'>
              No jobs available at this time.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
