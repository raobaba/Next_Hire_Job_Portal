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
  return await fetchFromApiServer('DELETE', url)
}