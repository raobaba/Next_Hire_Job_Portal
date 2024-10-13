import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // To enable navigation
import { updateApplicationStatus } from "@/redux/slices/application.slice"; // Importing the action
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const ApplicantsTable = ({ applicants }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook to navigate back

  // State to track accepted/rejected applicants
  const [applicantActions, setApplicantActions] = useState({});

  useEffect(() => {
    // Initialize actions for applicants based on their current status
    const initialActions = {};
    applicants.forEach((item) => {
      initialActions[item._id] =
        item.status.charAt(0).toUpperCase() + item.status.slice(1); // Capitalize status
    });
    setApplicantActions(initialActions);
  }, [applicants]);

  const statusHandler = (action, id) => {
    const status = action === "accept" ? "Accepted" : "Rejected";
    dispatch(updateApplicationStatus({ applicationId: id, status })).then(
      (res) => {
        if (res?.payload?.status === 200) {
          // Update local state to reflect the new action taken
          setApplicantActions((prevActions) => ({
            ...prevActions,
            [id]: status, // Set action taken for the specific applicant
          }));
          toast.success(`Application ${status} successfully!`);
        } else {
          toast.error(`Failed to update application status!`);
        }
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto my-10 mt-2 px-4">
      {/* Go Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
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
                <h2 className="font-bold text-lg">
                  {item.applicant?.fullname}
                </h2>
                <p className="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.applicant?.email}
                </p>
              </div>
            </div>

            {/* Applicant Details */}
            <div className="flex-grow mb-2">
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
              {/* Render buttons based on applicant actions */}
              <button
                onClick={() => statusHandler("accept", item._id)}
                className={`text-white px-4 py-2 rounded ${
                  applicantActions[item._id] === "Accepted"
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
                disabled={applicantActions[item._id] === "Rejected"} // Disable if rejected
              >
                {applicantActions[item._id] === "Accepted"
                  ? "Accepted"
                  : "Accept"}
              </button>

              <button
                onClick={() => statusHandler("reject", item._id)}
                className={`text-white px-4 py-2 rounded ${
                  applicantActions[item._id] === "Rejected"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
                disabled={applicantActions[item._id] === "Accepted"} // Disable if accepted
              >
                {applicantActions[item._id] === "Rejected"
                  ? "Rejected"
                  : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicantsTable;
