import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import axios from "axios";


const ProtectedRoute = ({ element: Component, redirect = '/' }) => {
    const { user, loading, dispatch, isAuthenticated } = useAuth();

   console.log(user)

    if (loading) {
        return (
            <div className="w-100 h-100 flex justify-center items-center">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={`/sign-in?redirect=${redirect}`} replace />;
    }

    return Component;
};

export default ProtectedRoute;
