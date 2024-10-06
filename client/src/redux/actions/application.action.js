import fetchFromApiServer from "@/services"; // Your service for API requests

// Apply for a job API
export const applyJobApi = async (jobId) => {
  const url = `api/v1/application/apply/${jobId}`;
  return await fetchFromApiServer("POST", url);
};

// Get all jobs applied for by the user
export const getAppliedJobsApi = async () => {
  const url = `api/v1/application/get`;
  return await fetchFromApiServer("GET", url);
};

// Get applicants for a specific job
export const getApplicantsApi = async (jobId) => {
  const url = `api/v1/application/${jobId}/applicants`;
  return await fetchFromApiServer("GET", url);
};

// Update the status of an application
export const updateApplicationStatusApi = async (applicationId, status) => {
  const url = `api/v1/application/status/${applicationId}/update`;
  return await fetchFromApiServer("POST", url, { status });
};
