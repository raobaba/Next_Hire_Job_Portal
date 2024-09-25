import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ReactHelmet from "./shared/ReactHelmet";

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
    title: "Mobile Developer",
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
    title: "Sales Executive",
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
    title: "Content Writer",
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
  const params = useParams();
  const jobId = params.id;
  const [singleJob, setSingleJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = () => {
      const fetchedUser = { _id: "user-id-123" };
      setUser(fetchedUser);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const job = mockJobData.find((job) => job._id === jobId);
    if (job) {
      setSingleJob(job);
      setIsApplied(
        job.applications.some(
          (application) => application.applicant === user?._id
        )
      );
    }
  }, [jobId, user?._id]);

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

  if (!singleJob) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto my-10 p-4 md:p-8">
      <ReactHelmet
        title="Job Details - Next_Hire"
        description="Discover detailed information about the job role, responsibilities, qualifications, and how to apply. Learn more to see if this is the right opportunity for you."
        canonicalUrl="http://mysite.com/job-details"
      />

      <div className="flex flex-col md:flex-row items-start justify-between">
        <div className="flex-1">
          <h1 className="font-bold text-2xl md:text-3xl">{singleJob.title}</h1>
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
          className={`mt-4 md:mt-0 rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>
      <h1 className="border-b-2 border-b-gray-300 font-medium py-4 mt-6">
        Job Description
      </h1>
      <div className="my-4">
        <h1 className="font-bold my-1">
          Role:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob.title}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob.location}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Description:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob.description}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob.experience} yrs
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob.salary} LPA
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob.applications.length}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Posted Date:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob.createdAt.split("T")[0]}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default JobDescription;
