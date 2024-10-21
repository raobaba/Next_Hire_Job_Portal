import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactHelmet from "./shared/ReactHelmet";
import { useNavigate } from "react-router-dom";
import { getJobById, getSimilarJobs } from "@/redux/slices/job.slice";
import { applyJob } from "@/redux/slices/application.slice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./shared/Loader";

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
            (application) => application.applicant === user._id
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

  if (!singleJob) return <Loader />;

  return (
    <div className="w-11/12 mx-auto md:p-8">
      <ReactHelmet
        title="Job Details - Next_Hire"
        description="Discover detailed information about the job role, responsibilities, qualifications, and how to apply. Learn more to see if this is the right opportunity for you."
        canonicalUrl="http://mysite.com/job-details"
      />

      <Button
        onClick={() => navigate(-1)}
        className="mb-2 rounded-lg bg-gray-400 hover:bg-gray-500"
      >
        Go Back
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Job Description Section */}
        <div className="flex-1">
          <div className="flex flex-col mb-2">
            <h1 className="font-bold text-2xl md:text-3xl">
              {singleJob.title}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge className={"text-blue-700 font-bold"} variant="ghost">
                {singleJob.position} Positions
              </Badge>
              <Badge className={"text-[#F83002] font-bold"} variant="ghost">
                {singleJob.jobType}
              </Badge>
              <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
                {singleJob.salary} LPA
              </Badge>
            </div>
          </div>

          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`rounded-lg ${
              isApplied
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#7209b7] hover:bg-[#5f32ad]"
            }`}
          >
            {isApplied ? "Applied" : "Apply Now"}
          </Button>

          <h1 className="border-b-2 border-b-gray-300 font-medium py-4 mt-6">
            Job Description
          </h1>
          <div className="my-4 space-y-2">
            <JobDetail label="Role" value={singleJob.title} />
            <JobDetail label="Location" value={singleJob.location} />
            <JobDetail label="Description" value={singleJob.description} />
            <JobDetail
              label="Experience"
              value={`${singleJob.experienceLevel} yrs`}
            />
            <JobDetail label="Salary" value={`${singleJob.salary} LPA`} />
            <JobDetail
              label="Total Applicants"
              value={singleJob.applications.length}
            />
            <JobDetail
              label="Posted Date"
              value={singleJob.createdAt.split("T")[0]}
            />
          </div>
        </div>

        {/* Similar Jobs Section */}
        <div className="w-full md:w-1/3 border border-black rounded-md shadow-md p-4">
          <h1 className="border-b-2 border-b-gray-300 font-medium py-2">
            Similar Jobs
          </h1>
          <div className="max-h-[400px] overflow-y-auto mt-1 scrollbar-hidden">
            {similarJobs.length > 0 ? (
              <div className="space-y-4">
                {similarJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-4 border rounded-md flex flex-col"
                  >
                    <h2 className="font-bold text-lg">{job.title}</h2>
                    <p className="text-gray-600">{job.location}</p>
                    <p className="text-gray-800">{job.salary} LPA</p>
                    <p className="text-gray-500">{job.jobType}</p>
                    <Button
                      onClick={() => navigate(`/description/${job._id}`)}
                      className="mt-2 rounded-lg bg-[#7209b7] hover:bg-[#5f32ad]"
                    >
                      View Job
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No similar jobs found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const JobDetail = ({ label, value }) => (
  <h1 className="font-bold my-1">
    {label}: <span className="pl-4 font-normal text-gray-800">{value}</span>
  </h1>
);

export default JobDescription;
