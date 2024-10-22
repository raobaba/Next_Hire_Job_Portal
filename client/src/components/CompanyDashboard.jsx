import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCompanyById, getJobsByCompany } from "@/redux/slices/company.slice";
import Navbar from "./shared/Navbar";
import Loader from "./shared/Loader";
import { Button } from "./ui/button";
import { toast } from "react-toastify";

const CompanyDashboard = () => {
  const { id } = useParams(); // Get company ID from the URL
  const dispatch = useDispatch();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch company and jobs by companyId
  const fetchCompanyAndJobs = () => {
    setLoading(true);
    dispatch(getCompanyById(id))
      .then((res) => {
        if (res?.payload?.company) {
          setCompany(res.payload.company);
        } else {
          toast.error("Failed to fetch company details.");
        }
      })
      .catch(() => toast.error("Error fetching company details."));

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
  };

  useEffect(() => {
    fetchCompanyAndJobs();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen mt-7 bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        {company ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="md:flex md:justify-between md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                {/* Company Logo */}
                {company.logo?.url && (
                  <img
                    src={company.logo.url}
                    alt={`${company.companyName} logo`}
                    className="h-16 w-16 object-cover rounded-full mr-4"
                  />
                )}
                {/* Company Name */}
                <h1 className="text-2xl md:text-4xl font-bold">
                  {company.companyName}
                </h1>
              </div>

              <div className="space-y-1 md:space-y-0 md:flex md:space-x-4">
                <p className="text-sm md:text-base text-gray-600">
                  Location: {company.location}
                </p>
                <p className="text-sm md:text-base text-gray-600">
                  Website:{" "}
                  <a href={company.website} className="text-blue-500">
                    {company.website}
                  </a>
                </p>
              </div>
            </div>
            <p className="mt-4 text-gray-700">{company.description}</p>
          </div>
        ) : (
          <p className="text-gray-500">Company details not found.</p>
        )}

        <div className="mt-10">
          <h2 className="text-xl md:text-3xl font-bold">
            Jobs Posted by {company?.companyName}
          </h2>
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="flex flex-col border border-gray-300 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {job.description.length > 100
                      ? job.description.substring(0, 100) + "..."
                      : job.description}
                  </p>
                  <p className="text-gray-700">Location: {job.location}</p>
                  <p className="text-gray-700">
                    Salary: ${job.salary.toLocaleString()}
                  </p>
                  <p className="text-gray-700">
                    Experience: {job.experienceLevel} years
                  </p>

                  <div className="mt-auto pt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        (window.location.href = `/description/${job._id}`)
                      }
                    >
                      View Job
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No jobs available at this time.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
