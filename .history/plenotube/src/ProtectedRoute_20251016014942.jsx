import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ element: Component, redirect = '/' }) => {
    const { user, token, loading } = useAuth()
    // Directly derive auth state — no need for extra useState/useEffect
    const isAuthenticated = !!(user && token);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    if (!isAuthenticated) {
        return <Navigate to={`/sign-in?redirect=${redirect}`} replace />;
    }
    return Component;
};

export default ProtectedRoute;
