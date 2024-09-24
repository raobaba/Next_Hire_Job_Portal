import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { motion } from "framer-motion";

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
  {
    _id: 3,
    title: "Data Scientist",
    description: "Analyze complex data to provide actionable insights.",
    location: "Hyderabad",
    company: {
      name: "DataWorks",
      logo: "https://example.com/company3-logo.png",
    },
    createdAt: "2024-09-15T14:00:00Z",
    position: 2,
    jobType: "Full-Time",
    salary: "22",
  },
  {
    _id: 4,
    title: "Android Developer",
    description: "Build mobile applications for Android platforms.",
    location: "Delhi",
    company: {
      name: "AppSoft",
      logo: "https://example.com/company4-logo.png",
    },
    createdAt: "2024-09-19T12:00:00Z",
    position: 4,
    jobType: "Contract",
    salary: "10",
  },
  {
    _id: 5,
    title: "DevOps Engineer",
    description: "Manage infrastructure and automate deployment pipelines.",
    location: "Mumbai",
    company: {
      name: "CloudGen",
      logo: "https://example.com/company5-logo.png",
    },
    createdAt: "2024-09-16T08:00:00Z",
    position: 2,
    jobType: "Part-Time",
    salary: "20",
  },
  {
    _id: 6,
    title: "UI/UX Designer",
    description: "Design user-friendly interfaces and improve user experience.",
    location: "Chennai",
    company: {
      name: "DesignPro",
      logo: "https://example.com/company6-logo.png",
    },
    createdAt: "2024-09-13T11:45:00Z",
    position: 1,
    jobType: "Full-Time",
    salary: "14",
  },
  {
    _id: 7,
    title: "Project Manager",
    description: "Oversee project development and ensure timely delivery.",
    location: "Kolkata",
    company: {
      name: "ProManage",
      logo: "https://example.com/company7-logo.png",
    },
    createdAt: "2024-09-12T07:30:00Z",
    position: 1,
    jobType: "Full-Time",
    salary: "25",
  },
  {
    _id: 8,
    title: "FullStack Developer",
    description: "Work on both front-end and back-end features of web apps.",
    location: "Bangalore",
    company: {
      name: "CodeCraft",
      logo: "https://example.com/company8-logo.png",
    },
    createdAt: "2024-09-20T13:00:00Z",
    position: 2,
    jobType: "Full-Time",
    salary: "16",
  },
  {
    _id: 9,
    title: "Machine Learning Engineer",
    description: "Develop and optimize machine learning models.",
    location: "Pune",
    company: {
      name: "AI Innovations",
      logo: "https://example.com/company9-logo.png",
    },
    createdAt: "2024-09-18T15:00:00Z",
    position: 3,
    jobType: "Full-Time",
    salary: "30",
  },
  {
    _id: 10,
    title: "QA Engineer",
    description:
      "Test software products and ensure they meet quality standards.",
    location: "Gurgaon",
    company: {
      name: "TestTech",
      logo: "https://example.com/company10-logo.png",
    },
    createdAt: "2024-09-14T09:30:00Z",
    position: 2,
    jobType: "Full-Time",
    salary: "12",
  },
];
const Jobs = () => {
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [searchedQuery, setSearchedQuery] = useState("");
  
    useEffect(() => {
      if (searchedQuery) {
        const filteredJobs = allJobs.filter((job) => {
          return (
            job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
            job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchedQuery.toLowerCase())
          );
        });
        setFilterJobs(filteredJobs);
      } else {
        setFilterJobs(allJobs);
      }
    }, [searchedQuery]);
  
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto mt-20 px-4">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full md:w-1/4 lg:w-1/5">
              <FilterCard setSearchedQuery={setSearchedQuery} />
            </div>
            <div className="flex-1 h-[80vh] overflow-y-auto pb-5">
              {filterJobs.length <= 0 ? (
                <span>Job not found</span>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filterJobs.map((job) => (
                    <motion.div
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      key={job._id}
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Jobs;