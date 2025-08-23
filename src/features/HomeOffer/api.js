import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants";

export const getHomeoffer = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.HOMEGIF}/get`, {});
    return response.data;
  } catch (error) {
    console.error("failed to get homeoffer");
    throw error;
  }
};
export const addHomeoffer = async (reqBody) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.HOMEGIF}/create`, reqBody, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("failed to add homeoffer");
    throw error;
  }
};
export const updateHomeoffer = async (id,reqBody) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.HOMEGIF}/update/${id}`, reqBody, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("failed to add homeoffer");
    throw error;
  }
};
export const deleteHomeoffer = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.HOMEGIF}/delete/${id}`, {
    
    });
    return response.data;
  } catch (error) {
    console.error("failed to delete homeoffer");
    throw error;
  }
};
