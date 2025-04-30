import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import AdminJobsTable from "./AdminJobsTable";
import ReactHelmet from "../shared/ReactHelmet";
import Loader from "../shared/Loader";
import { useDispatch } from "react-redux";
import { getJobsByCompany } from "@/redux/slices/company.slice";
import { deleteJob } from "@/redux/slices/job.slice";

const AdminJobs = () => {
  const { id } = useParams();
  const [input, setInput] = useState("");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getJobsByCompany(id)).then((res) => {
      if (res?.payload?.status === 200) {
        setJobs(res?.payload?.jobs || []);
        setFilteredJobs(res?.payload?.jobs || []);
      }
      setLoading(false);
    });
  }, [dispatch, id]);

  useEffect(() => {
    if (input) {
      setFilteredJobs(
        jobs.filter(
          (job) =>
            job?.title?.toLowerCase().includes(input?.toLowerCase()) ||
            job?.company?.companyName?.toLowerCase().includes(input.toLowerCase())
        )
      );
    } else {
      setFilteredJobs(jobs);
    }
  }, [input, jobs]);

  const handleJobDeletion = (deletedJobId) => {
    setJobs((prevJobs) => prevJobs?.filter((job) => job?._id !== deletedJobId));
    setFilteredJobs((prevFilteredJobs) =>
      prevFilteredJobs?.filter((job) => job?._id !== deletedJobId)
    );
  };

  return (
    <div>
      <Navbar />
      {loading && <Loader />}
      <ReactHelmet
        title="Admin Jobs - Next_Hire"
        description="Browse a variety of administrative job opportunities across different sectors. Find roles that match your skills in organization, communication, and management."
        canonicalUrl="http://mysite.com/admin-jobs"
      />

      <div className="max-w-6xl mx-auto my-10 mt-20 px-4">
        <div className="flex items-center justify-between my-5">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>

          <div className="flex items-center space-x-4">
            <Input
              className="w-full max-w-md"
              placeholder="Filter by name, role"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={() => navigate("/profile/admin/jobs/create")}>
              New Job
            </Button>
          </div>
        </div>
        <AdminJobsTable jobs={filteredJobs} onDeleteJob={handleJobDeletion} />
      </div>
    </div>
  );
};

export default AdminJobs;
