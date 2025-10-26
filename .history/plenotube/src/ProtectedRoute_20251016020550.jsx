import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { user } from "@heroui/theme";

const ProtectedRoute = ({ element: Component, redirect = '/' }) => {
    const {user, token,loading} = useAuth();

    // if (loading) {
    //     return <div className="w-100 h-100 flex justify-center items-center">Loading...</div>;
    // }

    // if (!(user && token)) {
    //     return <Navigate to={`/sign-in?redirect=${redirect}`} replace />;
    // }

    return Component;
};

export default ProtectedRoute;
