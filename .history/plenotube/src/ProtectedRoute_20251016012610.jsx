import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/sign--in" replace />;
  }
  return Component;
};

export default ProtectedRoute;
