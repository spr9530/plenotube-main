import { useReducer } from "react";
import { authReducer, intialState } from "./reducers/AuthReducer";

const { createContext } = require("react");

const AuthContext = createContext();

export const AuthProvide = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, intialState);

    return (
        <AuthContext.Provider value={state, dispatch}>
            {children}
        </AuthContext.Provider>)
}