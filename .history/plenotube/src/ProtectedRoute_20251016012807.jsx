import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, isAuthenticated, redirect }) => {
  if (!isAuthenticated) {
    return <Navigate to={`/sign-in?redirect=${redirect}`} replace />;
  }
  return Component;
};

export default ProtectedRoute;
