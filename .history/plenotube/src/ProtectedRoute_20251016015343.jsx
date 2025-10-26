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
            setUserInfo(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>; // or your loader
    }

    if (!(userInfo?.user && userInfo?.token)) {
        return <Navigate to={`/sign-in?redirect=${redirect}`} replace />;
    }

    return Component;
};

export default ProtectedRoute;
