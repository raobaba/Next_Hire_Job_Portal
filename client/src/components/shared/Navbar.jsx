import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FiMenu, FiX } from "react-icons/fi";
import ReactHelmet from "./ReactHelmet";
import { toast } from "react-toastify";
import { RiMenu2Fill } from "react-icons/ri";
import NextHireLogo from "@/assets/NextHireLogo.png";
import { getProfilePic, getToken } from "@/utils/constant";
import { FaUser, FaCog, FaShieldAlt, FaSignOutAlt } from "react-icons/fa";
import { logoutUser } from "@/redux/slices/user.slice";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const token = getToken(); // Example token, replace with your authentication logic.
  const profilePic = getProfilePic();
  const navigate = useNavigate(); // Use useNavigate to redirect

  const toggleDropdown = () => {
    setIsDropDownOpen((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropDownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  const handleLogOut = () => {
    setIsLoading(true); // Set loading state to true
    dispatch(logoutUser()) // Call the action creator
      .then((res) => {
        console.log(res);
        if (res?.payload?.status === 200) {
          localStorage.removeItem("token"); // Clear the token
          localStorage.removeItem("profile"); // Clear the profile
          toast.success("Successfully logged out!"); // Success toast
          navigate("/login"); // Redirect to login page
        } else {
          toast.error(
            "Logout failed: " + (res?.payload?.message || "Unknown error")
          ); // Error toast
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        toast.error("Error during logout: " + error.message); // Error toast
      })
      .finally(() => {
        setIsLoading(false); // Reset loading state
      });
  };

  return (
    <div className="bg-white shadow-md w-full fixed top-0 left-0 z-50">
      <ReactHelmet
        title="Home - Next_Hire"
        description="Welcome to Next_Hire – your one-stop platform to discover new job opportunities and connect with top employers."
        canonicalUrl="http://mysite.com/home"
      />
      <div className="bg-white w-11/12 m-auto">
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
                <Link to="/browse-jobs">BrowseJobs</Link>
              </li>
            </ul>
            {token ? (
              <div className="relative inline-block" ref={dropdownRef}>
                <div
                  className="py-1 flex items-center px-2 border rounded-2xl cursor-pointer hover:bg-gray-200"
                  onClick={toggleDropdown}
                >
                  <span>
                    <RiMenu2Fill />
                  </span>
                  <div className="w-6 h-6 bg-gray-300 rounded-full overflow-hidden ml-3">
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Dropdown Menu */}
                {isDropDownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                    <ul className="py-2">
                      <li className="flex items-center w-11/12 m-auto rounded-xl px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <Link
                          to="/profile"
                          className="flex items-center w-full"
                        >
                          <FaUser className="mr-2" /> Profile
                        </Link>
                      </li>
                      <li className="flex items-center w-11/12 m-auto rounded-xl px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <Link
                          to="/settings"
                          className="flex items-center w-full"
                        >
                          <FaCog className="mr-2" /> Settings
                        </Link>
                      </li>
                      <li className="flex items-center w-11/12 m-auto rounded-xl px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <Link
                          to="/privacy"
                          className="flex items-center w-full"
                        >
                          <FaShieldAlt className="mr-2" /> Privacy
                        </Link>
                      </li>
                      <li
                        onClick={handleLogOut}
                        className="flex items-center w-11/12 m-auto rounded-xl px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <Link className="flex items-center w-full">
                          <FaSignOutAlt className="mr-2" /> Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
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
            )}
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
                  to="/notifications"
                  onClick={toggleMenu}
                  className="text-gray-800 hover:text-[#F83002]"
                >
                  Notifications
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
