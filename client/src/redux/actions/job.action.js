import fetchFromApiServer from "@/services";

// Post a new job API
export const postJobApi = async (data) => {
  const url = "api/v1/job/post";
  return await fetchFromApiServer("POST", url, data);
};

// Get all jobs API
export const getAllJobsApi = async (params) => {
  const url = "api/v1/job/get";
  return await fetchFromApiServer("GET", url, {}, { params }); // Ensure params is directly passed
};

// Get admin jobs API
export const getAdminJobsApi = async () => {
  const url = "api/v1/job/getadminjobs";
  return await fetchFromApiServer("GET", url);
};

// Get job by ID API
export const getJobByIdApi = async (jobId) => {
  const url = `api/v1/job/get/${jobId}`;
  return await fetchFromApiServer("GET", url);
};

export const removeJobApi = async (jobId) => {
  const url = `api/v1/job/delete/${jobId}`;
  return await fetchFromApiServer("DELETE", url);
};

export const fetchSimilarJobApi = async (jobId) => {
  const url = `api/v1/job/${jobId}/similar`;
  return await fetchFromApiServer("GET", url);
};

export const filterOptionData = async () => {
  const url = `api/v1/job/filters`;
  return await fetchFromApiServer("GET", url);
};

export const carouselData = async () => {
  const url = `api/v1/job/carousel`;
  return await fetchFromApiServer("GET", url);
};

// Prep resources
export const getPrepResourcesApi = async (params = {}) => {
  const url = `api/v1/prep-resources`;
  return await fetchFromApiServer("GET", url, {}, { params });
};

// Highlights for landing page
export const getHighlightsApi = async () => {
  const url = `api/v1/highlights`;
  return await fetchFromApiServer("GET", url);
};