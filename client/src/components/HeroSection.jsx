import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAllJobs } from "@/redux/slices/job.slice";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useState({
    title: "",
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (query.trim()) {
        setSearchParams((prev) => ({ ...prev, title: query }));
        const res = await dispatch(getAllJobs(searchParams));

        if (res?.payload?.status === 200) {
          setSearchResults(res.payload.jobs);
        } else {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceFetch = setTimeout(fetchJobs, 300);
    return () => clearTimeout(debounceFetch);
  }, [query, dispatch, searchParams]);

  const searchJobHandler = (jobId) => {
    navigate(`/description/${jobId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setDropdownVisible(e.target.value.trim() !== "");
  };

  const handleDropdownClick = () => {
    if (query.trim()) {
      setDropdownVisible(true);
    }
  };

  return (
    <div className="text-center mt-[80px]">
      <div className="flex flex-col gap-5 my-5">
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium">
          Your Gateway to Opportunities
        </span>
        <h1 className="text-5xl font-bold">
          Discover, Apply & <br /> Land Your{" "}
          <span className="text-[#6A38C2]">Perfect Job</span>
        </h1>
        <p>
          Explore thousands of job listings across various industries. Take the
          next step towards your career success!
        </p>
        <div className="relative flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
          <input
            type="text"
            placeholder="Search for jobs"
            value={query}
            onChange={handleInputChange}
            onClick={handleDropdownClick}
            className="outline-none border-none w-full"
          />
          <Button
            onClick={() => searchJobHandler(query)}
            className="rounded-r-full bg-[#6A38C2]"
          >
            <Search className="h-5 w-5" />
          </Button>
          {dropdownVisible && searchResults.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md z-10"
            >
              {searchResults.map((job) => (
                <div
                  key={job.id}
                  onClick={() => searchJobHandler(job._id)}
                  className="cursor-pointer hover:bg-[#6A38C2] hover:text-white transition duration-200 p-2"
                >
                  {job.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
