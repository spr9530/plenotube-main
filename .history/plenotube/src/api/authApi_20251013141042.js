import axios from "axios";

const URL = 'http://localhost:5000/api/v1'

export const registerUserApi = async (credentials) => {
  try {
    const response = await axios.post(
      `${URL}/users/sign-up`,
      credentials,
      {
        withCredentials: true,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Registration failed");
    }

    return response.data; 
  } catch (error) {
    console.error("Error registering user:", error.message || error);
    throw error; // ✅ rethrow to handle in the UI or caller
  }
};
