import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import ReactHelmet from "../shared/ReactHelmet";
import { getCompanies } from "@/redux/slices/company.slice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loader from "../shared/Loader";

const Companies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getCompanies())
      .then((res) => {
        if (res?.payload?.status === 200) {
          setCompanies(res?.payload?.companies || []);
        } else {
          toast.error("Failed to fetch companies");
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  // Filtered Companies with optional chaining
  const filteredCompanies = companies?.filter((company) =>
    company?.companyName?.toLowerCase()?.includes(input?.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      {isLoading && <Loader />}

      <ReactHelmet
        title='Companies - Next_Hire'
        description='Explore a list of companies hiring in your area. Learn about company cultures, available positions, and how to apply. Find your next workplace with Next_Hire.'
        canonicalUrl='http://mysite.com/companies'
      />

      <div className='max-w-4xl mx-auto'>
        {filteredCompanies?.length === 0 && !isLoading ? (
          <div className='flex flex-col items-center justify-center py-10 border border-dashed border-gray-300 rounded-2xl mt-2'>
            <h2 className='text-lg font-semibold text-gray-700 mb-4'>
              No Companies Found
            </h2>
            <p className='text-gray-500 mb-4'>
              It seems there are no companies that match your search criteria.
            </p>
            <Button onClick={() => navigate("/profile/admin/companies/create")}>
              Create a New Company
            </Button>
          </div>
        ) : (
          <div className='mt-6'>
            <div className='flex flex-col md:flex-row items-center justify-between mb-4'>
              <Input
                className='flex-1 mb-4 md:mb-0 md:mr-4'
                placeholder='Filter by company name'
                value={input}
                onChange={(e) => setInput(e?.target?.value || "")}
              />
              <Button
                onClick={() => navigate("/profile/admin/companies/create")}
              >
                New Company
              </Button>
            </div>
            <div className='overflow-x-auto'>
              <CompaniesTable companies={filteredCompanies} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
