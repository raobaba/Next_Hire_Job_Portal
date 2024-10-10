import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ReactHelmet from "./shared/ReactHelmet";
import { useNavigate } from "react-router-dom";
import { getJobById } from "@/redux/slices/job.slice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./shared/Loader";

const mockJobData = [
  {
    _id: "1",
    title: "Software Engineer",
    position: 3,
    jobType: "Full-time",
    salary: 10, // In LPA
    location: "New York",
    description: "Develop and maintain software applications.",
    experience: 2,
    applications: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Product Manager",
    position: 1,
    jobType: "Full-time",
    salary: 15, // In LPA
    location: "San Francisco",
    description: "Lead product development and strategy.",
    experience: 5,
    applications: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "UI/UX Designer",
    position: 2,
    jobType: "Part-time",
    salary: 8, // In LPA
    location: "Los Angeles",
    description: "Design user interfaces and enhance user experience.",
    experience: 3,
    applications: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    title: "Data Scientist",
    position: 4,
    jobType: "Contract",
    salary: 12, // In LPA
    location: "Chicago",
    description: "Analyze data and develop predictive models.",
    experience: 4,
    applications: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "5",
    title: "DevOps Engineer",
    position: 2,
    jobType: "Full-time",
    salary: 14, // In LPA
    location: "Austin",
    description: "Manage infrastructure and deployment pipelines.",
    experience: 3,
    applications: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "6",
    title: "Backend Developer",
    position: 2,
    jobType: "Full-time",
    salary: 11, // In LPA
    location: "Seattle",
    description: "Develop mobile applications for iOS and Android.",
    experience: 2,
    applications: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "7",
    title: "Frontend Developer",
    position: 5,
    jobType: "Full-time",
    salary: 7, // In LPA
    location: "Miami",
    description: "Drive sales and develop customer relationships.",
    experience: 1,
    applications: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "8",
    title: "Full Stack Developer",
    position: 3,
    jobType: "Part-time",
    salary: 5, // In LPA
    location: "Remote",
    description: "Create engaging content for various platforms.",
    experience: 1,
    applications: [],
    createdAt: new Date().toISOString(),
  },
];

const JobDescription = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const jobId = params.id;
  const [singleJob, setSingleJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    dispatch(getJobById(jobId)).then((res) => {
      if (res?.payload?.status === 200) {
        const response = res?.payload?.job;
        if (response) {
          setSingleJob(response);
          setIsApplied(
            response.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      }
    });
  }, [dispatch, jobId, user]);

  useEffect(() => {
    const fetchUserData = () => {
      const fetchedUser = { _id: "user-id-123" }; // Replace with actual user fetching logic
      setUser(fetchedUser);
    };

    fetchUserData();
  }, []);

  const applyJobHandler = () => {
    if (isApplied) return;

    const updatedSingleJob = {
      ...singleJob,
      applications: [...singleJob.applications, { applicant: user?._id }],
    };

    setSingleJob(updatedSingleJob);
    setIsApplied(true);
    toast.success("Application successful!");
  };

  // Similar jobs based on job type
  const similarJobs = mockJobData.filter(
    (job) => job.jobType === singleJob?.jobType && job._id !== singleJob?._id
  );

  if (!singleJob) return <Loader />;

  return (
    <div className="w-11/12 mx-auto md:p-8">
      <ReactHelmet
        title="Job Details - Next_Hire"
        description="Discover detailed information about the job role, responsibilities, qualifications, and how to apply. Learn more to see if this is the right opportunity for you."
        canonicalUrl="http://mysite.com/job-details"
      />

      <Button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="mb-4 rounded-lg bg-gray-400 hover:bg-gray-500"
      >
        Go Back
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Job Description Section */}
        <div className="flex-1">
          <div className="flex flex-col mb-6">
            <h1 className="font-bold text-2xl md:text-3xl">
              {singleJob.title}
            </h1>
            <div className="flex items-center gap-2 mt-4 flex-wrap">
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
            className={`mt-4 rounded-lg ${
              isApplied
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#7209b7] hover:bg-[#5f32ad]"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
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
              value={`${singleJob.experienceLevel} yrs`} // Adjusted to match your data
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
        <div className="w-full md:w-1/3 border rounded-md shadow-md p-4">
          <h1 className="border-b-2 border-b-gray-300 font-medium py-2">
            Similar Jobs
          </h1>
          <div className="max-h-[400px] overflow-y-auto mt-2 scrollbar-hidden">
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
                      onClick={() => navigate(`/job/${job._id}`)}
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
