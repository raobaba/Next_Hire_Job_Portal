import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../layout/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactHelmet from "@/components/common/ReactHelmet";
import Loader from "../common/Loader";
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
        const status = res?.payload?.status;
        if (status === 200) {
          toast.success("Login successful!");
          navigate("/");
        } else {
          setErrorMessage(res?.payload?.message || "Something went wrong");
          toast.error(res?.payload?.message || "Something went wrong");
        }
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error?.response?.data?.message || error?.message || "Login failed! Please try again.";
        setErrorMessage(errorMessage);
        
        // Check if it's an email verification error
        if (error?.response?.status === 403 || errorMessage.includes("verify your email")) {
          toast.error(errorMessage, {
            autoClose: 5000,
          });
        } else {
          toast.error(errorMessage);
        }
      });
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-[#6A38C2]/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-[#F83002]/5 rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6A38C2]/3 rounded-full blur-3xl'></div>
      </div>

      <Navbar />
      <ReactHelmet
        title='Login - Next_Hire'
        description='Login to access job opportunities and recruitments'
        canonicalUrl='/login'
      />

      <div className='container mx-auto px-4 py-12 md:py-20 relative z-10'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Side - Benefits Card */}
          <div className='bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-gray-200/60 shadow-xl p-8 lg:sticky lg:top-24 h-fit'>
            <div className='text-center mb-6'>
              <h2 className='text-3xl md:text-4xl font-extrabold mb-2'>
                <span className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                  New to{" "}
                </span>
                <span className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent'>
                  NextHire
                </span>
                <span className='text-4xl'>?</span>
              </h2>
              <p className='text-gray-600 mt-2'>Join thousands of job seekers and recruiters</p>
            </div>

            <ul className='space-y-4 mb-8'>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-[#6A38C2]/5 to-[#F83002]/5 border border-[#6A38C2]/10'>
                <span className='text-[#6A38C2] text-xl font-bold mt-0.5'>✓</span>
                <span className='text-gray-700 font-medium'>One click apply using NextHire profile</span>
              </li>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-[#6A38C2]/5 to-[#F83002]/5 border border-[#6A38C2]/10'>
                <span className='text-[#6A38C2] text-xl font-bold mt-0.5'>✓</span>
                <span className='text-gray-700 font-medium'>Get relevant job recommendations</span>
              </li>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-[#6A38C2]/5 to-[#F83002]/5 border border-[#6A38C2]/10'>
                <span className='text-[#6A38C2] text-xl font-bold mt-0.5'>✓</span>
                <span className='text-gray-700 font-medium'>Showcase profile to top companies</span>
              </li>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-[#6A38C2]/5 to-[#F83002]/5 border border-[#6A38C2]/10'>
                <span className='text-[#6A38C2] text-xl font-bold mt-0.5'>✓</span>
                <span className='text-gray-700 font-medium'>Track application status in real-time</span>
              </li>
            </ul>

            <Link to='/signup'>
              <Button className='w-full bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg'>
                Register for Free
              </Button>
            </Link>

            <div className='mt-6 w-full h-32 relative rounded-xl overflow-hidden'>
              <img
                src='https://static.naukimg.com/s/5/105/i/register.png'
                className='h-full w-full object-contain'
                alt='Register'
              />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className='bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-gray-200/60 shadow-xl p-8 md:p-10'>
            <div className='text-center mb-8'>
              <h1 className='text-4xl md:text-5xl font-extrabold mb-3'>
                <span className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                  Welcome{" "}
                </span>
                <span className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent'>
                  Back
                </span>
              </h1>
              <p className='text-gray-600 text-lg'>Sign in to continue your job search journey</p>
            </div>

            <form onSubmit={submitHandler} className='space-y-6'>
              <div>
                <Label className='text-base font-bold text-gray-900 mb-2 block'>Email</Label>
                <Input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  className='w-full rounded-xl border-2 border-gray-200/60 p-4 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 bg-white/80 backdrop-blur-sm text-base'
                />
              </div>

              <div>
                <Label className='text-base font-bold text-gray-900 mb-2 block'>Password</Label>
                <Input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your password'
                  className='w-full rounded-xl border-2 border-gray-200/60 p-4 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 bg-white/80 backdrop-blur-sm text-base'
                />
              </div>

              <div className='bg-gray-50/80 rounded-xl p-4 border border-gray-200/60'>
                <Label className='text-base font-bold text-gray-900 mb-3 block'>I am a</Label>
                <div className='flex gap-6'>
                  <label className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      type='radio'
                      name='role'
                      value='student'
                      checked={role === "student"}
                      onChange={(e) => setRole(e.target.value)}
                      className='w-5 h-5 text-[#6A38C2] border-gray-300 focus:ring-[#6A38C2] focus:ring-2 cursor-pointer'
                    />
                    <span className='text-gray-700 font-semibold group-hover:text-[#6A38C2] transition-colors'>Student</span>
                  </label>
                  <label className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      type='radio'
                      name='role'
                      value='recruiter'
                      checked={role === "recruiter"}
                      onChange={(e) => setRole(e.target.value)}
                      className='w-5 h-5 text-[#6A38C2] border-gray-300 focus:ring-[#6A38C2] focus:ring-2 cursor-pointer'
                    />
                    <span className='text-gray-700 font-semibold group-hover:text-[#6A38C2] transition-colors'>Recruiter</span>
                  </label>
                </div>
              </div>

              {loading && <Loader />}

              <Button 
                type='submit' 
                className='w-full bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg'
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className='text-center space-y-3'>
                <p className='text-gray-600'>
                  Don't have an account?{" "}
                  <Link to='/signup' className='text-[#6A38C2] hover:text-[#F83002] font-bold transition-colors'>
                    Sign Up
                  </Link>
                </p>

                {errorMessage === "Incorrect Password" && (
                  <div className='mt-3'>
                    <p className='text-sm text-gray-600'>
                      Forgot your password?{" "}
                      <Link to='/forget-password' className='text-[#6A38C2] hover:text-[#F83002] font-semibold transition-colors'>
                        Reset here
                      </Link>
                    </p>
                  </div>
                )}
                {errorMessage && errorMessage.includes("verify your email") && (
                  <div className='mt-4 p-4 bg-yellow-50/80 backdrop-blur-sm border-2 border-yellow-200 rounded-xl'>
                    <p className='text-sm text-yellow-800 font-bold mb-2'>
                      📧 Email Verification Required
                    </p>
                    <p className='text-xs text-yellow-700'>
                      Please check your email inbox and click the verification link to activate your account. 
                      If you didn't receive the email, check your spam folder or try logging in again.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
