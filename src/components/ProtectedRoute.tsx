import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // Could be a spinner
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
