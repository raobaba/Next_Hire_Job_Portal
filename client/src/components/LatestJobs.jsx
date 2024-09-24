import React from "react";
import LatestJobCards from "./LatestJobCards";

// Static job data
const staticJobs = [
  {
    _id: "1",
    company: { name: "Tech Solutions" },
    title: "Frontend Developer",
    description:
      "Looking for a skilled Frontend Developer with experience in React.js.",
    position: "2",
    jobType: "Full-time",
    salary: "10",
  },
  {
    _id: "2",
    company: { name: "Innovate Corp" },
    title: "Backend Developer",
    description:
      "Seeking a Backend Developer familiar with Node.js and Express.",
    position: "3",
    jobType: "Part-time",
    salary: "8",
  },
  {
    _id: "3",
    company: { name: "Design Studio" },
    title: "UI/UX Designer",
    description:
      "Looking for a creative UI/UX Designer to enhance user experience.",
    position: "1",
    jobType: "Contract",
    salary: "7",
  },
  {
    _id: "4",
    company: { name: "Startup Hub" },
    title: "Data Scientist",
    description:
      "Seeking a Data Scientist to analyze and interpret complex data.",
    position: "1",
    jobType: "Full-time",
    salary: "12",
  },
  {
    _id: "5",
    company: { name: "Finance Co." },
    title: "Financial Analyst",
    description:
      "Looking for a Financial Analyst with strong analytical skills.",
    position: "2",
    jobType: "Internship",
    salary: "5",
  },
  {
    _id: "6",
    company: { name: "Marketing Agency" },
    title: "Digital Marketing Specialist",
    description:
      "Seeking a Digital Marketing Specialist to manage online campaigns.",
    position: "2",
    jobType: "Full-time",
    salary: "9",
  },
];

const LatestJobs = () => {
  return (
    <div className="max-w-7xl mx-auto my-20">
      <h1 className="text-4xl font-bold">
        <span className="text-[#6A38C2]">Latest & Top </span> Job Openings
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
        {staticJobs.length <= 0 ? (
          <span>No Job Available</span>
        ) : (
          staticJobs
            .slice(0, 6)
            .map((job) => <LatestJobCards key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
