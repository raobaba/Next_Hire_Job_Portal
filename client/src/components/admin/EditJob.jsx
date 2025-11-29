import React, { useState, useEffect } from "react";
import Navbar from "../layout/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Loader2 } from "lucide-react";
import ReactHelmet from "../common/ReactHelmet";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "@/redux/slices/company.slice";
import { updateJob, getJobById } from "@/redux/slices/job.slice";
import Loader from "../common/Loader";

const EditJob = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [company, setCompany] = useState([]);
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch job details
    dispatch(getJobById(id))
      .then((res) => {
        if (res?.payload?.status === 200) {
          const job = res.payload.job;
          setInput({
            title: job.title || "",
            description: job.description || "",
            requirements: job.requirements || "",
            salary: job.salary || "",
            location: job.location || "",
            jobType: job.jobType || "",
            experience: job.experienceLevel?.toString() || "",
            position: job.position || 0,
            companyId: job.company?._id || "",
          });
        }
        setFetching(false);
      })
      .catch(() => {
        toast.error("Failed to fetch job details");
        setFetching(false);
      });

    // Fetch companies
    dispatch(getCompanies())
      .then((res) => {
        if (res?.payload?.status === 200) {
          setCompany(res?.payload);
        }
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
      });
  }, [dispatch, id]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = company?.companies?.find(
      (company) => company?.companyName === value
    );
    setInput({
      ...input,
      companyId: selectedCompany?._id,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      ...input,
      experienceLevel: input.experience ? parseFloat(input.experience) : undefined,
    };

    dispatch(updateJob({ jobId: id, data: formData }))
      .then((res) => {
        if (res?.payload?.status === 200) {
          toast.success(res?.payload?.message ?? "Job updated successfully.");
          setLoading(false);
          navigate(-1);
        } else {
          toast.error("An error occurred while updating the job.");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An unexpected error occurred.");
        setLoading(false);
      });
  };

  if (fetching) {
    return (
      <div>
        <Navbar />
        <Loader />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden'>
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-[#6A38C2]/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-[#F83002]/5 rounded-full blur-3xl'></div>
      </div>

      <Navbar />
      {loading && <Loader />}
      <ReactHelmet
        title='Edit Job - Next_Hire'
        description='Update job details including role, responsibilities, and requirements.'
        canonicalUrl='/edit-job'
      />

      <div className='flex items-center justify-center w-full my-5 px-4 pt-24 pb-8 md:px-0 relative z-10'>
        <form
          onSubmit={submitHandler}
          className='p-8 max-w-4xl bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 shadow-xl rounded-2xl w-full'
        >
          <h1 className='text-3xl md:text-4xl font-extrabold mb-6 text-center'>
            <span className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
              Edit{" "}
            </span>
            <span className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent'>
              Job
            </span>
          </h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <Label className='font-bold text-gray-900 mb-2'>Title</Label>
              <Input
                type='text'
                name='title'
                value={input.title}
                onChange={changeEventHandler}
                className='w-full rounded-xl border-2 border-gray-200/60 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 bg-white/80 backdrop-blur-sm'
                required
              />
            </div>
            <div>
              <Label className='font-bold text-gray-900 mb-2'>Description</Label>
              <Input
                type='text'
                name='description'
                value={input.description}
                onChange={changeEventHandler}
                className='w-full rounded-xl border-2 border-gray-200/60 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 bg-white/80 backdrop-blur-sm'
                required
              />
            </div>
            <div>
              <Label className='font-bold text-gray-900 mb-2'>Requirements</Label>
              <Input
                type='text'
                name='requirements'
                value={input.requirements}
                onChange={changeEventHandler}
                className='w-full rounded-xl border-2 border-gray-200/60 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 bg-white/80 backdrop-blur-sm'
                placeholder='e.g., React, Node.js, Python'
              />
            </div>
            <div>
              <Label className='font-bold text-gray-900 mb-2'>Salary</Label>
              <Input
                type='text'
                name='salary'
                value={input.salary}
                onChange={changeEventHandler}
                className='w-full rounded-xl border-2 border-gray-200/60 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 bg-white/80 backdrop-blur-sm'
                placeholder='e.g., 500000'
              />
            </div>
            <div>
              <Label className='font-bold text-gray-900 mb-2'>Location</Label>
              <Input
                type='text'
                name='location'
                value={input.location}
                onChange={changeEventHandler}
                className='w-full rounded-xl border-2 border-gray-200/60 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 bg-white/80 backdrop-blur-sm'
                placeholder='e.g., Mumbai, India'
              />
            </div>
            <div>
              <Label className='font-bold text-gray-900 mb-2'>Job Type</Label>
              <Input
                type='text'
                name='jobType'
                value={input.jobType}
                onChange={changeEventHandler}
                className='w-full rounded-xl border-2 border-gray-200/60 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 bg-white/80 backdrop-blur-sm'
                placeholder='e.g., Full-time, Part-time'
              />
            </div>
            <div>
              <Label className='font-bold text-gray-900 mb-2'>Experience Level</Label>
              <Input
                type='text'
                name='experience'
                value={input.experience}
                onChange={changeEventHandler}
                className='w-full rounded-xl border-2 border-gray-200/60 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 bg-white/80 backdrop-blur-sm'
                placeholder='e.g., 2-5 years'
              />
            </div>
            <div>
              <Label className='font-bold text-gray-900 mb-2'>No of Positions</Label>
              <Input
                type='number'
                name='position'
                value={input.position}
                onChange={changeEventHandler}
                className='w-full rounded-xl border-2 border-gray-200/60 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 bg-white/80 backdrop-blur-sm'
                min='1'
              />
            </div>
            {company?.companies?.length > 0 && (
              <div>
                <Label className='font-bold text-gray-900 mb-2'>Select Company</Label>
                <Select
                  value={
                    company?.companies?.find((c) => c._id === input.companyId)
                      ?.companyName || ""
                  }
                  onValueChange={selectChangeHandler}
                >
                  <SelectTrigger className='w-full rounded-xl border-2 border-gray-200/60 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 bg-white/80 backdrop-blur-sm'>
                    <SelectValue placeholder='Select a Company' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {company?.companies?.map((company) => (
                        <SelectItem key={company?._id} value={company?.companyName}>
                          {company?.companyName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {loading ? (
            <Button
              className='w-full my-6 bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
              disabled
            >
              <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
            </Button>
          ) : (
            <Button
              type='submit'
              className='w-full my-6 bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
            >
              Update Job
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditJob;

