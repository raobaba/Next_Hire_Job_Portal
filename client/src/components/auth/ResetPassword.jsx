import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "react-toastify";
import RegisterNavbar from "../layout/RegiserNavbar";
import ReactHelmet from "../common/ReactHelmet";
import {
  forgetPassPassword,
  resetPassPassword,
} from "@/redux/slices/user.slice";
import { useDispatch } from "react-redux";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      if (!email) {
        toast.error("Email is required!");
        setLoading(false);
        return;
      }

      try {
        const response = await dispatch(forgetPassPassword({ email }));
        if (response?.payload?.status == 200) {
          toast.success(response?.payload?.message);
          setEmail("");
        }
      } catch (error) {
        toast.error(error?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    } else {
      if (!password || !confirmPassword) {
        toast.error("Both password fields are required!");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        setLoading(false);
        return;
      }

      try {
        const response = await dispatch(resetPassPassword({ token, password })); // Dispatch reset password API call
        if (response?.payload?.message) {
          toast.success(response.payload.message); // Show success message from response
          navigate("/login"); // Redirect to login after success
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred"); // Handle errors
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4'>
      <RegisterNavbar />
      <ReactHelmet
        title='Reset Password - Next_Hire'
        description='Reset your password for NextHire'
        canonicalUrl='/reset-password'
      />
      <div className='bg-white rounded-lg shadow-custom mt-[50px] md:mt-[100px] p-6 md:p-8 w-full md:w-1/3'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Reset Password</h1>
        <form onSubmit={handleSubmit}>
          {/* For sending reset link */}
          {!token && (
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
          )}

          {/* For resetting password with token */}
          {token && (
            <>
              <div className='mb-4'>
                <Label>New Password</Label>
                <Input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your new password'
                  className='mt-1 w-full'
                  required
                />
              </div>
              <div className='mb-4'>
                <Label>Confirm Password</Label>
                <Input
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm your new password'
                  className='mt-1 w-full'
                  required
                />
              </div>
            </>
          )}

          <div className='mt-6'>
            <Button type='submit' className='w-full' disabled={loading}>
              {loading
                ? "Please wait..."
                : token
                ? "Reset Password"
                : "Send Reset Link"}
            </Button>
          </div>

          {/* Redirect to login page if token is not provided */}
          {!token && (
            <div className='text-center mt-4'>
              <span>
                Remembered your password?{" "}
                <Link to='/login' className='text-blue-600'>
                  Login
                </Link>
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
