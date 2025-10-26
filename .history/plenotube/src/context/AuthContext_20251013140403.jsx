import { useReducer } from "react";
import { authReducer, initialAuthState } from "./reducers/AuthReducer";
import { useContext } from "react";

const { createContext } = require("react");

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    const handleLogin = async (credentials) => {
        dispatch({ type: "LOGIN_START" });
        try {
            const data = await loginUser(credentials);
            dispatch({ type: "LOGIN_SUCCESS", payload: data });
        } catch (err) {
            dispatch({ type: "LOGIN_ERROR", payload: err.message });
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