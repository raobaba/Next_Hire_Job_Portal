import React, { useState, useEffect } from "react";
import { getAppliedJobs } from "@/redux/slices/application.slice";
import Loader from "./shared/Loader";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";

const AppliedJobTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const application = useSelector((state) => state.application);

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = () => {
      setLoading(true);
      setError(null);

      dispatch(getAppliedJobs())
        .then((res) => {
          if (res?.payload?.status === 200) {
            const validJobs = res.payload.applications.filter(
              (job) => job?.job?._id // Filter out jobs where job ID is not available
            );
            setAppliedJobs(validJobs);
          } else {
            setError("Failed to load applied jobs.");
          }
        })
        .catch((error) => {
          setError("An error occurred while fetching your applied jobs.");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (!application?.applications?.length) {
      fetchAppliedJobs();
    } else {
      const validJobs = application.applications.filter(
        (job) => job?.job?._id // Filter out jobs where job ID is not available
      );
      setAppliedJobs(validJobs);
    }
  }, [dispatch, application?.applications]);

  const handleCardClick = (jobId) => {
    navigate(`/description/${jobId}`);
  };

  return (
    <div className="container mx-auto p-4">
      {loading && <Loader />}
      {appliedJobs.length === 0 ? (
        <div className="text-center py-4">
          <h2 className="text-lg font-semibold">
            You haven't applied to any jobs yet. Start exploring and find your
            next opportunity!
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {appliedJobs.map((appliedJob) => (
            <div
              key={appliedJob?._id}
              className="bg-white rounded-lg shadow-lg p-4 hover:shadow-2xl flex flex-col justify-between h-80 w-full"
            >
              {/* Company Logo */}
              <div className="flex justify-center mb-3">
                <img
                  src={appliedJob?.job?.company?.logo?.url}
                  alt={appliedJob?.job?.company?.companyName}
                  className="w-16 h-16 object-cover rounded-full"
                />
              </div>

              {/* Job Title and Company */}
              <h3 className="text-md font-bold text-center mb-2">
                {appliedJob?.job?.title}
              </h3>
              <p className="text-gray-600 text-xs text-center mb-2">
                {appliedJob?.job?.company?.companyName} -{" "}
                {appliedJob?.job?.location}
              </p>

              {/* Job Description */}
              <p className="text-gray-500 text-xs mb-2">
                {appliedJob?.job?.description.slice(0, 60)}...
              </p>

              {/* Additional Info: Salary, Experience, and Requirements */}
              <div className="text-gray-700 text-xs mb-2 flex-grow">
                <p>
                  <strong>Salary:</strong> $
                  {appliedJob?.job?.salary.toLocaleString()}
                </p>
                <p>
                  <strong>Experience:</strong>{" "}
                  {appliedJob?.job?.experienceLevel} years
                </p>
                <p>
                  <strong>Key Skills:</strong>{" "}
                  {appliedJob?.job?.requirements.slice(0, 3).join(", ")}...
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex justify-between text-center">
                <button
                  className="bg-blue-500 text-white rounded-xl px-4 py-2"
                  onClick={() => handleCardClick(appliedJob?.job?._id)}
                >
                  Job Details
                </button>
                <Badge
                  className={`rounded-xl ${
                    appliedJob?.status === "rejected"
                      ? "bg-red-400"
                      : appliedJob?.status === "pending"
                      ? "bg-gray-400"
                      : "bg-green-400"
                  }`}
                >
                  {appliedJob?.status?.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default AppliedJobTable;
