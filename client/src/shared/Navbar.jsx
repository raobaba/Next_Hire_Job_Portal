import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white w-11/12 m-auto ">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 lg:px-0">
        <div>
          <h1 className="text-2xl font-bold">
            Next<span className="text-[#F83002]">Hire</span>
          </h1>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-2xl">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div
          className={`md:flex items-center gap-12 ${
            isOpen ? "block" : "hidden"
          } md:block`}
        >
          <ul className="flex flex-col md:flex-row font-medium items-center gap-5">
            <>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/jobs">Jobs</Link>
              </li>
              <li>
                <Link to="/browse">Browse</Link>
              </li>
            </>
          </ul>

          <div className="flex flex-col md:flex-row items-center gap-2 mt-4 md:mt-0">
            <Link to="/login">
              <Button variant="outline" className="w-full md:w-auto">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] w-full md:w-auto">
                Signup
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Slide out) */}
      {isOpen && (
        <div className="md:hidden">
          <ul className="flex flex-col items-center gap-4 p-4">
            <li>
              <Link to="/" onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/jobs" onClick={toggleMenu}>
                Jobs
              </Link>
            </li>
            <li>
              <Link to="/browse" onClick={toggleMenu}>
                Browse
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={toggleMenu}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" onClick={toggleMenu}>
                Signup
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
