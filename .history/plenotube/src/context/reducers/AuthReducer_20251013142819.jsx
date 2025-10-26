export const initialAuthState = {
    user: null,
    token: null,
    loading: null,
    error: null,
}

export const authReducer = (state, action) => {
    switch (action.type) {
        case "AUTH_START":
            return { ...state, loading: true, error: null };
        case "OTP_RECEIVED":
            return {...state, user:action.payload.user, loading:false};
        case "OTP_SUCCESS":
            return {...state, user:action.payload.user,  token: action.payload.token, loading: false};
        case "OTP_ERROR":
            return {...state, loading: false};
        case "LOGIN_SUCCESS":
            return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
        case "LOGIN_ERROR":
            return { ...state, loading: false, error: action.payload };
        case "LOGOUT":
            return initialAuthState;
        default:
            return state;
    }
}