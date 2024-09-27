import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import RegisterNavbar from "../shared/RegiserNavbar";
import ReactHelmet from "../shared/ReactHelmet";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/reset-password", {
        email,
        password,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login"); // Redirect to login after successful reset
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <RegisterNavbar />
      <ReactHelmet
        title="Reset Password - Next_Hire"
        description="Reset your password for NextHire"
        canonicalUrl="http://mysite.com/reset-password"
      />
      <div className="bg-white rounded-lg shadow-custom mt-[50px] md:mt-[100px] p-6 md:p-8 w-full md:w-1/3">
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="mt-1 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <Label>New Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              className="mt-1 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="mt-1 w-full"
              required
            />
          </div>
          <div className="mt-6">
            {loading ? (
              <Button className="w-full" disabled>
                Please wait...
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            )}
          </div>
          <div className="text-center mt-4">
            <span>
              Remembered your password?{" "}
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

export default ResetPassword;
