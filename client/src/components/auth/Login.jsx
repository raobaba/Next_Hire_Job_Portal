import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ReactHelmet from "@/components/shared/ReactHelmet";
import Loader from "../shared/Loader";
import { FaGoogle } from "react-icons/fa6";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "@/services/firebase";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {};
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const handleGoogleSignup = async (e) => {
    e.preventDefault();
    console.log("Authenticaiton Initiated");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = GoogleAuthProvider.credentialFromResult(result).accessToken;
      console.log("User Info: ", user);
      console.log("Access Token: ", token);
      navigate("/");
    } catch (error) {
      console.log(error.code);
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-1 items-start justify-center min-h-screen overflow-hidden px-4">
      <Navbar />
      <ReactHelmet
        title="Login - Next_Hire"
        description="Login to access job opportunities and recruitments"
        canonicalUrl="http://mysite.com/login"
      />

      {/* Static box with job-related text and green check marks */}
      <div className="bg-white rounded-lg shadow-custom mt-[50px] md:mt-[100px] p-6 md:p-8 w-full md:w-1/3 md:h-[400px] sticky top-[100px] mb-8 md:mb-0">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          New to <span className="text-black">Next</span>
          <span className="text-red-800">Hire</span>?
        </h2>
        <ul className="space-y-4">
          <li className="flex items-center text-sm md:text-xs">
            <span className="text-green-500 text-sm font-thin mr-2">✓</span> One
            click apply using Next profile.
          </li>
          <li className="flex items-center text-sm md:text-xs">
            <span className="text-green-500 mr-2">✓</span> Get relevant job
            recommendations.
          </li>
          <li className="flex items-center text-sm md:text-xs">
            <span className="text-green-500 mr-2">✓</span> Showcase profile to
            top companies and consultants.
          </li>
          <li className="flex items-center text-sm md:text-xs">
            <span className="text-green-500 mr-2">✓</span> Know application
            status on applied jobs.
          </li>
        </ul>
        <button className="border py-2 px-7 mt-3 rounded-lg text-green-500 font-semibold my border-green-500 m-2">
          <Link to={"/signup"}>Register for Free</Link>
        </button>
        <div className="w-full h-20 md:h-32 relative">
          <img
            src="https://static.naukimg.com/s/5/105/i/register.png"
            className="h-full absolute right-0"
            alt="Register"
          />
        </div>
      </div>

      {/* Scrollable login form with hidden scrollbar */}
      <div className="bg-white rounded-lg shadow-custom mt-[50px] md:mt-[100px] p-6 md:p-8 w-full md:w-1/3 max-h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              placeholder="patel@gmail.com"
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              placeholder="Your password"
              className="mt-1"
            />
          </div>
          <div className="flex flex-row md:flex-row justify-between mb-4">
            <div className="flex items-center">
              <Input
                type="radio"
                name="role"
                value="student"
                className="mr-2"
              />
              <Label>Student</Label>
            </div>
            <div className="flex items-center mt-2 md:mt-0">
              <Input
                type="radio"
                name="role"
                value="recruiter"
                className="mr-2"
              />
              <Label>Recruiter</Label>
            </div>
          </div>
          {loading && <Loader />}
          <Button type="submit" className="w-full">
            Login
          </Button>

          <div className="text-center mt-4">
            <span>
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600">
                Signup
              </Link>
            </span>
            <div className="mt-2">
              <span className="font-semibold text-sm">
                Forgot your password?{" "}
                <Link to="/forgot-password" className="text-blue-600">
                  Reset here
                </Link>
              </span>
            </div>
          </div>
          <p className="text-sm text-center items-center font-semibold mx-2">
            Or
          </p>
          <div className="text-center flex items-center justify-center mt-6">
            <Button
              type="button"
              onClick={handleGoogleSignup}
              className="flex items-center justify-center bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition px-4 py-2"
            >
              <FaGoogle className="mr-2" />
              <span>Continue with Google</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
