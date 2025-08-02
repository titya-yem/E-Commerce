import type { RootState } from "@/store/store";
import type { JSX } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminGuard = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || user?.role !== "admin") {
    toast.error("Access denied. Admins only!");
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default AdminGuard;