import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../common/Loader";
import ReactHelmet from "../common/ReactHelmet";
import { getCompanyById, updateCompany } from "@/redux/slices/company.slice";

const CompanySetup = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isBackNavigation, setIsBackNavigation] = useState(false);

  useEffect(() => {
    if (id && !isBackNavigation) {
      setLoading(true);
      dispatch(getCompanyById(id))
        .then((res) => {
          const company = res?.payload?.company;
          if (company) {
            setName(company?.companyName ?? "");
            setDescription(company?.description ?? "");
            setWebsite(company?.website ?? "");
            setLocation(company?.location ?? "");
            setLogo(null);
          } else {
            toast.error("Failed to fetch company data.");
          }
        })
        .catch(() => {
          toast.error("Error fetching company data.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isBackNavigation, dispatch]);

  const handleBackClick = (e) => {
    e.preventDefault();
    setIsBackNavigation(true);
    navigate(-1);
  };

  const changeFileHandler = (e) => {
    const file = e?.target?.files?.[0];
    if (file) setLogo(file);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("website", website);
    formData.append("location", location);
    if (logo) formData.append("logo", logo);

    setLoading(true);
    dispatch(updateCompany({ companyId: id, companyData: formData }))
      .then((res) => {
        const status = res?.payload?.status;
        const message = res?.payload?.message;
        if (status === 200) {
          toast.success(message ?? "Company updated successfully.");
          navigate("/profile");
        } else {
          toast.error(message ?? "Failed to update the company.");
        }
      })
      .catch(() => {
        toast.error("An error occurred. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      {loading && <Loader />}

      <ReactHelmet
        title='Setup Company - Next_Hire'
        description="Configure your company's profile, including details like location, industry, and values. Ensure your organization stands out to potential candidates on Next_Hire."
        canonicalUrl='/company-setup'
      />

      <div className='max-w-xl mx-auto my-10 flex-1 p-4'>
        <form onSubmit={submitHandler}>
          <div className='flex items-center gap-5 p-8'>
            <Button
              onClick={handleBackClick}
              variant='outline'
              className='flex items-center gap-2 text-gray-500 font-semibold'
            >
              <ArrowLeft />
              <span>Back</span>
            </Button>
            <h1 className='font-bold text-xl'>Company Setup</h1>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <Label>Company Name</Label>
              <Input
                type='text'
                value={name}
                onChange={(e) => setName(e?.target?.value ?? "")}
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type='text'
                value={description}
                onChange={(e) => setDescription(e?.target?.value ?? "")}
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                type='url'
                value={website}
                onChange={(e) => setWebsite(e?.target?.value ?? "")}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type='text'
                value={location}
                onChange={(e) => setLocation(e?.target?.value ?? "")}
              />
            </div>
            <div>
              <Label>Logo</Label>
              <Input
                type='file'
                accept='image/*'
                onChange={changeFileHandler}
              />
            </div>
          </div>

          <Button type='submit' className='w-full my-4' disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
