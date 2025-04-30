import axios from "axios";
import { getToken } from "@/utils/constant";

const fetchFromApiServer = (
  requestType,
  url,
  data = {},
  options = {},
  Authorization
) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error("API URL is not defined. Check your .env file.");
  }
  const fullUrl = `${apiUrl}${url}`;
  const config = getHeaderConfig(requestType, options, Authorization);
  return fetchApiWrapper(fullUrl, requestType, data, config);
};

const getHeaderConfig = (requestType, options, Authorization) => {
  const token = getToken();
  const headers = {
    "Content-Type":
      requestType === "MULTIPART" || requestType === "PUT"
        ? "multipart/form-data"
        : "application/json",
    Accept: "*/*",
    ...(token && { Authorization: Authorization || `Bearer ${token}` }),
  };
  return {
    headers,
    params: options.params,
    timeout: 60 * 10 * 1000,
  };
};

const fetchApiWrapper = (url, requestType, data, config) => {
  switch (requestType) {
    case "GET":
      return axios.get(url, config);
    case "POST":
      return axios.post(url, data, config);
    case "DELETE":
      return axios.delete(url, { ...config, data });
    case "PUT":
      return axios.put(url, data, config);
    case "PATCH":
      return axios.patch(url, data, config);
    case "MULTIPART":
      return axios.post(url, data, config);
    default:
      throw new Error(`Unsupported request type: ${requestType}`);
  }
};

export default fetchFromApiServer;
