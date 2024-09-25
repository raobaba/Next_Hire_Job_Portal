import React from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import ReactHelmet from "./shared/ReactHelmet";

const allJobs = [
  {
    _id: 1,
    title: "Frontend Developer",
    description: "Build and optimize web applications using React.js.",
    location: "Bangalore",
    company: {
      name: "TechCorp",
      logo: "https://example.com/company1-logo.png",
    },
    createdAt: "2024-09-18T09:00:00Z",
    position: 3,
    jobType: "Full-Time",
    salary: "12",
  },
  {
    _id: 2,
    title: "Backend Developer",
    description: "Develop and maintain server-side APIs using Node.js.",
    location: "Pune",
    company: {
      name: "InnovateX",
      logo: "https://example.com/company2-logo.png",
    },
    createdAt: "2024-09-17T10:30:00Z",
    position: 1,
    jobType: "Full-Time",
    salary: "18",
  },
];

const Browse = () => {
  return (
    <div>
      <Navbar />
      <ReactHelmet
        title="Browse Jobs - Next_Hire"
        description="Browse a wide range of job openings across various industries and locations. Filter by role, experience, and more to find your ideal career opportunity."
        canonicalUrl="http://mysite.com/browse"
      />

      <div className="max-w-7xl mx-auto my-10 p-4">
        <h1 className="font-bold text-xl md:text-2xl my-6">
          Search Results ({allJobs.length})
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {allJobs.map((job) => (
            <Job key={job._id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;
