import React, { useEffect, useState, useRef } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import ReactHelmet from "./shared/ReactHelmet";
import { getSearchResult, clearSearchHistory } from "@/redux/slices/user.slice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./shared/Loader";
import { toast } from "react-toastify";
import { getToken } from "@/utils/constant";

const BrowseJobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const currentPageRef = useRef(1);
  const totalPagesRef = useRef(null);

  console.log("searchResult", searchResult);

  // Check authentication status
  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
  }, [user]);

  const fetchSearchResult = async () => {
    if (!hasMore || loading) return;
  
    setLoading(true);
    setError(null);
  
    try {
      // Only fetch if user is authenticated
      if (isAuthenticated) {
        const res = await dispatch(
          getSearchResult({ page: currentPageRef.current, limit: 10 })
        ).unwrap();
    
        if (res?.status === 200) {
          const newJobs = res?.jobs || [];
          console.log("Fetched new jobs:", newJobs);
    
          // Remove duplicates based on job ID
          const combinedJobs = [...searchResult, ...newJobs];
          const uniqueJobs = [
            ...new Map(combinedJobs?.map((job) => [job?._id, job])).values(),
          ];
    
          setSearchResult(uniqueJobs);
    
          const { currentPage, totalPages } = res;
          totalPagesRef.current = totalPages;
          setHasMore(currentPage < totalPages);
          currentPageRef.current += 1;
        } else {
          console.warn("Unexpected response format:", res);
          setError("Failed to load jobs. Please try again later.");
        }
      } else {
        // For non-authenticated users, show a message to login
        setError("Please login to view job search results.");
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
  
      if (error?.response?.data?.message) {
        // Backend-provided error
        setError(error.response.data.message);
      } else if (error?.message) {
        // Thunk/Network error
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch jobs initially
  useEffect(() => {
    fetchSearchResult();
  }, []);

  // Clear search history handler
  const handleClearSearchHistory = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to clear search history.");
      return;
    }

    setLoading(true);

    try {
      const res = await dispatch(clearSearchHistory()).unwrap();
      console.log("response",res)
      if (res?.status === 200) {
        toast.success(res?.message);
        setSearchResult([]); // Clear search results after success
      } else {
        toast.error("Failed to delete search history.");
      }
    } catch (error) {
      console.error("Error clearing search history:", error);
      toast.error("Failed to delete search history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <ReactHelmet
        title='Browse Jobs - Next_Hire'
        description='Browse a wide range of job openings across various industries and locations.'
        canonicalUrl='http://mysite.com/browse'
      />

      <div className='max-w-7xl mx-auto my-10 p-4'>
        <div className='flex justify-between items-center w-full pt-3'>
          <h1 className='font-bold text-xl md:text-2xl my-6'>
            {isAuthenticated ? `Search Results (${searchResult.length})` : 'Browse Jobs'}
          </h1>
          {isAuthenticated && (
            <button
              onClick={handleClearSearchHistory}
              className='mb-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300'
            >
              Clear Search History
            </button>
          )}
        </div>

        {/* Login prompt for non-authenticated users */}
        {!isAuthenticated && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                <svg className='w-4 h-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <div>
                <h3 className='text-lg font-semibold text-blue-800'>Login Required</h3>
                <p className='text-blue-600'>Please login to view your personalized job search results and recommendations.</p>
                <div className='mt-3 flex gap-3'>
                  <a 
                    href='/login' 
                    className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200'
                  >
                    Login
                  </a>
                  <a 
                    href='/signup' 
                    className='bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200'
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job Listings */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {searchResult.length > 0 ? (
            searchResult?.map((job) => <Job key={job._id} job={job} />)
          ) : (
            <div className='col-span-full text-center py-5'>
              <span>
                {isAuthenticated ? 'No jobs found.' : 'Login to view your job search results.'}
              </span>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {loading && <Loader />}

        {/* Error Message */}
        {error && (
          <div className='text-center text-red-500 py-5'>
            <span>{error}</span>
          </div>
        )}

        {/* Load More Button (Optional) */}
        {hasMore && !loading && isAuthenticated && (
          <div className='text-center mt-6'>
            <button
              onClick={fetchSearchResult}
              className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300'
            >
              Load More Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
