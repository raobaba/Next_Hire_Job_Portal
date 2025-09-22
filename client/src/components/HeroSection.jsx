import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { SearchSkeleton } from "./ui/skeleton";
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
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!query.trim()) {
        setSearchResults([]); // Clear search results when query is empty
        return;
      }

      setLoading(true);
      const currentSearchParams = { title: query };

      try {
        const res = await dispatch(getAllJobs(currentSearchParams));

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

    const debounceFetch = setTimeout(fetchJobs, 500);
    return () => clearTimeout(debounceFetch);
  }, [query, dispatch]);

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
    <div className='text-center mt-[80px] relative overflow-visible'>
      {/* Background decoration */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-[#6A38C2]/5 rounded-full blur-3xl'></div>
        <div className='absolute top-40 right-10 w-96 h-96 bg-[#F83002]/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-[#6A38C2]/3 rounded-full blur-3xl'></div>
      </div>
      
      <div className='flex flex-col gap-8 my-8 relative z-10'>
        <span className='mx-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#F83002]/10 to-[#6A38C2]/10 text-[#F83002] font-semibold text-sm border border-[#F83002]/20 shadow-sm animate-pulse'>
          ✨ Your Gateway to Opportunities
        </span>
        <h1 className='text-4xl md:text-5xl font-bold leading-tight'>
          <span className='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent'>
            Discover, Apply & <br />
          </span>
          <span className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent'>
            Land Your Perfect Job
          </span>
        </h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
          Explore thousands of job listings across various industries. Take the
          next step towards your career success with our intelligent job matching platform!
        </p>
        <div className='relative flex w-full max-w-2xl shadow-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm pl-6 pr-2 rounded-full items-center gap-4 mx-auto hover:shadow-3xl transition-all duration-300'>
          <Search className='h-5 w-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search for jobs, companies, or skills...'
            value={query}
            onChange={handleInputChange}
            onClick={handleDropdownClick}
            className='outline-none border-none w-full bg-transparent text-gray-700 placeholder-gray-400 text-lg py-4'
            aria-label='Job search input'
          />
          <Button
            onClick={() => searchJobHandler(query)}
            className='rounded-full bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
            aria-label='Search button'
          >
            <Search className='h-5 w-5 mr-2' />
            Search
          </Button>
          {loading && <SearchSkeleton />}
        </div>
        
        {/* Search Dropdown - Positioned outside the search container */}
        {dropdownVisible && searchResults.length > 0 && !loading && (
          <div
            ref={dropdownRef}
            className='absolute top-full left-1/2 transform -translate-x-1/2 w-full max-w-2xl max-h-60 overflow-y-auto bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl z-[9999] border border-gray-200/50 mt-4'
          >
            {searchResults?.map((job, index) => (
              <div
                key={job._id}
                onClick={() => searchJobHandler(job._id)}
                className='cursor-pointer hover:bg-gradient-to-r hover:from-[#6A38C2]/10 hover:to-[#F83002]/10 hover:text-[#6A38C2] transition-all duration-200 p-4 border-b border-gray-100 last:border-b-0 group'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-2 h-2 bg-[#6A38C2] rounded-full group-hover:bg-[#F83002] transition-colors duration-200'></div>
                  <span className='font-medium'>{job.title}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
