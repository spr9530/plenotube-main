import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import axios from "axios";


const ProtectedRoute = ({ element: Component, redirect = '/' }) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    return (loading ?<div className="w-100 h-100 flex justify-center items-center">
        Loading...
      </div>: isAuthenticated ? Component : `${navigate(`/sign-in?redirect=${redirect}`)}`);
};

export default ProtectedRoute;
