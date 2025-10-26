import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import axios from "axios";


const ProtectedRoute = ({ element: Component, redirect = '/' }) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();



    return (loading ? <>Loading..........</>: isAuthenticated ? Component : navigate(`/sign-in?redirect=${redirect}`));
};

export default ProtectedRoute;
