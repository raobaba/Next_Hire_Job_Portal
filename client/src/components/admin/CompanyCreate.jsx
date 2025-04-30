import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactHelmet from "../shared/ReactHelmet";
import { useDispatch } from "react-redux";
import Loader from "../shared/Loader";
import { registerCompany } from "@/redux/slices/company.slice";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const registerNewCompany = async () => {
    if (!companyName?.trim()) {
      toast.error("Company name is required.");
      return;
    }

    setLoading(true);
    const companyData = { companyName };

    try {
      const res = await dispatch(registerCompany(companyData));
      const status = res?.payload?.status;
      const message = res?.payload?.message;
      const companyId = res?.payload?.company?._id;

      if (status === 200) {
        toast.success(message || "Company registered successfully!");
        navigate(`/profile/admin/companies/${companyId}`);
      } else {
        toast.error(message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error registering company:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      {loading && <Loader />}
      <ReactHelmet
        title='Create Company - Next_Hire'
        description='Register your company and post job openings to attract top talent. Provide essential information about your organization and start building your team with Next_Hire.'
        canonicalUrl='http://mysite.com/create-company'
      />

      <div className='max-w-4xl mx-auto mt-20'>
        <div className='my-10'>
          <h1 className='font-bold text-2xl'>Your Company Name</h1>
          <p className='text-gray-500'>
            What would you like to give your company name? You can change this
            later.
          </p>
        </div>

        <Label>Company Name</Label>
        <Input
          type='text'
          className='my-2'
          placeholder='JobHunt, Microsoft etc.'
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <div className='flex items-center gap-2 my-10'>
          <Button variant='outline' onClick={() => navigate("/profile")}>
            Cancel
          </Button>
          <Button onClick={registerNewCompany}>Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
