export const initialAuthState = {
    user: null,
    isOtp:null,
    loading: null,
    error: null,
}

export const authReducer = (state, action) => {
  switch (action.type) {
    case "GET_STATE":
    case "AUTH_START":
    case "OTP_START":
      return { ...state, loading: true, error: null };

    case "OTP_RECEIVED":
      return { ...state, user: action.payload.user, isOtp:true, loading: false };

    case "OTP_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };

    case "OTP_ERROR":
    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };

    case "LOGOUT":
      return initialAuthState;
    
    case "SET_STATE":
      return {
        ...state, 
        user: action.payload.user, 
        token: action.payload.token,
        loading:null,
        error:null
      }

    default:
      return state;
  }
};
