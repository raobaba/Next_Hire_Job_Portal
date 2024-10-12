import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
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
import ReactHelmet from "../shared/ReactHelmet";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "@/redux/slices/company.slice";
import { postJob } from "@/redux/slices/job.slice";
import Loader from "../shared/Loader";

const PostJob = () => {
  const dispatch = useDispatch();
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
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = company?.companies?.find(
      (company) => company.companyName === value // Remove lowercase comparison
    );
    setInput({
      ...input,
      companyId: selectedCompany?._id, // Use optional chaining for safety
    });
  };

  useEffect(() => {
    dispatch(getCompanies()).then((res) => {
      if (res?.payload?.status === 200) {
        setCompany(res?.payload);
      }
    });
  }, [dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      ...input,
    };

    dispatch(postJob(formData))
      .then((res) => {
        if (res?.payload?.status === 200) {
          toast.success(res?.payload?.message);
          setLoading(false);
          navigate(-1);
        } else {
          toast.error("An error occurred while posting the job.");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An unexpected error occurred."); // Avoid accessing res inside catch
        setLoading(false);
      });
  };

  return (
    <div className="m-auto flex items-center justify-center w-11/12">
      <Navbar />
      <ReactHelmet
        title="Post a Job - Next_Hire"
        description="Easily post job openings to attract qualified candidates. Fill out the job details, including role, responsibilities, and requirements, to find the perfect fit for your team."
        canonicalUrl="http://mysite.com/post-job"
      />

      <div className="flex items-center justify-center w-11/12 my-5 px-4 mt-20 md:px-0">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="w-full max-w-md my-1"
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="w-full max-w-md my-1"
                required
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="w-full max-w-md my-1"
              />
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="w-full max-w-md my-1"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="w-full max-w-md my-1"
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="w-full max-w-md my-1"
              />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Input
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="w-full max-w-md my-1"
              />
            </div>
            <div>
              <Label>No of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="w-full max-w-md my-1"
                min="1"
              />
            </div>
            {company?.companies?.length > 0 && (
              <div>
                <Label>Select Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {company?.companies?.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.companyName} // Do not lowercase here
                        >
                          {company.companyName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {loading ? (
            <Button className="w-full my-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Post New Job
            </Button>
          )}
          {company?.companies?.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center my-3">
              *Please register a company first before posting a job
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
