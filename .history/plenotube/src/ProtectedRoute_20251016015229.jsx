import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { user } from "@heroui/theme";

const ProtectedRoute = ({ element: Component, redirect = '/' }) => {
     const userInfo = JSON.parse(localStorage.getItem("auth"));

    if (!(userInfo?.user && userInfo?.token)) {
        return <Navigate to={`/sign-in?redirect=${redirect}`} replace />;
    }
    return Component;
};

export default ProtectedRoute;
