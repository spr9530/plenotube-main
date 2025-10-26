import { useReducer } from "react";
import { authReducer, initialAuthState } from "./reducers/AuthReducer";
import { useContext } from "react";
import { registerUserApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

import { createContext } from "react"
import { useState } from "react";
import { useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate()

    const [state, dispatch] = useReducer(authReducer, initialAuthState);
    const [isOtp, setIsOtp] = useState(false);

    useEffect(() => {
        if (state.token && state.user) {
            localStorage.setItem("auth", JSON.stringify({ user: state.user, token: state.token }));
        } else {
            localStorage.removeItem("auth");
        }
    }, [state.user, state.token]);

    // useEffect(() => {
    //     if (state.error) toast.error(state.error);
    //     if (state.isOtpSent) toast.success("OTP sent to your email!");
    //     if (state.token && state.user) toast.success("Authentication successful!");
    // }, [state.error, state.isOtpSent, state.user, state.token]);

    const handleRegister = useCallback(async (credentials) => {
        dispatch({ type: "AUTH_START" });
        try {
            const response = await registerUserApi(credentials);
            if (!response.success) {
                dispatch({ type: "OTP_ERROR", payload: response.message });
                return;
            }
            setIsOtp(true);
            dispatch({ type: "OTP_RECEIVED", payload: { user: response.user } });
        } catch (error) {
            dispatch({
                type: "OTP_ERROR",
                payload: error.response?.data?.message || error.message,
            });
        }
    }, [dispatch, setIsOtp]);


    const handleOtp = useCallback(async (otp) => {
        dispatch({ type: "OTP_START" });
        try {
            const response = await checkOtp(otp);
            if (!response.success) {
                dispatch({ type: "OTP_ERROR", payload: response.message });
                return;
            }
            dispatch({
                type: "OTP_SUCCESS",
                payload: { user: response.user, token: response.token },
            });
            setTimeout(() => navigate("/discover"), 300);
            setIsOtp(false);
        } catch (error) {
            dispatch({
                type: "OTP_ERROR",
                payload: error.response?.data?.message || error.message,
            });
        }
    }, [dispatch, navigate, setIsOtp]);


    const handleLogout = async () => {
        await logoutUser();
        dispatch({ type: "LOGOUT" });
    };

    return (
        <AuthContext.Provider value={{ ...state, isOtp, handleRegister, handleLogout, handleOtp }}>
            {children}
        </AuthContext.Provider>)
}

export const useAuth = () => {
    return useContext(AuthContext)
}