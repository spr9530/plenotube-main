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
import generateToast from "../toast/GenrateToast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()
    const [state, dispatch] = useReducer(authReducer, initialAuthState);
    const [isOtp, setIsOtp] = useState(false);
    const [token, setToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setLoading(true);
        const storedAuth = sessionStorage.getItem("auth");
        if (storedAuth) {
            const parsed = JSON.parse(storedAuth);
            setToken(parsed.token);
            setUserInfo(parsed.user);
            setIsAuthenticated(true);
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const res = await axios.get("https://plenotube-main.onrender.com/api/v1/auth/get-me", { withCredentials: true });
                if (res.data.authenticated) {
                    setUserInfo(res.data.user);
                    setIsAuthenticated(true);
                    setToken(res.data.token);
                    sessionStorage.setItem("auth", JSON.stringify({ user: res.data.user, isAuthenticated: true, token: res.data.token }));
                }
            } catch (error) {
                setUserInfo(null);
                setIsAuthenticated(false);
                setToken(null);
                console.log(error);
            }
            setLoading(false)
        };

        checkAuth();
    }, [dispatch]);

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
            setLoading(true);
            const params = new URLSearchParams(location.search);
            const redirectPath = params.get("redirect") || "platform";
            try {
                const response = await registerViaGoogleApi(credentials);
                if (!response.success) {
                    // tbd toast 
                    console.log(response.message);
                    return;
                }
                setToken(response.token);
                setUserInfo(response.user);
                setIsAuthenticated(true);
                setLoading(false);
                navigate(`/${redirectPath}`);
                navigate('/platform')
            } catch (error) {
                dispatch({ type: "LOGIN_ERROR" })
            }

        },
        [dispatch, navigate,]
    )

    const handleLogin = useCallback(
        async (credentials) => {
            setLoading(true);
            const params = new URLSearchParams(location.search);
            const redirectPath = params.get("redirect") || "platform";

            try {
                const response = await userLoginApi(credentials);
                if (!response.success) {
                    // tbd toast 
                    console.log(response.message);
                    return;
                }
                setToken(response.token);
                setUserInfo(response.user);
                setIsAuthenticated(true);
                setLoading(false);
                navigate(`/${redirectPath}`);
            } catch (error) {
                console.error("Login error:", error);
                generateToast({ title: 'Login Error', message: error, type: 'danger' })
            }
        }, [dispatch, navigate, location]
    );

    const handleLogout = useCallback(async () => {
        setLoading(true);

        try {
            // 1️⃣ Optional: call backend to clear cookies (if using withCredentials)
            await axios.get("https://plenotube-main.onrender.com/api/v1/auth/logout", {
                withCredentials: true,
            });

            // 2️⃣ Clear React state
            setToken(null);
            setUserInfo(null);
            setIsAuthenticated(false);

            // 3️⃣ Remove session storage auth object
            sessionStorage.removeItem("auth");
            // cook

            // 4️⃣ Redirect user
            navigate("/sign-in");

        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);



    return (
        <AuthContext.Provider value={{ isOtp, isAuthenticated, userInfo, loading, token, dispatch, handleRegister, handleRegisterViaGoogle, handleLogout, handleOtp, handleLogin }}>
            {children}
        </AuthContext.Provider>)
}

export const useAuth = () => {
    return useContext(AuthContext)
}