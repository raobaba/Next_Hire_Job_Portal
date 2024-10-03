export const getToken = () => {
  const token = localStorage.getItem("token");
  return token;
};
export const getProfilePic = ()=>{
  const profile = localStorage.getItem("profile");
  return profile;
}