import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { getAdminJobs } from "@/redux/slices/job.slice";
import Loader from "../shared/Loader";

const AdminJobsTable = ({ searchJobByText }) => {
  const dispatch = useDispatch();
  const [filterJobs, setFilterJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAdminJobs()).then((res) => {
      if (res?.payload?.status === 200) {
        const jobs = res?.payload?.jobs || [];
        const filteredJobs = jobs.filter((job) => {
          if (!searchJobByText) {
            return true;
          }
          return (
            job.title.toLowerCase().includes(searchJobByText.toLowerCase()) ||
            (job.company &&
              job.company.companyName
                .toLowerCase()
                .includes(searchJobByText.toLowerCase()))
          );
        });
        setFilterJobs(filteredJobs);
      }
    });
  }, [dispatch, searchJobByText]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {loading && <Loader />}
      {filterJobs.length > 0 ? (
        <Table>
          <TableCaption>A list of your recently posted jobs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterJobs.map((job) => (
              <TableRow
                key={job._id}
                className="hover:bg-gray-100 transition-all"
              >
                <TableCell>{job.company?.companyName || "N/A"}</TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.createdAt.split("T")[0]}</TableCell>
                <TableCell className="text-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      <div
                        onClick={() =>
                          navigate(`/profile/admin/companies/${job._id}`)
                        }
                        className="flex items-center gap-2 w-fit cursor-pointer"
                      >
                        <Edit2 className="w-4" />
                        <span>Edit</span>
                      </div>
                      <div
                        onClick={() =>
                          navigate(`/profile/admin/jobs/${job._id}/applicants`)
                        }
                        className="flex items-center w-fit gap-2 cursor-pointer mt-2"
                      >
                        <Eye className="w-4" />
                        <span>Applicants</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 mt-10">
          <h2 className="text-xl font-semibold text-gray-600 text-center">
            No jobs available. Start by posting a new job!
          </h2>
          <Button onClick={() => navigate("/profile/admin/jobs/create")}>
            Post a New Job
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminJobsTable;
