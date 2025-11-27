import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LatestJobCards from "./LatestJobCards";
import { getAllJobs } from "@/redux/slices/job.slice";
import Loader from "../../common/Loader";
import { Button } from "../../ui/button";

const LatestJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setLoading(true);
        const res = await dispatch(
          getAllJobs({ page: 1, limit: 6, sortBy: "createdAt", sortOrder: "desc" })
        );
        if (res?.payload?.status === 200 && res?.payload?.jobs) {
          setJobs(res.payload.jobs);
        }
      } catch (error) {
        console.error("Error fetching latest jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestJobs();
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto py-20 px-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#6A38C2]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F83002]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Latest & Top{" "}
          </span>
          <span className="bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent">
            Job Openings
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the most recent opportunities from top companies. Apply now and take the next step in your career!
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {jobs.map((job) => (
              <LatestJobCards key={job._id} job={job} />
            ))}
          </div>
          <div className="text-center">
            <Button
              onClick={() => navigate("/jobs")}
              className="bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              View All Jobs
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No jobs available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default LatestJobs;
