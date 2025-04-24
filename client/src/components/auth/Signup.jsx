import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCircleUser, FaGoogle } from "react-icons/fa6";
import ReactHelmet from "@/components/shared/ReactHelmet";
import JobSearch from "@/assets/job_search.png";
import RegisterNavbar from "../shared/RegiserNavbar";
import Loader from "../shared/Loader";
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
    setAvatar(e.target.files[0]);
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
    console.log("formData", formData);
    dispatch(registerUser(formData))
      .then((res) => {
        setLoading(false);
        if (res?.payload?.status === 200) {
          toast.success("Signup successful! Please verify your email.", {
            onClose: () => {
              toast.info(
                "We've sent a verification link to your email. Please check your inbox and verify your email to complete the registration.",
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
          toast.error("Something went wrong! Please try again.");
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Signup failed! Please try again.");
      });
  };

  return (
    <div className='flex flex-col md:flex-row gap-1 items-start justify-center min-h-screen overflow-hidden px-4'>
      <RegisterNavbar />
      <ReactHelmet
        title='Signup - Next_Hire'
        description='Signup to access job opportunities and recruitments'
        canonicalUrl='http://mysite.com/signup'
      />
      <div className='bg-white rounded-lg shadow-custom mt-[50px] md:mt-[100px] p-6 md:p-8 w-full md:w-1/3 md:h-[400px] sticky top-[100px] mb-8 md:mb-0 flex flex-col items-center'>
        <div className='w-40 h-40 border rounded-full overflow-hidden flex items-center justify-center mb-4'>
          <img
            src={JobSearch}
            alt='Job Search'
            className='w-full h-full object-cover'
          />
        </div>
        <h4 className='text-lg font-semibold mb-2'>On Registering, You can:</h4>
        <ul className='list-disc list-inside space-y-4'>
          <li className='flex items-center text-sm md:text-xs'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>Build your profile and let recruiters find you</span>
          </li>
          <li className='flex items-center text-sm md:text-xs'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>Get job postings delivered right to your email</span>
          </li>
          <li className='flex items-center text-sm md:text-xs'>
            <span className='text-green-500 mr-2'>✓</span>
            <span>Find a job and grow your career</span>
          </li>
        </ul>
      </div>

      <div className='bg-white rounded-lg shadow-custom mt-[50px] md:mt-[100px] p-6 md:p-8 w-full md:w-1/3 max-h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar'>
        <h1 className='text-2xl font-bold text-center mt-2'>Sign Up</h1>
        {/* <div className="text-center flex items-center justify-center mt-2">
          <Button
            className="bg-red-600 text-white flex items-center mr-2"
            onClick={handleGoogleSignup}
            disabled={loading} // Disable button while loading
          >
            <FaGoogle className="mr-2" />
            Continue with Google
          </Button>
        </div> */}
        {/* <div className="text-center my-2">
          <span className="text-gray-500">or</span>
        </div> */}
        <form onSubmit={submitHandler}>
          <div className='mb-4'>
            <Label>Full Name</Label>
            <Input
              type='text'
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder='John Doe'
              className='mt-1 w-full'
              required
            />
          </div>
          <div className='mb-4'>
            <Label>Email</Label>
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='example@gmail.com'
              className='mt-1 w-full'
              required
            />
          </div>
          <div className='mb-4'>
            <Label>Phone Number</Label>
            <Input
              type='text'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder='8080808080'
              className='mt-1 w-full'
              required
            />
          </div>
          <div className='mb-4'>
            <Label>Password</Label>
            <Input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              className='mt-1 w-full'
              required
            />
          </div>
          <div className='mb-4'>
            <Label>Role</Label>
            <div className='flex flex-row'>
              <div className='flex items-center mr-4'>
                <Input
                  type='radio'
                  name='role'
                  value='student'
                  onChange={(e) => setRole(e.target.value)}
                  className='mr-2'
                  required
                />
                <Label>Student</Label>
              </div>
              <div className='flex items-center'>
                <Input
                  type='radio'
                  name='role'
                  value='recruiter'
                  onChange={(e) => setRole(e.target.value)}
                  className='mr-2'
                  required
                />
                <Label>Recruiter</Label>
              </div>
            </div>
          </div>
          <div className='mb-4'>
            <Label>Profile Picture</Label>
            <div className='flex items-center'>
              <label className='cursor-pointer'>
                <Input
                  accept='image/*'
                  type='file'
                  onChange={changeFileHandler}
                  className='hidden'
                />
                <span className='mt-1 w-32 h-10 bg-blue-500 text-white flex items-center justify-center rounded-md cursor-pointer'>
                  Choose File
                </span>
              </label>
              <div className='ml-2 w-12 h-12 border border-dashed border-gray-400 rounded-full flex items-center justify-center overflow-hidden'>
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
          <Button type='submit' className='w-full' disabled={loading}>
            Signup
          </Button>

          <div className='text-center mt-4'>
            <span>
              Already have an account?{" "}
              <Link to='/login' className='text-blue-600'>
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
