import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/user";

export const getUserGeneralApi = async (token) => {
    try {

        if (!token) {
            console.warn("No token provided to getUserGeneralApi");
            return null;
        }

        const response = await axios.get(`${BASE_URL}/genral-info`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching user general info:", error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch user info",
        };
    }
};

export const updateUserGeneralApi = async (data) => {
    try {
        const res = await axios.post(`${BASE_URL}/genral-info/update`,
            data,
            { withCredentials: true })
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const generateUserMailOtpApi = async (data) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/update-user-mail`,
            data,
            { withCredentials: true }
        );

        return response.data;

    } catch (error) {
        console.error("Error in generateUserMailOtpApi:", error.response?.data || error.message);
        throw error.response?.data || { success: false, message: "Server error" };
    }
};

export const verifyAndUpdateUserMailApi = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/verify-update-user-mail`,
            data,
            { withCredentials: true })
        return response.data;
    } catch (error) {
        console.error("Error in generateUserMailOtpApi:", error.response?.data || error.message);
        throw error.response?.data || { success: false, message: "Server error" };
    }
}

export const updatePasswordApi = async (data) => {
    try {
        const res = await axios.post(`${BASE_URL}/update-user-password`,
            data,
            { withCredentials: true }
        )
        return res.data;
    } catch (error) {
        console.log(error);
        throw error.response?.data || { success: false, message: "Server error" };
    }
}

export const genrateSecurityKeyApi = async (platform) => {
    try {
        const response = await axios.get(`${BASE_URL}/genrate-account-security-code?platform=${platform}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error.response?.data || { success: false, message: "Server error" };
    }
}

export const submitSocialProfileApi = async (data, platform) => {
    try {
        const response = await axios.post(`${BASE_URL}/submit-profile-link?platform=${platform}`, data, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error.response?.data || { success: false, message: "Server error" };
    }
}