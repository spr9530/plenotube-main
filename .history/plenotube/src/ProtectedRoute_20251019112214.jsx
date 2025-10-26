import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";


const ProtectedRoute = ({ element: Component, redirect = '/' }) => {
    const { state, dispatch } = useAuth();
    const { user, loading } = state;

    useEffect(() => {
        const checkAuth = async () => {
            if (!user) {
                dispatch({ type: "AUTH_START" });
                try {
                    const res = await axios.get("/api/me", { withCredentials: true });
                    if (res.data.authenticated) {
                        dispatch({
                            type: "SET_STATE",
                            payload: { user: res.data.user, token: res.data.token || null },
                        });
                    } else {
                        dispatch({ type: "LOGOUT" });
                    }
                } catch (err) {
                    dispatch({ type: "LOGOUT" });
                }
            }
        };

        checkAuth();
    }, [dispatch, user]);

    if (loading) {
        return (
            <div className="w-100 h-100 flex justify-center items-center">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to={`/sign-in?redirect=${redirect}`} replace />;
    }

    return children;
};

export default ProtectedRoute;
