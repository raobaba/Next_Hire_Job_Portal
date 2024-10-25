import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "@/redux/slices/company.slice";
import { Avatar, AvatarImage } from "../ui/avatar";
import { toast } from "react-toastify";

const CompaniesTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const companies = useSelector((state) => state?.company?.companies);

  useEffect(() => {
    if (!companies || companies?.length === 0) {
      dispatch(getCompanies()).then((res) => {
        if (res?.payload?.status === 200) {
          console.log(res?.payload);
        } else {
          toast.error("Failed to fetch companies.");
        }
      });
    }
  }, [dispatch, companies]);

  return (
    <div className="container mx-auto p-4">
      {companies && companies?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies?.map((company) => (
            <div
              key={company?._id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out flex flex-col justify-between h-80 w-full"
              style={{ minHeight: "320px", maxWidth: "100%" }}
            >
              {/* Company Logo */}
              <div className="flex justify-center mb-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={company?.logo?.url} />
                </Avatar>
              </div>

              {/* Company Name */}
              <h2 className="text-lg font-bold text-center mb-2">
                {company?.companyName}
              </h2>

              {/* Company Description */}
              <p className="text-gray-600 text-sm text-center mb-4 overflow-hidden overflow-ellipsis">
                {company?.description?.length > 80
                  ? `${company?.description?.slice(0, 80)}...`
                  : company?.description}
              </p>

              {/* Location */}
              <div className="text-center text-gray-500 text-sm mb-2">
                <span className="font-semibold">Location: </span>
                {company?.location}
              </div>

              {/* Website */}
              <div className="text-center">
                <a
                  href={company?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Visit Website
                </a>
              </div>

              {/* Action: Go to Company Details */}
              <div className="mt-4 flex justify-between">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                  onClick={() => navigate(`/profile/admin/jobs/${company?._id}`)}
                >
                  View Jobs
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                  onClick={() =>
                    navigate(`/profile/admin/companies/${company?._id}`)
                  }
                >
                  Updated
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6">
          <p>No companies found.</p>
        </div>
      )}
    </div>
  );
};

export default CompaniesTable;
