import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../layout/Navbar";
import Job from "./Job";
import ReactHelmet from "../../common/ReactHelmet";
import { getSearchResult, clearSearchHistory } from "@/redux/slices/user.slice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../common/Loader";
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
    <div className='min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-[#6A38C2]/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-[#F83002]/5 rounded-full blur-3xl'></div>
      </div>

      <Navbar />
      <ReactHelmet
        title='Browse Jobs - Next_Hire'
        description='Browse a wide range of job openings across various industries and locations.'
        canonicalUrl='/browse'
      />

      <div className='max-w-7xl mx-auto mt-24 px-4 py-8 relative z-10'>
        <div className='flex flex-col sm:flex-row justify-between items-center w-full mb-8 gap-4'>
          <div>
            <h1 className='text-3xl md:text-4xl font-extrabold mb-2'>
              <span className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                {isAuthenticated ? 'Search Results' : 'Browse Jobs'}
              </span>
              {isAuthenticated && (
                <span className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent'>
                  {' '}({searchResult.length})
                </span>
              )}
            </h1>
            <p className='text-gray-600'>Discover opportunities that match your profile</p>
          </div>
          {isAuthenticated && (
            <button
              onClick={handleClearSearchHistory}
              className='bg-gradient-to-r from-[#F83002] to-[#d62828] hover:from-[#d62828] hover:to-[#F83002] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
            >
              Clear Search History
            </button>
          )}
        </div>

        {/* Login prompt for non-authenticated users */}
        {!isAuthenticated && (
          <div className='bg-white/95 backdrop-blur-sm border-2 border-[#6A38C2]/20 rounded-2xl p-6 mb-8 shadow-lg'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-[#6A38C2]/10 to-[#F83002]/10 rounded-xl flex items-center justify-center flex-shrink-0'>
                <svg className='w-6 h-6 text-[#6A38C2]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-bold text-gray-900 mb-1'>Login Required</h3>
                <p className='text-gray-600 mb-4'>Please login to view your personalized job search results and recommendations.</p>
                <div className='flex gap-3'>
                  <a 
                    href='/login' 
                    className='bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105'
                  >
                    Login
                  </a>
                  <a 
                    href='/signup' 
                    className='bg-white text-[#6A38C2] border-2 border-[#6A38C2] px-6 py-2 rounded-xl font-semibold hover:bg-[#6A38C2]/10 transition-all duration-300'
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
            <div className='col-span-full text-center py-12'>
              <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200/60 shadow-lg max-w-md mx-auto'>
                <p className='text-gray-600 text-lg'>
                  {isAuthenticated ? 'No jobs found.' : 'Login to view your job search results.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className='flex justify-center items-center py-12'>
            <Loader />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className='text-center py-8'>
            <div className='bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-6 max-w-md mx-auto'>
              <p className='text-red-600 font-semibold'>{error}</p>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && isAuthenticated && (
          <div className='text-center mt-8'>
            <button
              onClick={fetchSearchResult}
              className='bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
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
