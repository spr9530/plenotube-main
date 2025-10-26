import axios from "axios";

const URL = 'http://localhost:5000/api/v1'

export const registerUserApi = async (credentials) => {
    // credentials = {full_name, username, email, password};
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
    throw error; 
  }
}
