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
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Sample static company data for demonstration
const staticCompaniesData = [
  {
    _id: 1,
    logo: "https://via.placeholder.com/50",
    name: "TechCorp",
    createdAt: "2024-09-01T09:00:00Z",
  },
  {
    _id: 2,
    logo: "https://via.placeholder.com/50",
    name: "InnovateX",
    createdAt: "2024-09-02T10:30:00Z",
  },
  {
    _id: 3,
    logo: "https://via.placeholder.com/50",
    name: "DevSolutions",
    createdAt: "2024-09-03T11:00:00Z",
  },
  {
    _id: 4,
    logo: "https://via.placeholder.com/50",
    name: "BuildIt",
    createdAt: "2024-09-04T12:00:00Z",
  },
];

const CompaniesTable = () => {
  const [companies] = useState(staticCompaniesData); // Static data
  const [searchCompanyByText, setSearchCompanyByText] = useState("");
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredCompany = companies.filter((company) => {
      if (!searchCompanyByText) {
        return true;
      }
      return company?.name
        ?.toLowerCase()
        .includes(searchCompanyByText.toLowerCase());
    });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Filter by company name"
        value={searchCompanyByText}
        onChange={(e) => setSearchCompanyByText(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableCaption>A list of your recent registered companies</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterCompany.map((company) => (
              <TableRow key={company._id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={company.logo} />
                  </Avatar>
                </TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                <TableCell className="text-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      <div
                        onClick={() =>
                          navigate(`/admin/companies/${company._id}`)
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompaniesTable;
