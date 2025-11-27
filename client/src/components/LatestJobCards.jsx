import React from "react";
import { useNavigate } from "react-router-dom";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="group relative p-6 rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:border-[#6A38C2]/30 overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6A38C2]/5 to-[#F83002]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="mb-4">
          <h3 className="font-bold text-xl text-gray-900 group-hover:text-[#6A38C2] transition-colors duration-300">
            {job?.company?.companyName || "Company Name"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{job?.location || "Location"}</p>
        </div>
        
        <div className="mb-4">
          <h2 className="font-extrabold text-xl text-gray-900 mb-2 group-hover:text-[#6A38C2] transition-colors duration-300">
            {job?.title}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-2">
            {job?.description || "No description available"}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {job?.position && (
            <span className="px-3 py-1.5 text-sm font-semibold text-blue-700 bg-blue-100 rounded-lg border border-blue-200 group-hover:bg-blue-200 transition-colors duration-300">
              {job.position} Position{job.position > 1 ? "s" : ""}
            </span>
          )}
          {job?.jobType && (
            <span className="px-3 py-1.5 text-sm font-semibold text-[#F83002] bg-red-100 rounded-lg border border-red-200 group-hover:bg-red-200 transition-colors duration-300">
              {job.jobType}
            </span>
          )}
          {job?.salary && (
            <span className="px-3 py-1.5 text-sm font-semibold text-[#6A38C2] bg-purple-100 rounded-lg border border-purple-200 group-hover:bg-purple-200 transition-colors duration-300">
              ₹{job.salary} LPA
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestJobCards;
