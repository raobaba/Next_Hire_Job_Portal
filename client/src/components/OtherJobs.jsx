// OtherJobs.js (Frontend)
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OtherJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch job data from the backend API
    const fetchJobData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/job/getOtherJob');
        setJobs(response.data); // Store the fetched jobs
      } catch (error) {
        setError('Failed to load jobs');
        console.error("Error fetching job data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, []);

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Job Listings</h2>
      <ul>
        {jobs.map((job, index) => (
          <li key={index}>
            <a href={`https://www.indeed.com${job.link}`} target="_blank" rel="noopener noreferrer">
              <h3>{job.jobTitle}</h3>
            </a>
            <p>{job.company}</p>
            <p>{job.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OtherJobs;
