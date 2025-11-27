import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCircleUser, FaGoogle } from "react-icons/fa6";
import ReactHelmet from "@/components/common/ReactHelmet";
import JobSearch from "@/assets/job_search.png";
import RegisterNavbar from "../layout/RegiserNavbar";
import Loader from "../common/Loader";
import { registerUser } from "@/redux/slices/user.slice";

const Signup = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle profile picture change
  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setAvatar(file);
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  // Form validation function
  const validateForm = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
    const phonePattern = /^[0-9]{10}$/; // Simple phone validation for 10 digits

    if (!fullname || !email || !phoneNumber || !password || !role) {
      toast.error("Please fill in all fields.");
      return false;
    }

    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!phonePattern.test(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  // Handle form submission
  const submitHandler = (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Validate before submission

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("avatar", avatar);

    setLoading(true);

    dispatch(registerUser(formData))
      .then((res) => {
        setLoading(false);
        if (res?.payload?.status === 200) {
          toast.success("Signup successful! Please verify your email.", {
            onClose: () => {
              toast.info(
                "We've sent a verification link to your email. Please check your inbox and spam folder to verify your email to complete the registration.",
                {
                  autoClose: 30000,
                  onClose: () => {
                    setFullname("");
                    setEmail("");
                    setPhoneNumber("");
                    setPassword("");
                    setRole("");
                    setAvatar(null);
                  },
                }
              );
            },
          });
        } else {
          toast.error(res?.payload?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Signup failed! Please try again.");
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

      <RegisterNavbar />
      <ReactHelmet
        title='Signup - Next_Hire'
        description='Signup to access job opportunities and recruitments'
        canonicalUrl='http://mysite.com/signup'
      />

      <div className='container mx-auto px-4 py-12 md:py-20 relative z-10'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Side - Benefits Card */}
          <div className='bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-gray-200/60 shadow-xl p-8 lg:sticky lg:top-24 h-fit'>
            <div className='text-center mb-6'>
              <div className='w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-[#6A38C2]/20 shadow-lg'>
                <img
                  src={JobSearch}
                  alt='Job Search'
                  className='w-full h-full object-cover'
                />
              </div>
              <h4 className='text-2xl md:text-3xl font-extrabold mb-2'>
                <span className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                  Start Your{" "}
                </span>
                <span className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent'>
                  Journey
                </span>
              </h4>
              <p className='text-gray-600'>Join NextHire and unlock amazing opportunities</p>
            </div>

            <ul className='space-y-4 mb-6'>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-[#6A38C2]/5 to-[#F83002]/5 border border-[#6A38C2]/10'>
                <span className='text-[#6A38C2] text-xl font-bold mt-0.5'>✓</span>
                <span className='text-gray-700 font-medium'>Build your profile and let recruiters find you</span>
              </li>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-[#6A38C2]/5 to-[#F83002]/5 border border-[#6A38C2]/10'>
                <span className='text-[#6A38C2] text-xl font-bold mt-0.5'>✓</span>
                <span className='text-gray-700 font-medium'>Get job postings delivered right to your email</span>
              </li>
              <li className='flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-[#6A38C2]/5 to-[#F83002]/5 border border-[#6A38C2]/10'>
                <span className='text-[#6A38C2] text-xl font-bold mt-0.5'>✓</span>
                <span className='text-gray-700 font-medium'>Find a job and grow your career</span>
              </li>
            </ul>
          </div>

          {/* Right Side - Signup Form */}
          <div className='bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-gray-200/60 shadow-xl p-8 md:p-10'>
            <div className='text-center mb-8'>
              <h1 className='text-4xl md:text-5xl font-extrabold mb-3'>
                <span className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                  Create{" "}
                </span>
                <span className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent'>
                  Account
                </span>
              </h1>
              <p className='text-gray-600 text-lg'>Sign up to get started with NextHire</p>
            </div>

            <form onSubmit={submitHandler} className='space-y-5'>
              <div>
                <Label className='text-base font-bold text-gray-900 mb-2 block'>Full Name</Label>
                <Input
                  type='text'
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder='John Doe'
                  className='w-full rounded-xl border-2 border-gray-200/60 p-4 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 bg-white/80 backdrop-blur-sm text-base'
                  required
                />
              </div>

              <div>
                <Label className='text-base font-bold text-gray-900 mb-2 block'>Email</Label>
                <Input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='example@gmail.com'
                  className='w-full rounded-xl border-2 border-gray-200/60 p-4 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 bg-white/80 backdrop-blur-sm text-base'
                  required
                />
              </div>

              <div>
                <Label className='text-base font-bold text-gray-900 mb-2 block'>Phone Number</Label>
                <Input
                  type='text'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder='8080808080'
                  className='w-full rounded-xl border-2 border-gray-200/60 p-4 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 bg-white/80 backdrop-blur-sm text-base'
                  required
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
                  required
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
                      onChange={(e) => setRole(e.target.value)}
                      className='w-5 h-5 text-[#6A38C2] border-gray-300 focus:ring-[#6A38C2] focus:ring-2 cursor-pointer'
                      required
                    />
                    <span className='text-gray-700 font-semibold group-hover:text-[#6A38C2] transition-colors'>Student</span>
                  </label>
                  <label className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      type='radio'
                      name='role'
                      value='recruiter'
                      onChange={(e) => setRole(e.target.value)}
                      className='w-5 h-5 text-[#6A38C2] border-gray-300 focus:ring-[#6A38C2] focus:ring-2 cursor-pointer'
                      required
                    />
                    <span className='text-gray-700 font-semibold group-hover:text-[#6A38C2] transition-colors'>Recruiter</span>
                  </label>
                </div>
              </div>

              <div>
                <Label className='text-base font-bold text-gray-900 mb-2 block'>Profile Picture</Label>
                <div className='flex items-center gap-4'>
                  <label className='cursor-pointer'>
                    <Input
                      accept='image/*'
                      type='file'
                      onChange={changeFileHandler}
                      className='hidden'
                    />
                    <span className='px-6 py-3 bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white font-semibold rounded-xl cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-block'>
                      Choose File
                    </span>
                  </label>
                  <div className='w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center overflow-hidden bg-gray-50 group-hover:border-[#6A38C2] transition-colors'>
                    {avatar ? (
                      <img
                        src={URL.createObjectURL(avatar)}
                        alt='Uploaded Profile'
                        className='w-full h-full object-cover rounded-full'
                      />
                    ) : (
                      <FaCircleUser className='text-gray-400 w-10 h-10' />
                    )}
                  </div>
                </div>
              </div>

              {loading && <Loader />}

              <Button 
                type='submit' 
                className='w-full bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg'
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>

              <div className='text-center'>
                <p className='text-gray-600'>
                  Already have an account?{" "}
                  <Link to='/login' className='text-[#6A38C2] hover:text-[#F83002] font-bold transition-colors'>
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
