import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "@/utils/constant";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = getToken();
  const user = {
    role: "recruiter",
  };

  useEffect(() => {
    if (!token || !user || user.role !== "recruiter") {
      navigate("/");
    }
  }, [token, user, navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
