import React from "react";
import { useNavigate } from "react-router-dom";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer transition-transform transform hover:scale-105"
    >
      <div>
        <h1 className="font-medium text-lg">{job?.company?.name}</h1>
        <p className="text-sm text-gray-500">India</p>
      </div>
      <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600">{job?.description}</p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <span className="px-2 py-1 text-blue-700 font-bold bg-blue-200 rounded">
          {job?.position} Positions
        </span>
        <span className="px-2 py-1 text-[#F83002] font-bold bg-red-200 rounded">
          {job?.jobType}
        </span>
        <span className="px-2 py-1 text-[#7209b7] font-bold bg-purple-200 rounded">
          {job?.salary} LPA
        </span>
      </div>
    </div>
  );
};

export default LatestJobCards;
