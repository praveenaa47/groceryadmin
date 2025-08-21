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
export const addCarouselItems = async (reqBody) => {
    try {
        const response = await axios.post(`${API_ENDPOINTS.CAROUSEL}/create`,reqBody,{
            headers: {
          "Content-Type": "multipart/form-data",
        },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching carousel items:", error);
        throw error;
    }
}
// export const updateCarouselItems = async (id,reqBody) => {
//     try {
//         const response = await axios.patch(`${API_ENDPOINTS.CAROUSEL}/update/${id}`,reqBody,{
//             headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching carousel items:", error);
//         throw error;
//     }
// }
export const deleteCarouselItems = async (id) => {
    try {
        const response = await axios.delete(`${API_ENDPOINTS.CAROUSEL}/delete/${id}`,{
   
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching carousel items:", error);
        throw error;
    }
}