import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import axios from "axios";


const ProtectedRoute = ({ element: Component, redirect = '/' }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if(loading){
        return <>Loading.......</>
    }



    return Component;
};

export default ProtectedRoute;
