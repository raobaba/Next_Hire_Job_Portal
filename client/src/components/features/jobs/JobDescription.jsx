import React, { useEffect, useState } from "react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactHelmet from "../../common/ReactHelmet";
import { useNavigate } from "react-router-dom";
import { getJobById, getSimilarJobs } from "@/redux/slices/job.slice";
import { applyJob } from "@/redux/slices/application.slice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../common/Loader";
import { getToken } from "@/utils/constant";
import Navbar from "../../layout/Navbar";

const JobDescription = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const jobId = params.id;
  const [singleJob, setSingleJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isApplied, setIsApplied] = useState(false);
  const user = useSelector((state) => state.user.user);

  // Fetch job details
  useEffect(() => {
    dispatch(getJobById(jobId)).then((res) => {
      if (res?.payload?.status === 200) {
        const response = res?.payload?.job;
        if (response) {
          setSingleJob(response);
          const findApplications = res?.payload?.job?.applications;
          const alreadyApplied = findApplications?.some(
            (application) => application?.applicant === user?._id
          );
          setIsApplied(alreadyApplied);

          // Fetch similar jobs based on the job type
          dispatch(getSimilarJobs(jobId)).then((res) => {
            if (res?.payload?.status === 200) {
              setSimilarJobs(res?.payload?.jobs || []);
            }
          });
        }
      }
    });
  }, [dispatch, jobId, user]);

  const applyJobHandler = () => {
    const token = getToken();
    if (!token) return navigate("/login");
    dispatch(applyJob(jobId))
      .then((res) => {
        if (res?.payload?.status === 200) {
          toast.success(res?.payload?.message);
          setIsApplied(true);
        } else {
          toast.info(res?.payload?.message);
        }
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.message || "Failed to apply for job."
        );
      });
  };


  const viewCompanyDetails = () => {
    navigate(`/company-dashboard/${singleJob?.company}`); 
  };

  if (!singleJob) return <Loader />;

  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-[#6A38C2]/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-[#F83002]/5 rounded-full blur-3xl'></div>
      </div>

      <Navbar />
      <div className='max-w-7xl mx-auto mt-24 px-4 py-8 relative z-10'>
        <ReactHelmet
          title='Job Details - Next_Hire'
          description='Discover detailed information about the job role, responsibilities, qualifications, and how to apply. Learn more to see if this is the right opportunity for you.'
          canonicalUrl='/job-details'
        />

        <Button
          onClick={() => navigate(-1)}
          className='mb-6 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 hover:border-[#6A38C2] text-gray-700 hover:text-[#6A38C2] shadow-md hover:shadow-lg transition-all duration-300'
        >
          ← Go Back
        </Button>

        <div className='flex flex-col md:flex-row gap-6'>
          <div className='flex-1 bg-white/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200/60 shadow-lg'>
            <div className='flex flex-col mb-6'>
              <h1 className='font-extrabold text-3xl md:text-4xl mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                {singleJob.title}
              </h1>
              <div className='flex items-center gap-3 flex-wrap'>
                <Badge className='text-blue-700 font-semibold bg-blue-100 border border-blue-200 px-4 py-1.5' variant='ghost'>
                  {singleJob.position} Position{singleJob.position > 1 ? 's' : ''}
                </Badge>
                <Badge className='text-[#F83002] font-semibold bg-red-100 border border-red-200 px-4 py-1.5' variant='ghost'>
                  {singleJob.jobType}
                </Badge>
                <Badge className='text-[#6A38C2] font-semibold bg-purple-100 border border-purple-200 px-4 py-1.5' variant='ghost'>
                  ₹{singleJob.salary} LPA
                </Badge>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 mb-8'>
              <Button
                onClick={isApplied ? null : applyJobHandler}
                disabled={isApplied}
                className={`flex-1 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                  isApplied
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white"
                }`}
              >
                {isApplied ? "✓ Applied" : "Apply Now"}
              </Button>

              <Button
                onClick={viewCompanyDetails}
                className='flex-1 rounded-xl bg-white border-2 border-[#6A38C2] text-[#6A38C2] hover:bg-[#6A38C2] hover:text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300'
              >
                View Company Details
              </Button>
            </div>

            <h2 className='border-b-2 border-gray-200 font-bold text-xl py-4 mb-6 text-gray-900'>
              Job Description
            </h2>
            <div className='my-4 space-y-4'>
              <JobDetail label='Role' value={singleJob.title} />
              <JobDetail label='Location' value={singleJob.location} />
              <JobDetail label='Description' value={singleJob.description} />
              <JobDetail
                label='Experience'
                value={`${singleJob.experienceLevel} yrs`}
              />
              <JobDetail label='Salary' value={`₹${singleJob.salary} LPA`} />
              <JobDetail
                label='Total Applicants'
                value={singleJob.applications.length}
              />
              <JobDetail
                label='Posted Date'
                value={singleJob.createdAt.split("T")[0]}
              />
            </div>
          </div>

          {/* Similar Jobs Section */}
          <div className='w-full md:w-1/3 bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-2xl shadow-lg p-6 sticky top-24 max-h-[85vh] overflow-hidden flex flex-col'>
            <h2 className='border-b-2 border-gray-200 font-bold text-xl py-3 mb-4 text-gray-900'>
              Similar Jobs
            </h2>
            <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#6A38C2] scrollbar-track-gray-100'>
              {similarJobs.length > 0 ? (
                <div className='space-y-4'>
                  {similarJobs?.map((job) => (
                    <div
                      key={job._id}
                      className='p-4 border-2 border-gray-200/60 rounded-xl hover:border-[#6A38C2]/30 hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm'
                    >
                      <h3 className='font-bold text-lg mb-2 text-gray-900'>{job.title}</h3>
                      <p className='text-gray-600 text-sm mb-2'>{job.location}</p>
                      <p className='text-[#6A38C2] font-semibold mb-2'>₹{job.salary} LPA</p>
                      <p className='text-gray-500 text-sm mb-3'>{job.jobType}</p>
                      <Button
                        onClick={() => navigate(`/description/${job._id}`)}
                        className='w-full rounded-xl bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300'
                      >
                        View Job
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <p className='text-gray-500'>No similar jobs found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobDetail = ({ label, value }) => (
  <div className='bg-gray-50/80 rounded-xl p-4 border border-gray-200/60'>
    <h3 className='font-bold text-gray-900 mb-1'>{label}</h3>
    <p className='text-gray-700 leading-relaxed'>{value}</p>
  </div>
);

export default JobDescription;
