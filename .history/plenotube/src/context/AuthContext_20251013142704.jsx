import { useReducer } from "react";
import { authReducer, initialAuthState } from "./reducers/AuthReducer";
import { useContext } from "react";
import { registerUserApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const { createContext } = require("react");

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate()

    const [state, dispatch] = useReducer(authReducer, initialAuthState);
    const [isOtp, setIsOtp] = useState(false);

    const handleRegister = async (credentials) => {
        dispatch({ type: "AUTH_START" });
        try {
            const response = await registerUserApi(credentials);
            if (!response.success) {
                console.log(response.message);
            }

            console.log(response.message);
            setIsOtp(true);
            dispatch({ type: "OTP_RECEIVED", payload: { user: response.user } });
        } catch (error) {
            console.error("Error registering user:", error.message || error);
            throw error;
        }
    };

    const handleOtp = async (otp) => {
        dispatch({ type: "OTP_START" });
        try {
            const response = await checkOtp(otp);
            if (!response.success) {
                console.log(response.message);
            }
            console.log(response.message);
            dispatch({ type: "OTP_SUCCESS", payload: { user: response.user } });
            setTimeout(()=>navigate('/discover'), 300);
            setIsOtp(false);
        } catch (error) {
            console.error("Error otp checking:", error.message || error);
            throw error;
        }
    }


    const handleLogout = async () => {
        await logoutUser();
        dispatch({ type: "LOGOUT" });
    };

    return (
        <AuthContext.Provider value={{ ...state, handleRegister, handleLogout }}>
            {children}
        </AuthContext.Provider>)
}

export const useAuth = useContext(AuthContext)