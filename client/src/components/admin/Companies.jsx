import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import ReactHelmet from "../common/ReactHelmet";
import { getCompanies } from "@/redux/slices/company.slice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loader from "../common/Loader";

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
    <div className='min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-[#6A38C2]/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-[#F83002]/5 rounded-full blur-3xl'></div>
      </div>

      <Navbar />
      {isLoading && <Loader />}

      <ReactHelmet
        title='Companies - Next_Hire'
        description='Explore a list of companies hiring in your area. Learn about company cultures, available positions, and how to apply. Find your next workplace with Next_Hire.'
        canonicalUrl='/companies'
      />

      <div className='max-w-4xl mx-auto pt-24 pb-8 px-4 relative z-10'>
        {filteredCompanies?.length === 0 && !isLoading ? (
          <div className='flex flex-col items-center justify-center py-12 bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-2xl shadow-lg mt-2'>
            <div className='w-16 h-16 bg-gradient-to-br from-[#6A38C2]/10 to-[#F83002]/10 rounded-2xl flex items-center justify-center mb-4'>
              <svg className='w-8 h-8 text-[#6A38C2]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
              </svg>
            </div>
            <h2 className='text-xl font-extrabold text-gray-900 mb-2'>
              No Companies Found
            </h2>
            <p className='text-gray-600 mb-6 text-center max-w-md'>
              It seems there are no companies that match your search criteria.
            </p>
            <Button 
              onClick={() => navigate("/profile/admin/companies/create")}
              className='bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
            >
              Create a New Company
            </Button>
          </div>
        ) : (
          <div className='mt-6'>
            <div className='flex flex-col md:flex-row items-center justify-between mb-6 gap-4'>
              <Input
                className='flex-1 bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-xl focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20'
                placeholder='Filter by company name'
                value={input}
                onChange={(e) => setInput(e?.target?.value || "")}
              />
              <Button
                onClick={() => navigate("/profile/admin/companies/create")}
                className='bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
              >
                New Company
              </Button>
            </div>
            <div className='overflow-x-auto bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-gray-200/60 shadow-lg p-4'>
              <CompaniesTable companies={filteredCompanies} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
