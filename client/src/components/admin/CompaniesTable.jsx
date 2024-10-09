import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "@/redux/slices/company.slice";

const CompaniesTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const companies = useSelector((state) => state.company.companies);

  useEffect(() => {
    if (!companies || companies.length === 0) {
      dispatch(getCompanies()).then((res) => {
        if (res?.payload?.status === 200) {
          console.log(res?.payload);
        } else {
          toast.error("Failed to fetch companies.");
        }
      });
    }
  }, [dispatch, companies]);

  const handleJobDetails = () => {
    navigate("/profile/admin/jobs");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableCaption>
            A list of your recent registered companies
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies && companies.length > 0 ? (
              companies.map((company) => (
                <TableRow
                  key={company._id}
                  className="cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all duration-200 ease-in-out mb-4 rounded-lg"
                  onClick={handleJobDetails}
                >
                  <TableCell className="p-4">
                    <Avatar>
                      <AvatarImage src={company?.logo?.url} />
                    </Avatar>
                  </TableCell>
                  <TableCell className="p-4">{company.companyName}</TableCell>
                  <TableCell className="p-4">
                    {company.createdAt
                      ? company.createdAt.split("T")[0]
                      : "No date available"}
                  </TableCell>
                  <TableCell className="p-4 text-right cursor-pointer">
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal />
                      </PopoverTrigger>
                      <PopoverContent className="w-32">
                        <div
                          onClick={() =>
                            navigate(`/profile/admin/companies/${company._id}`)
                          }
                          className="flex items-center gap-2 w-fit cursor-pointer"
                        >
                          <Edit2 className="w-4" />
                          <span>Edit</span>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="4" className="text-center p-4">
                  No companies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompaniesTable;
