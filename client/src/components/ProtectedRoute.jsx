import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  const location = useLocation();
  if (!user) {
    toast.error("Please login to continue");
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
};

export default ProtectedRoute; 