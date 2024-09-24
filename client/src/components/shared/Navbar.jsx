import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="bg-white shadow-md w-full fixed top-0 left-0 z-50">
      <div className="bg-white w-11/12 m-auto">
        <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 lg:px-0">
          <h1 className="text-2xl font-bold text-gray-800">
            <a href="/">
              {" "}
              Next<span className="text-[#F83002]">Hire</span>
            </a>
          </h1>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-2xl text-gray-800">
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className={`hidden md:flex items-center gap-12`}>
            <ul className="flex items-center gap-8 font-medium text-gray-600">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/jobs">Jobs</Link>
              </li>
              <li>
                <Link to="/browse">Browse</Link>
              </li>
            </ul>

            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="text-gray-800 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white transition-colors">
                  Signup
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Slide out) */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-md border-t border-gray-200">
            <ul className="flex flex-col items-center gap-4 p-4">
              <li>
                <Link
                  to="/"
                  onClick={toggleMenu}
                  className="text-gray-800 hover:text-[#F83002]"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  onClick={toggleMenu}
                  className="text-gray-800 hover:text-[#F83002]"
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/browse"
                  onClick={toggleMenu}
                  className="text-gray-800 hover:text-[#F83002]"
                >
                  Browse
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="text-gray-800 hover:text-[#F83002]"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  onClick={toggleMenu}
                  className="text-gray-800 hover:text-[#F83002]"
                >
                  Signup
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
