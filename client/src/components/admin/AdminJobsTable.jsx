import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye, Edit2 } from "lucide-react";

const AdminJobsTable = ({ jobs }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-4">
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="flex flex-col border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow h-full" // Added flex and h-full
            >
              <div className="flex items-center justify-between mb-2">
                <img
                  src={
                    job.company?.logo?.url || "https://via.placeholder.com/100"
                  }
                  alt={job.company?.companyName || "Company Logo"}
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div className="text-sm text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
              <h2 className="text-lg font-bold">{job.title}</h2>
              <p className="text-gray-600">
                {job.company?.companyName || "Unknown Company"}
              </p>
              <p className="text-gray-500 text-sm mt-2 flex-grow">
                {" "}
                {/* Added flex-grow */}
                {job.description.length > 100
                  ? job.description.substring(0, 100) + "..."
                  : job.description}
              </p>

              <div className="mt-4">
                <p className="text-gray-700 font-medium">
                  Location: {job.location}
                </p>
                <p className="text-gray-700 font-medium">
                  Salary: ${job.salary.toLocaleString()}
                </p>
                <p className="text-gray-700 font-medium">
                  Experience Level: {job.experienceLevel} years
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between mt-4">
                {" "}
                {/* Added mt-auto */}
                <Button
                  variant="outline" // Adjust the variant as needed
                  className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500" // Updated styles
                  onClick={() =>
                    navigate(`/profile/admin/jobs/${job._id}/applicants`)
                  }
                >
                  <Eye className="w-4 h-4 mr-1" /> View Applicants
                </Button>
                <Button
                  variant="secondary" // Adjust the variant as needed
                  className="bg-green-500 hover:bg-green-600 text-white border-green-500" // Updated styles
                  onClick={() =>
                    navigate(`/profile/admin/companies/${job._id}`)
                  }
                >
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 mt-10">
          <h2 className="text-xl font-semibold text-gray-600 text-center">
            No jobs available. Start by posting a new job!
          </h2>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white" // Updated styles
            onClick={() => navigate("/profile/admin/jobs/create")}
          >
            Post a New Job
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminJobsTable;
