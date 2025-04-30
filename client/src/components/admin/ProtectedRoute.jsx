import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "@/utils/constant";
import { useSelector } from "react-redux"; // If you're using Redux to store user data

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = getToken();

  // Assuming you store user information in Redux or context
  const user = useSelector((state) => state.user); // Adjust this if using context or other state management

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (user?.role !== "recruiter") {
      navigate("/"); // Redirect to home if user is not a recruiter
    }
  }, [token, user, navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
