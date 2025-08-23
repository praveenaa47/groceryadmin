import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants";

export const getHome = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.HOMESECTION}/get`, {});
    return response.data;
  } catch (error) {
    console.error("Failed to get home section");
    throw error;
  }
};
export const addHome = async (reqBody) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.HOMESECTION}/create`,
      reqBody,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get home section ");
    throw error;
  }
};
export const updateHome = async (id, reqBody) => {
  try {
    const response = await axios.patch(
      `${API_ENDPOINTS.HOMESECTION}/update/${id}`,
      reqBody,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get home section");
    throw error;
  }
};
export const deleteHome = async (id) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.HOMESECTION}/delete/${id}`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete home section");
    throw error;
  }
};
export const getbyIdHome = async (id) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.HOMESECTION}/get/${id}`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get home section");
    throw error;
  }
};
