import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { getAppliedJobs } from "@/redux/slices/application.slice";
import Loader from "./shared/Loader";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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
      setError(null); // Reset error state before fetching

      dispatch(getAppliedJobs())
        .then((res) => {
          if (res?.payload?.status === 200) {
            console.log("response", res?.payload);
            setAppliedJobs(res.payload.applications);
          } else {
            setError("Failed to load applied jobs.");
          }
        })
        .catch((error) => {
          console.error("Error fetching applied jobs:", error);
          setError("An error occurred while fetching your applied jobs.");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    // Only fetch jobs if application doesn't have jobs loaded yet
    if (!application?.applications?.length) {
      fetchAppliedJobs();
    } else {
      setAppliedJobs(application.applications); // Use the already loaded jobs
    }
  }, [dispatch]); // Use length in dependency

  const handleRowClick = (jobId) => {
    navigate(`/description/${jobId}`);
  };

  return (
    <div className="overflow-x-auto">
      {loading && <Loader />}
      {appliedJobs.length === 0 ? (
        <div className="text-center py-4">
          <h2 className="text-lg font-semibold">
            You haven't applied to any jobs yet. Start exploring and find your
            next opportunity!
          </h2>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your applied jobs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Job Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appliedJobs.map((appliedJob) => (
              <TableRow
                key={appliedJob?._id}
                onClick={() => handleRowClick(appliedJob?.job?._id)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <TableCell className="whitespace-nowrap">
                  {appliedJob?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {appliedJob?.job?.title}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {appliedJob?.job?.company?.companyName}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Badge
                    className={`${
                      appliedJob?.status === "rejected"
                        ? "bg-red-400"
                        : appliedJob?.status === "pending"
                        ? "bg-gray-400"
                        : "bg-green-400"
                    }`}
                  >
                    {appliedJob?.status?.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default AppliedJobTable;
