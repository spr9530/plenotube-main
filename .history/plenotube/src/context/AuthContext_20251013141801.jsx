import { useReducer } from "react";
import { authReducer, initialAuthState } from "./reducers/AuthReducer";
import { useContext } from "react";
import { registerUserApi } from "../api/authApi";

const { createContext } = require("react");

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    const handleRegister = async (credentials) => {
        dispatch({ type: "AUTH_START" });
        try {
            const response = await registerUserApi(credentials);
            if (!response.success) {
                console.log(response.message);
            }
        } catch (error) {
            console.error("Error registering user:", error.message || error);
            throw error;
        }
    };


    const handleLogout = async () => {
        await logoutUser();
        dispatch({ type: "LOGOUT" });
    };

    return (
        <AuthContext.Provider value={{ ...state, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>)
}

export const useAuth = useContext(AuthContext)