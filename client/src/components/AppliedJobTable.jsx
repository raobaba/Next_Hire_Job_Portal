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

const AppliedJobTable = () => {
  const dispatch = useDispatch();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const application = useSelector((state) => state.application);
  useEffect(() => {
    if (!application?.applications?.length) {
      setLoading(true);
      dispatch(getAppliedJobs()).then((res) => {
        if (res?.payload?.status === 200) {
          console.log("response", res?.payload);
          setAppliedJobs(res.payload.applications);
          setLoading(false);
        }
      });
    } else {
      setAppliedJobs(application.applications);
    }
  }, [dispatch]);
  console.log(appliedJobs);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>A list of your applied jobs</TableCaption>
        {loading && <Loader />}
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                You haven't applied to any jobs yet.
              </TableCell>
            </TableRow>
          ) : (
            appliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob?._id}>
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
