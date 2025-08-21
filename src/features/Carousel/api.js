import axios from "axios"
import { API_ENDPOINTS } from "../../lib/constants"

export const getCarouselItems = async () => {
    try {
        const response = await axios.get(`${API_ENDPOINTS.CAROUSEL}/get`);
        return response.data;
    } catch (error) {
        console.error("Error fetching carousel items:", error);
        throw error;
    }
}