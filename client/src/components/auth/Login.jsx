import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactHelmet from "@/components/shared/ReactHelmet";
import Loader from "../shared/Loader";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { loginUser } from "@/redux/slices/user.slice";

// Email validation regex pattern
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Basic form validation
  const validateForm = () => {
    if (!email || !password || !role) {
      toast.error("Please fill in all fields.");
      return false;
    }
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = { email, password, role };

    setLoading(true);

    dispatch(loginUser(formData))
      .then((res) => {
        setLoading(false);
        if (res?.payload?.status === 200) {
          if (res?.payload?.user?.isVerified === false) {
            toast.info("Email is not verified, Please verify your email!");
          } else {
            toast.success("Login successful!");
            navigate("/");
          }
        } else {
          setErrorMessage(res?.payload?.message);
          toast.error(res?.payload?.message || "Something went wrong");
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Login failed! Please try again.");
      });
  };


  return (
    <div className="flex flex-col md:flex-row gap-1 items-start justify-center min-h-screen overflow-hidden px-4">
      <Navbar />
      <ReactHelmet
        title="Login - Next_Hire"
        description="Login to access job opportunities and recruitments"
        canonicalUrl="http://mysite.com/login"
      />

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

      <div className="bg-white rounded-lg shadow-custom mt-[50px] md:mt-[100px] p-6 md:p-8 w-full md:w-1/3 max-h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar">
        <h1 className="text-2xl font-bold text-center mt-2">Login</h1>

        {/* <div className="text-center flex items-center justify-center mt-2">
          <Button
            className="bg-red-600 text-white flex items-center mr-2"
            onClick={handleGoogleSignup}
          >
            <FaGoogle className="mr-2" />
            Continue with Google
          </Button>
        </div> */}

        {/* <div className="text-center my-2">
          <span className="text-gray-500">or</span>
        </div> */}

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patel@gmail.com"
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                checked={role === "student"}
                onChange={(e) => setRole(e.target.value)}
                className="mr-2"
              />
              <Label>Student</Label>
            </div>
            <div className="flex items-center mt-2 md:mt-0">
              <Input
                type="radio"
                name="role"
                value="recruiter"
                checked={role === "recruiter"}
                onChange={(e) => setRole(e.target.value)}
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
              {errorMessage === "Incorrect Password" && (
                <span className="font-semibold text-sm">
                  Forgot your password?{" "}
                  <Link to="/forgot-password" className="text-blue-600">
                    Reset here
                  </Link>
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
