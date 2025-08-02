import type { RootState } from "@/store/store";
import type { JSX } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UserGuard = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || user?.role !== "user") {
    toast.error("Access denied. Users only!");
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default UserGuard