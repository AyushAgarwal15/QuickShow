import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAppContext();
  const location = useLocation();

  if (user && isAdmin === undefined) {
    return null; // or spinner later
  }

  if (!user || !isAdmin) {
    toast.error("Unauthorized access");
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default AdminRoute; 