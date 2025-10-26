import { useReducer } from "react";
import { authReducer, initialAuthState } from "./reducers/AuthReducer";
import { useContext } from "react";
import { checkOtpApi, registerUserApi, registerViaGoogleApi, userLoginApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

import { createContext } from "react"
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()
    const [state, dispatch] = useReducer(authReducer, initialAuthState);
    const [isOtp, setIsOtp] = useState(false);

    useEffect(() => {
        dispatch({type: "AUTH_START"})
        const storedAuth = sessionStorage.getItem("auth");
        if (storedAuth) {
            const parsed = JSON.parse(storedAuth);
            dispatch({
                type: "SET_STATE",
                payload: { user: parsed.user, isAuthenticated: true },
            });
            return;
        }

        const checkAuth = async () => {
            try {
                const res = await axios.get("/api/me", { withCredentials: true });
                if (res.data.authenticated) {
                    dispatch({
                        type: "SET_STATE",
                        payload: { user: res.data.user, isAuthenticated: true },
                    });
                    sessionStorage.setItem("auth", JSON.stringify({ user: res.data.user, isAuthenticated: true }));
                }
            } catch (error) {
                dispatch({
                    type: "SET_STATE",
                    payload: { user: null, isAuthenticated: false },
                });
                console.log(error);
            }
        };

        checkAuth();
    }, [dispatch]);


    // useEffect(() => {
    //     if (state.token && state.user) {

    //         sessionStorage.setItem("auth", JSON.stringify({ user: state.user, token: state.token }));
    //     }
    //     else if (state.user && isOtp) {
    //         sessionStorage.setItem("otp", JSON.stringify({ user: state.user }));
    //     }
    //     else {
    //         localStorage.removeItem("auth");
    //     }
    // }, [state.user, state.token]);

    // useEffect(() => {
    //     if (state.error) toast.error(state.error);
    //     if (state.isOtpSent) toast.success("OTP sent to your email!");
    //     if (state.token && state.user) toast.success("Authentication successful!");
    // }, [state.error, state.isOtpSent, state.user, state.token]);

    const handleRegister = useCallback(
        async (credentials) => {
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
        }, [dispatch, setIsOtp]
    );

    const handleOtp = useCallback(
        async (data) => {
            dispatch({ type: "OTP_START" });
            try {
                const response = await checkOtpApi(data);
                if (!response.success) {
                    dispatch({ type: "OTP_ERROR", payload: response.message });
                    if (!response.session) {
                        navigate('/sign-up');
                    }
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
        }, [dispatch, navigate, setIsOtp]
    );

    const handleRegisterViaGoogle = useCallback(
        async (credentials) => {
            dispatch({ type: "AUTH_START" });
            try {
                const response = await registerViaGoogleApi(credentials);
                if (!response.success) {
                    dispatch({ type: "LOGIN_ERROR" })
                    return;
                }
                dispatch({ type: "LOGIN_SUCCESS", payload: { user: response.user, token: response.token } })
                navigate('/platform')
            } catch (error) {
                dispatch({ type: "LOGIN_ERROR" })
            }

        },
        [dispatch, navigate,]
    )

    const handleLogin = useCallback(
        async (credentials) => {
            const params = new URLSearchParams(location.search);
            const redirectPath = params.get("redirect") || "platform";

            dispatch({ type: "AUTH_START" });

            try {
                const response = await userLoginApi(credentials);

                // Check for success flag
                if (!response.success) {
                    dispatch({
                        type: "LOGIN_ERROR",
                        payload: response.message || "Login failed",
                    });
                    console.log(response.message);
                    return;
                }

                // Dispatch success
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: { user: response.user, token: response.token },
                });

                // Navigate to redirect path
                navigate(`/${redirectPath}`);
            } catch (error) {
                dispatch({
                    type: "LOGIN_ERROR",
                    payload: error.response?.data?.message || error.message,
                });
                console.error("Login error:", error);
            }
        }, [dispatch, navigate, location]
    );

    const handleLogout = async () => {
        await logoutUser();
        dispatch({ type: "LOGOUT" });
    };

    return (
        <AuthContext.Provider value={{ ...state, isOtp, dispatch, handleRegister, handleRegisterViaGoogle, handleLogout, handleOtp, handleLogin }}>
            {children}
        </AuthContext.Provider>)
}

export const useAuth = () => {
    return useContext(AuthContext)
}