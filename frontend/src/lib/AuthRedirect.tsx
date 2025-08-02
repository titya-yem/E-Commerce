import useAuth from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const AuthRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  if (!user) return <Navigate to="/signin" replace />;

  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  
  return <Navigate to="/user/dashboard" replace />;
};

export default AuthRedirect;