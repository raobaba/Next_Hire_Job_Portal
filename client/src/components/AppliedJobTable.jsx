import React, { useState, useEffect } from "react";
import { getAppliedJobs } from "@/redux/slices/application.slice";
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
    const fetchAppliedJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await dispatch(getAppliedJobs()).unwrap();
        if (res?.status === 200) {
          const validJobs = res.applications.filter((job) => job?.job?._id); // Filter out jobs without job IDs
          setAppliedJobs(validJobs);
        } else {
          setError("Failed to load applied jobs.");
        }
      } catch (error) {
        setError("An error occurred while fetching your applied jobs.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch only if applications are not already loaded
    if (!application?.applications?.length) {
      fetchAppliedJobs();
    } else {
      const validJobs = application.applications.filter((job) => job?.job?._id); // Filter out jobs without job IDs
      setAppliedJobs(validJobs);
    }
  }, [dispatch, application?.applications?.length]);

  const handleCardClick = (jobId) => {
    navigate(`/description/${jobId}`);
  };

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
      {Array.from({ length: 6 })?.map((_, index) => (
        <div
          key={index}
          className='bg-white rounded-lg shadow-lg p-4 animate-pulse flex flex-col justify-between h-80 w-full'
        >
          <div className='flex justify-center mb-3'>
            <div className='w-16 h-16 bg-gray-300 rounded-full'></div>
          </div>
          <div className='h-4 bg-gray-300 rounded mb-2'></div>
          <div className='h-4 bg-gray-300 rounded mb-2 w-3/4 mx-auto'></div>
          <div className='h-3 bg-gray-300 rounded mb-2'></div>
          <div className='h-3 bg-gray-300 rounded mb-2 w-5/6 mx-auto'></div>
          <div className='h-3 bg-gray-300 rounded mb-2'></div>
          <div className='h-3 bg-gray-300 rounded mb-2 w-4/5 mx-auto'></div>
          <div className='flex justify-between'>
            <div className='w-24 h-8 bg-gray-300 rounded-lg'></div>
            <div className='w-16 h-8 bg-gray-300 rounded-lg'></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Applied Job Item Component
  const JobCard = ({ appliedJob }) => {
    const job = appliedJob?.job;
    return (
      <div
        key={appliedJob?._id}
        className='bg-white rounded-lg shadow-lg p-4 hover:shadow-2xl flex flex-col justify-between h-80 w-full'
      >
        <div className='flex justify-center mb-3'>
          <img
            src={job?.company?.logo?.url}
            alt={job?.company?.companyName}
            className='w-16 h-16 object-cover rounded-full'
          />
        </div>
        <h3 className='text-md font-bold text-center mb-2'>{job?.title}</h3>
        <p className='text-gray-600 text-xs text-center mb-2'>
          {job?.company?.companyName} - {job?.location}
        </p>
        <p className='text-gray-500 text-xs mb-2'>
          {job?.description?.slice(0, 60)}...
        </p>
        <div className='text-gray-700 text-xs mb-2 flex-grow'>
          <p>
            <strong>Salary:</strong> ₹{job?.salary?.toLocaleString()}
          </p>
          <p>
            <strong>Experience:</strong> {job?.experienceLevel} years
          </p>
          <p>
            <strong>Key Skills:</strong>{" "}
            {job?.requirements?.slice(0, 3).join(", ")}...
          </p>
        </div>
        <div className='flex justify-between text-center'>
          <button
            className='bg-blue-500 text-white rounded-xl px-4 py-2'
            onClick={() => handleCardClick(job?._id)}
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
    );
  };

  return (
    <div className='container mx-auto p-4'>
      {loading && <LoadingSkeleton />}

      {!loading && appliedJobs.length === 0 && (
        <div className='text-center py-4'>
          <h2 className='text-lg font-semibold'>
            You haven't applied to any jobs yet. Start exploring and find your
            next opportunity!
          </h2>
        </div>
      )}

      {!loading && appliedJobs.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
          {appliedJobs?.map((appliedJob) => (
            <JobCard key={appliedJob?._id} appliedJob={appliedJob} />
          ))}
        </div>
      )}

      {error && (
        <div className='text-center text-red-500 py-4'>
          <h3>{error}</h3>
        </div>
      )}
    </div>
  );
};

export default AppliedJobTable;
