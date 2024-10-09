import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import AdminJobsTable from "./AdminJobsTable";
import ReactHelmet from "../shared/ReactHelmet";

const sampleJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Company A",
    location: "Remote",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Company B",
    location: "On-site",
  },
  { id: 3, title: "Data Scientist", company: "Company C", location: "Hybrid" },
  // Add more sample jobs as needed
];

const AdminJobs = () => {
  const [input, setInput] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(sampleJobs);
  const navigate = useNavigate();

  useEffect(() => {
    if (input) {
      setFilteredJobs(
        sampleJobs.filter(
          (job) =>
            job.title.toLowerCase().includes(input.toLowerCase()) ||
            job.company.toLowerCase().includes(input.toLowerCase())
        )
      );
    } else {
      setFilteredJobs(sampleJobs);
    }
  }, [input]);

  return (
    <div>
      <Navbar />
      <ReactHelmet
        title="Admin Jobs - Next_Hire"
        description="Browse a variety of administrative job opportunities across different sectors. Find roles that match your skills in organization, communication, and management."
        canonicalUrl="http://mysite.com/admin-jobs"
      />

      <div className="max-w-6xl mx-auto my-10 mt-20 px-4">
        <div className="flex items-center justify-between my-5">
          {/* Go Back Button on the left */}
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>

          <div className="flex items-center space-x-4">
            <Input
              className="w-full max-w-md"
              placeholder="Filter by name, role"
              onChange={(e) => setInput(e.target.value)}
            />
            {/* New Job Button on the right */}
            <Button onClick={() => navigate("/profile/admin/jobs/create")}>
              New Job
            </Button>
          </div>
        </div>
        <AdminJobsTable jobs={filteredJobs} />
      </div>
    </div>
  );
};

export default AdminJobs;
