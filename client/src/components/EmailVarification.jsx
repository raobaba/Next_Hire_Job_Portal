import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyEmail as verifyEmailAction } from "@/redux/slices/user.slice";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";

const EmailVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [called, setCalled] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!called) {
      handleEmailVerification();
      setCalled(true);
    }
  }, [dispatch, location, called]);

  const handleEmailVerification = () => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    const payload = {
      token,
      pathname: location.pathname,
    };

    dispatch(verifyEmailAction(payload))
      .then((res) => {
        if (res?.payload?.status === 200) {
          setIsVerified(true);
          toast.success("Your email has been verified successfully!");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          toast.error(res?.payload?.message);
        }
      })
      .catch(() => {
        toast.error("Email verification failed. Please try again.");
      });
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='bg-white p-6 rounded-lg shadow-md max-w-sm text-center'>
        {isVerified ? (
          <div className='flex flex-col items-center justify-center'>
            <FaCheckCircle className='text-green-500' size={60} />{" "}
            <h2 className='text-lg font-semibold text-gray-800 mt-4'>
              Email Verified!
            </h2>
            <p className='text-gray-600 mt-2'>Redirecting to login...</p>
          </div>
        ) : (
          <h2 className='text-lg font-semibold text-gray-800'>Verifying...</h2>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
