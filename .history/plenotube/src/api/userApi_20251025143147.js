import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/user";

export const getUserGeneralApi = async (token) => {
    try {
        // ✅ Ensure token is provided
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