import React from "react";
import { Link } from "react-router-dom";
import NextHireLogo from "@/assets/NextHireLogo.png";

const RegisterNavbar = () => {
  return (
    <div className="bg-white shadow-md w-full fixed top-0 left-0 z-50">
      <div className="w-11/12 m-auto">
        <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 lg:px-0">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={NextHireLogo}
                alt="NextHire Logo"
                className="h-8 mr-2"
              />
              <span>
                Next<span className="text-[#F83002]">Hire</span>
              </span>
            </Link>
          </h1>
          <div className="hidden md:flex items-center gap-6">
            <p className="text-gray-600">
              Already registered?{" "}
              <Link
                to="/login"
                className="text-[#F83002] font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterNavbar;
