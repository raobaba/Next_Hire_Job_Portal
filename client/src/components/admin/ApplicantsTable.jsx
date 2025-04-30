import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateApplicationStatus } from "@/redux/slices/application.slice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../shared/Loader";

const ApplicantsTable = ({ applicants }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicantActions, setApplicantActions] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const initialActions = {};
    applicants?.forEach((item) => {
      initialActions[item?._id] =
        item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1);
    });
    setApplicantActions(initialActions);
  }, [applicants]);

  const statusHandler = async (action, id) => {
    const status = action === "accept" ? "Accepted" : "Rejected";
    try {
      setIsLoading(true);
      const res = await dispatch(
        updateApplicationStatus({ applicationId: id, status })
      );
      if (res?.payload?.status === 200) {
        setApplicantActions((prev) => ({ ...prev, [id]: status }));
        toast.success(`Application ${status} successfully!`);
      } else {
        toast.error("Failed to update application status!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-6xl mx-auto my-10 mt-2 px-4'>
      {isLoading && <Loader />}

      {/* Go Back Button */}
      <div className='mb-4'>
        <button
          onClick={() => navigate(-1)}
          className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center'
        >
          Go Back
        </button>
      </div>

      {/* Applicants Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {applicants?.map((item) => {
          const status = applicantActions[item?._id];
          const isAccepted = status === "Accepted";
          const isRejected = status === "Rejected";

          return (
            <div
              key={item?._id}
              className='bg-white shadow-lg rounded-lg p-4 border border-gray-200 flex flex-col h-full'
            >
              {/* Profile Info */}
              <div className='flex items-center mb-4'>
                {item?.applicant?.profile?.profilePhoto?.url ? (
                  <img
                    src={item?.applicant?.profile?.profilePhoto?.url}
                    alt={`${item?.applicant?.fullname}'s profile`}
                    className='w-12 h-12 rounded-full mr-4'
                  />
                ) : (
                  <div className='w-12 h-12 bg-gray-300 rounded-full mr-4'></div>
                )}
                <div className='truncate'>
                  <h2 className='font-bold text-lg'>
                    {item?.applicant?.fullname}
                  </h2>
                  <p className='text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap'>
                    {item?.applicant?.email}
                  </p>
                </div>
              </div>

              {/* Applicant Details */}
              <div className='flex-grow mb-2'>
                <div>
                  <strong>Contact:</strong>{" "}
                  {item?.applicant?.phoneNumber || "N/A"}
                </div>
                <div>
                  <strong>Bio:</strong> {item?.applicant?.profile?.bio || "N/A"}
                </div>
                <div>
                  <strong>Skills:</strong>{" "}
                  {item?.applicant?.profile?.skills?.join(", ") || "N/A"}
                </div>
                <div>
                  <strong>Date Applied:</strong>{" "}
                  {new Date(item?.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Resume:</strong>{" "}
                  {item?.applicant?.profile?.resume?.url ? (
                    <a
                      className='text-blue-600'
                      href={item?.applicant?.profile?.resume?.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {item?.applicant?.profile?.resume?.resumeOriginalName}
                    </a>
                  ) : (
                    "Not Available"
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className='mt-auto flex justify-between space-x-3 mt-4'>
                <button
                  onClick={() => statusHandler("accept", item?._id)}
                  className={`text-white px-4 py-2 rounded ${
                    isAccepted ? "bg-green-500" : "bg-blue-500"
                  }`}
                  disabled={isAccepted || isRejected}
                >
                  {isAccepted ? "Accepted" : "Accept"}
                </button>

                <button
                  onClick={() => statusHandler("reject", item?._id)}
                  className={`text-white px-4 py-2 rounded ${
                    isRejected ? "bg-red-500" : "bg-blue-500"
                  }`}
                  disabled={isAccepted || isRejected}
                >
                  {isRejected ? "Rejected" : "Reject"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicantsTable;
