import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { user } from "@heroui/theme";
import Cookies from "js-cookie";

const ProtectedRoute = ({ element: Component, redirect = '/' }) => {
    const [loading, setLoading] = React.useState(true);
    const [userInfo, setUserInfo] = React.useState(null);



    if (loading) {
        return <div className="w-100 h-100 flex justify-center items-center">Loading...</div>;
    }

    if (!(userInfo)) {
        return <Navigate to={`/sign-in?redirect=${redirect}`} replace />;
    }

    return Component;
};

export default ProtectedRoute;
