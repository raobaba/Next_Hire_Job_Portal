import fetchFromApiServer from "@/services";

// User login API
export const loginUserApi = async (data) => {
  const url = `api/v1/user/login`;
  return await fetchFromApiServer("POST", url, data);
};

// User register API
export const registerUserApi = async (data) => {
  const url = `api/v1/user/register`;
  return await fetchFromApiServer("MULTIPART", url, data);
};

// User logout API
export const logoutUserApi = async () => {
  const url = `api/v1/user/logout`;
  return await fetchFromApiServer("GET", url);
};

// Fetch search history API
export const getUserSearchHistoryApi = async () => {
  const url = `api/v1/user/search-history`;
  return await fetchFromApiServer("GET", url);
};

// Clear search history API
export const clearUserSearchHistoryApi = async () => {
  const url = `api/v1/user/search-history`;
  return await fetchFromApiServer("DELETE", url);
};

// Update user profile API
export const updateUserProfileApi = async (formData) => {
  const url = `api/v1/user/profile/update`;
  return await fetchFromApiServer("MULTIPART", url, formData);
};

export const fetchRecommendedJobs = async (params) => {
  const url = `api/v1/user/recommended-jobs`;
  return await fetchFromApiServer('GET', url, {}, { params })
}

export const fetchSearchResult = async (params) => {
  const url = `api/v1/user/search`;
  return await fetchFromApiServer('GET', url, {}, { params })
}

export const deleteSearchHistory = async () => {
  const url = `api/v1/user/search-history/clear`;
  return await fetchFromApiServer('DELETE', url)
}

export const emailVerification = async (params) => {
  const {token} = params;
  const url = `api/v1/user/verify-email?token=${token}`;
  return await fetchFromApiServer('GET', url);
};
