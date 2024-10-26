import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactHelmet from "../shared/ReactHelmet";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../shared/Loader";
import { registerCompany } from "@/redux/slices/company.slice";
const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const registerNewCompany = async () => {
    setLoading(true);
    const companyData = {
      companyName: companyName,
    };
    dispatch(registerCompany(companyData)).then((res) => {
      if (res?.payload?.status === 200) {
        toast.success(res?.payload?.message);
        setLoading(false);
        navigate(`/profile/admin/companies/${res?.payload?.company._id}`);
      } else {
        toast.error(res?.payload?.message);
        setLoading(false);
      }
    }).catch((error)=>{
      console.log(error);
      setLoading(false)
    })
    
  };

  return (
    <div>
      <Navbar />
      {loading && <Loader />}
      <ReactHelmet
        title="Create Company - Next_Hire"
        description="Register your company and post job openings to attract top talent. Provide essential information about your organization and start building your team with Next_Hire."
        canonicalUrl="http://mysite.com/create-company"
      />

      <div className="max-w-4xl mx-auto mt-20">
        <div className="my-10">
          <h1 className="font-bold text-2xl">Your Company Name</h1>
          <p className="text-gray-500">
            What would you like to give your company name? You can change this
            later.
          </p>
        </div>

        <Label>Company Name</Label>
        <Input
          type="text"
          className="my-2"
          placeholder="JobHunt, Microsoft etc."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <div className="flex items-center gap-2 my-10">
          <Button variant="outline" onClick={() => navigate("/profile")}>
            Cancel
          </Button>
          <Button onClick={registerNewCompany}>Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
