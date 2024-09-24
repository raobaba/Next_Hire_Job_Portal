import React from "react";
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

// Sample applied jobs data for demonstration purposes
const sampleAppliedJobs = [
  {
    _id: 1,
    createdAt: "2024-09-18T09:00:00Z",
    job: {
      title: "Frontend Developer",
      company: {
        name: "TechCorp",
      },
    },
    status: "accepted",
  },
  {
    _id: 2,
    createdAt: "2024-09-17T10:30:00Z",
    job: {
      title: "Backend Developer",
      company: {
        name: "InnovateX",
      },
    },
    status: "pending",
  },
  {
    _id: 3,
    createdAt: "2024-09-16T11:00:00Z",
    job: {
      title: "Full Stack Developer",
      company: {
        name: "DevSolutions",
      },
    },
    status: "rejected",
  },
];

const AppliedJobTable = () => {
  const allAppliedJobs = sampleAppliedJobs; // Use sample data

  return (
    <div className="overflow-x-auto">
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
          {allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                You haven't applied to any jobs yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell className="whitespace-nowrap">
                  {appliedJob.createdAt.split("T")[0]}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {appliedJob.job.title}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {appliedJob.job.company.name}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Badge
                    className={`${
                      appliedJob.status === "rejected"
                        ? "bg-red-400"
                        : appliedJob.status === "pending"
                        ? "bg-gray-400"
                        : "bg-green-400"
                    }`}
                  >
                    {appliedJob.status.toUpperCase()}
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
