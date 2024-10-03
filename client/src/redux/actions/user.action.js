import fetchFromApiServer from "@/services";

export const loginUserApi = async (data) => {
  console.log("data before api call", data);
  var url = `api/v1/user/login`;
  const response = await fetchFromApiServer("POST", url, data);
  console.log("response before api call", response);
  return response;
};

export const registerUserApi = async (data) => {
  console.log("data before api call", data);
  var url = `api/v1/user/register`;
  const response = await fetchFromApiServer("MULTIPART", url, data);
  console.log("response before api call", response);
  return response;
};

export const logoutUserApi = async () => {
  var url = `api/v1/user/logout`;
  const response = await fetchFromApiServer("GET", url);
  return response;
};
