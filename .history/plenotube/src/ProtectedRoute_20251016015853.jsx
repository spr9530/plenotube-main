import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { user } from "@heroui/theme";

const ProtectedRoute = ({ element: Component, redirect = '/' }) => {
    const [loading, setLoading] = React.useState(true);
    const [userInfo, setUserInfo] = React.useState(null);

    useEffect(() => {
  const stored = localStorage.getItem("auth");

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.token && parsed?.user) {
        setUserInfo(parsed);
      }
    } catch (err) {
      console.error("Invalid auth data in localStorage:", err);
      localStorage.removeItem("auth");
    }
  }

  setLoading(false);
}, []);

    if (loading) {
        return <div className="w-100 h-100 flex justify-center items-center">Loading...</div>; 
    }

    if (!(userInfo?.user && userInfo?.token)) {
        return <Navigate to={`/sign-in?redirect=${redirect}`} replace />;
    }

    return Component;
};

export default ProtectedRoute;
