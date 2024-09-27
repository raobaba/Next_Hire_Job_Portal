import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { FaCircleUser, FaGoogle } from "react-icons/fa6";
import ReactHelmet from "@/components/shared/ReactHelmet";
import JobSearch from "@/assets/job_search.png";
import RegisterNavbar from "../shared/RegiserNavbar";
import Loader from "../shared/Loader";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-1 items-start justify-center min-h-screen overflow-hidden px-4">
      <RegisterNavbar />
      <ReactHelmet
        title="Signup - Next_Hire"
        description="Signup to access job opportunities and recruitments"
        canonicalUrl="http://mysite.com/signup"
      />
      {/* Static box with job-related text and green check marks */}
      <div className="bg-white rounded-lg shadow-custom mt-[50px] md:mt-[100px] p-6 md:p-8 w-full md:w-1/3 md:h-[400px] sticky top-[100px] mb-8 md:mb-0 flex flex-col items-center">
        <div className="w-40 h-40 border rounded-full overflow-hidden flex items-center justify-center mb-4">
          <img
            src={JobSearch}
            alt="Job Search"
            className="w-full h-full object-cover"
          />
        </div>
        <h4 className="text-lg font-semibold mb-2">On Registering, You can:</h4>
        <ul className="list-disc list-inside space-y-4">
          <li className="flex items-center text-sm md:text-xs">
            <span className="text-green-500 mr-2">✓</span>
            <span>Build your profile and let recruiters find you</span>
          </li>
          <li className="flex items-center text-sm md:text-xs">
            <span className="text-green-500 mr-2">✓</span>
            <span>Get job postings delivered right to your email</span>
          </li>
          <li className="flex items-center text-sm md:text-xs">
            <span className="text-green-500 mr-2">✓</span>
            <span>Find a job and grow your career</span>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-custom mt-[50px] md:mt-[100px] p-6 md:p-8 w-full md:w-1/3 max-h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <Label>Full Name</Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="John Doe"
              className="mt-1 w-full"
            />
          </div>
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="example@gmail.com"
              className="mt-1 w-full"
            />
          </div>
          <div className="mb-4">
            <Label>Phone Number</Label>
            <Input
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="8080808080"
              className="mt-1 w-full"
            />
          </div>
          <div className="mb-4">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter your password"
              className="mt-1 w-full"
            />
          </div>
          <div className="mb-4">
            <Label>Role</Label>
            <div className="flex flex-row">
              <div className="flex items-center mr-4">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  onChange={changeEventHandler}
                  className="mr-2"
                />
                <Label>Student</Label>
              </div>
              <div className="flex items-center">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  onChange={changeEventHandler}
                  className="mr-2"
                />
                <Label>Recruiter</Label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <Label>Profile Picture</Label>
            <div className="flex items-center">
              <label className="cursor-pointer">
                <Input
                  accept="image/*"
                  type="file"
                  onChange={changeFileHandler}
                  className="hidden"
                />
                <span className="mt-1 w-32 h-10 bg-blue-500 text-white flex items-center justify-center rounded-md cursor-pointer">
                  Choose File
                </span>
              </label>
              <div className="ml-2 w-12 h-12 border border-dashed border-gray-400 rounded-full flex items-center justify-center overflow-hidden">
                {input.file ? (
                  <img
                    src={URL.createObjectURL(input.file)}
                    alt="Uploaded Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FaCircleUser className="text-gray-400 w-10 h-10" />
                )}
              </div>
            </div>
          </div>
          {loading && <Loader />}

          <Button type="submit" className="w-full">
            Signup
          </Button>

          <div className="text-center mt-4">
            <span>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600">
                Login
              </Link>
            </span>
          </div>
          <p className="text-sm text-center items-center font-semibold mx-2">
            Or
          </p>
          <div className="text-center flex items-center justify-center mt-6">
            <Button className="flex items-center justify-center bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition px-4 py-2">
              <FaGoogle className="mr-2" />
              <span>Continue with Google</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
