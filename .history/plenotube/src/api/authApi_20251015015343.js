import axios from "axios";

const URL = 'http://localhost:5000/api/v1'

export const registerUserApi = async (credentials) => {
    // credentials = {full_name, username, email, password};
    try {
        const response = await axios.post(
            `${URL}/auth/sign-up`,
            credentials,
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error.message || error);
        throw error;
    }
}

export const checkOtpApi = async (data) => {
    // otp = {otp: 123456};
    try {
        const response = await axios.post(`${URL}/auth/verify-otp`,
            data,
            {
                withCredentials: true,
            }
        )
        return response.data;
    }catch(error){
         console.error("Error otp verification:", error.message || error);
        throw error;
    }
}

export const userLoginApi = async(credentials) => {
    try{
        const response = await axios.post(`${URL}/auth/sign-in`)
    }catch(error){
        console.log(error)
    }
}
