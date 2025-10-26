import { useReducer } from "react";
import { authReducer, initialAuthState } from "./reducers/AuthReducer";
import { useContext } from "react";

const { createContext } = require("react");

const AuthContext = createContext();

export const AuthProvide = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    return (
        <AuthContext.Provider value={{...state}}>
            {children}
        </AuthContext.Provider>)
}

export const useAuth = useContext(AuthContext)