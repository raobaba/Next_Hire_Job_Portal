import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { FaCircleUser } from "react-icons/fa6";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <Navbar />
      <div className="bg-white rounded-lg shadow-lg mt-[100px] p-5 w-1/3">
        <h1 className="text-2xl font-bold mb-1 text-center">Sign Up</h1>
        <form onSubmit={submitHandler} className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="example@gmail.com"
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <Label>Phone Number</Label>
              <Input
                type="text"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                placeholder="8080808080"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Enter your password"
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <Label>Role</Label>
              <RadioGroup className="flex flex-row">
                <div className="flex items-center">
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
              </RadioGroup>
            </div>
            <div>
              <div className="mb-1">
                <Label>Profile Picture</Label>
                <div className="flex flex-row items-center">
                  <label className="cursor-pointer">
                    <Input
                      accept="image/*"
                      type="file"
                      onChange={changeFileHandler}
                      className="hidden" // Hide the default file input
                    />
                    <span className="mt-1 w-32 h-10 bg-blue-500 text-white flex items-center justify-center rounded-md cursor-pointer">
                      Choose File
                    </span>
                  </label>
                  <div className="mt-1 ml-2 border border-dashed border-gray-400 w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                    {input.file ? (
                      <img
                        src={URL.createObjectURL(input.file)} // Create a URL for the uploaded file
                        alt="Uploaded Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FaCircleUser className="text-gray-400 w-10 h-10" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {loading ? (
            <Button className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Signup
            </Button>
          )}
          <div className="text-center mt-0">
            <span>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600">
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
