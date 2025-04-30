import React, { useEffect, useState, useRef } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import ReactHelmet from "./shared/ReactHelmet";
import { getSearchResult, clearSearchHistory } from "@/redux/slices/user.slice";
import { useDispatch } from "react-redux";
import Loader from "./shared/Loader";
import { toast } from "react-toastify";

const BrowseJobs = () => {
  const dispatch = useDispatch();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const currentPageRef = useRef(1);
  const totalPagesRef = useRef(null);

  // Fetch search results from the server
  const fetchSearchResult = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await dispatch(
        getSearchResult({ page: currentPageRef.current, limit: 10 })
      ).unwrap();
      if (res?.status === 200) {
        const newJobs = res?.payload?.jobs;

        // Combine new jobs with existing jobs, ensuring uniqueness
        const uniqueJobs = [
          ...new Set([...searchResult, ...newJobs].map((job) => job?._id)),
        ].map((id) =>
          [...searchResult, ...newJobs].find((job) => job?._id === id)
        );

        setSearchResult(uniqueJobs);

        const { currentPage, totalPages } = res?.payload;
        totalPagesRef.current = totalPages;
        setHasMore(currentPage < totalPages);
        currentPageRef.current += 1;
      } else {
        setError("Failed to load jobs.");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("An error occurred while fetching jobs.");
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
    setLoading(true);

    try {
      const res = await dispatch(clearSearchHistory()).unwrap();
      if (res?.status === 200) {
        toast.success(res.payload.message);
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
            Search Results ({searchResult.length})
          </h1>
          <button
            onClick={handleClearSearchHistory}
            className='mb-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300'
          >
            Clear Search History
          </button>
        </div>

        {/* Job Listings */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {searchResult.length > 0 ? (
            searchResult.map((job) => <Job key={job._id} job={job} />)
          ) : (
            <div className='col-span-full text-center py-5'>
              <span>No jobs found.</span>
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
        {hasMore && !loading && (
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
