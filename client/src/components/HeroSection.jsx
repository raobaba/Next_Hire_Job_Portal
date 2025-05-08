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
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useState({
    title: "",
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!query.trim()) {
        setSearchResults([]); // Clear search results when query is empty
        return;
      }

      setLoading(true);
      setSearchParams((prev) => ({ ...prev, title: query }));

      try {
        const res = await dispatch(getAllJobs(searchParams));

        if (res?.payload?.status === 200) {
          setSearchResults(res.payload.jobs);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setSearchResults([]);
      } finally {
        setLoading(false); // Stop loading after API call finishes
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
    <div className='text-center mt-[80px]'>
      <div className='flex flex-col gap-5 my-5'>
        <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>
          Your Gateway to Opportunities
        </span>
        <h1 className='text-5xl font-bold'>
          Discover, Apply & <br /> Land Your{" "}
          <span className='text-[#6A38C2]'>Perfect Job</span>
        </h1>
        <p>
          Explore thousands of job listings across various industries. Take the
          next step towards your career success!
        </p>
        <div className='relative flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
          <input
            type='text'
            placeholder='Search for jobs'
            value={query}
            onChange={handleInputChange}
            onClick={handleDropdownClick}
            className='outline-none border-none w-full'
            aria-label='Job search input'
          />
          <Button
            onClick={() => searchJobHandler(query)}
            className='rounded-r-full bg-[#6A38C2]'
            aria-label='Search button'
          >
            <Search className='h-5 w-5' />
          </Button>
          {loading && (
            <div className='absolute top-full left-0 right-0 bg-white shadow-lg rounded-md z-20 p-2 text-center'>
              Loading...
            </div>
          )}
          {dropdownVisible && searchResults.length > 0 && !loading && (
            <div
              ref={dropdownRef}
              className='absolute top-full left-0 right-0 max-h-60 overflow-y-auto bg-white shadow-lg rounded-md z-20'
            >
              {searchResults?.map((job) => (
                <div
                  key={job._id}
                  onClick={() => searchJobHandler(job._id)}
                  className='cursor-pointer hover:bg-[#6A38C2] hover:text-white transition duration-200 p-2'
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
