import React from "react";
import { useNavigate } from "react-router-dom"; // To enable navigation

const shortlistingStatus = [
  { label: "Accepted", color: "bg-green-500" },
  { label: "Rejected", color: "bg-red-500" },
];

const ApplicantsTable = ({ applicants }) => {
  const navigate = useNavigate(); // Hook to navigate back

  const statusHandler = async (status, id) => {
    // Handle accept/reject logic here
  };

  return (
    <div className="max-w-6xl mx-auto my-10 mt-2 px-4">
      {/* Go Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)} // Navigate back to the previous page
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          Go Back
        </button>
      </div>

      {/* Applicants Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {applicants.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 flex flex-col h-full" // Set flex column layout
          >
            {/* Profile Info */}
            <div className="flex items-center mb-4">
              {item.applicant?.profile?.profilePhoto?.url ? (
                <img
                  src={item.applicant.profile.profilePhoto.url}
                  alt={`${item.applicant.fullname}'s profile`}
                  className="w-12 h-12 rounded-full mr-4"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              )}
              <div className="truncate">
                {/* Added truncate class to ensure text doesn't overflow */}
                <h2 className="font-bold text-lg">
                  {item.applicant?.fullname}
                </h2>
                <p className="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                  {/* Ensured email is properly styled */}
                  {item.applicant?.email}
                </p>
              </div>
            </div>

            {/* Applicant Details */}
            <div className="flex-grow mb-2">
              {" "}
              {/* Added flex-grow */}
              <div>
                <strong>Contact:</strong> {item.applicant?.phoneNumber || "N/A"}
              </div>
              <div>
                <strong>Bio:</strong> {item.applicant?.profile?.bio || "N/A"}
              </div>
              <div>
                <strong>Skills:</strong>{" "}
                {item.applicant?.profile?.skills?.join(", ") || "N/A"}
              </div>
              <div>
                <strong>Date Applied:</strong>{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
              <div>
                <strong>Resume:</strong>{" "}
                {item.applicant?.profile?.resume ? (
                  <a
                    className="text-blue-600"
                    href={item.applicant.profile.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.applicant.profile.resume.resumeOriginalName}
                  </a>
                ) : (
                  "Not Available"
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex justify-between space-x-3 mt-4">
              {" "}
              {/* mt-auto added */}
              {shortlistingStatus.map((status) => (
                <button
                  key={status.label}
                  onClick={() => statusHandler(status.label, item._id)}
                  className={`text-white px-4 py-2 rounded ${status.color}`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicantsTable;
