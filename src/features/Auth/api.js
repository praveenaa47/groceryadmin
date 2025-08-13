import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants";

export const adminLogin = async (email, password) => {
    try {
        const response = await axios.post(`${API_ENDPOINTS.LOGIN}`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}