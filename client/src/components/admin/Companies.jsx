import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import ReactHelmet from "../shared/ReactHelmet";

// Sample static company data for demonstration
const staticCompaniesData = [
  { id: 1, name: "TechCorp", location: "New York", industry: "Technology" },
  {
    id: 2,
    name: "InnovateX",
    location: "San Francisco",
    industry: "Innovation",
  },
  { id: 3, name: "DevSolutions", location: "Austin", industry: "Software" },
  { id: 4, name: "BuildIt", location: "Seattle", industry: "Construction" },
];

const Companies = () => {
  const [input, setInput] = useState("");
  const [filteredCompanies, setFilteredCompanies] =
    useState(staticCompaniesData);
  const navigate = useNavigate();

  useEffect(() => {
    // Filter companies based on input
    const filtered = staticCompaniesData.filter((company) =>
      company.name.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [input]);

  return (
    <div>
      <Navbar />
      <ReactHelmet
        title="Companies - Next_Hire"
        description="Explore a list of companies hiring in your area. Learn about company cultures, available positions, and how to apply. Find your next workplace with Next_Hire."
        canonicalUrl="http://mysite.com/companies"
      />

      <div className="max-w-6xl mx-auto my-10 p-4">
        <div className="flex flex-col md:flex-row items-center justify-between my-5">
          <Input
            className="flex-1 mb-4 md:mb-0 md:mr-4"
            placeholder="Filter by name"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/companies/create")}>
            New Company
          </Button>
        </div>
        <div className="overflow-x-auto">
          <CompaniesTable companies={filteredCompanies} />
        </div>
      </div>
    </div>
  );
};

export default Companies;
