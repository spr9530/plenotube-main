import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { user } from "@heroui/theme";
import Cookies from "js-cookie";

const ProtectedRoute = ({ element: Component, redirect = '/' }) => {
    const [loading, setLoading] = React.useState(true);
    const [userInfo, setUserInfo] = React.useState(null);

    useEffect(() => {
        const stored = Cookies.get('user');
        console.log(stored)
        if (stored) {
            console.log(stored)
            try {
                const parsed = JSON.parse(stored);
                if (parsed?.token && parsed?.info) {
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

    // if (!(userInfo)) {
    //     return <Navigate to={`/sign-in?redirect=${redirect}`} replace />;
    // }

    return Component;
};

export default ProtectedRoute;
