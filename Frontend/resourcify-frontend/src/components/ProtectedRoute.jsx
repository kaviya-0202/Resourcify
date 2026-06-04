import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, staffOnly = false }) => {
  const { user, token } = useAuth();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (staffOnly && user.role !== "staff") return <Navigate to="/home" replace />;
  return children;
};

export default ProtectedRoute;
