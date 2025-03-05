import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) {
    return <Navigate to="/admin" />;
  }
  if (role !== "1") {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default PrivateRoute;
