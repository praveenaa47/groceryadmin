import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants";

export const getAllproducts = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.PRODUCT}/get`, {});
    return response.data;
  } catch (error) {
    console.error("Faield to get products");
    throw error;
  }
};

export const addproduct = async (reqBody) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.PRODUCT}/create`,
      reqBody,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add");
    throw error;
  }
};
export const updateproduct = async (id, reqBody) => {
  try {
    const response = await axios.patch(
      `${API_ENDPOINTS.PRODUCT}/update/${id}`,
      reqBody,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add");
    throw error;
  }
};

export const deleteproduct = async (id) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.PRODUCT}/delete/${id}`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add");
    throw error;
  }
};
export const viewbyIdproduct = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.PRODUCT}/get/${id}`, {});
    return response.data;
  } catch (error) {
    console.error("Failed to add");
    throw error;
  }
};

export const getMainCategories = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.MAINCATEGORY}/get`);
    return response.data;
  } catch (error) {
    console.error("Error fetching referral points:", error);
    throw error;
  }
};

export const getbyCatid = async (id) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.SUBCATEGORY}/get/category/${id}`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Failed to getmainid");
  }
};

export const getbyMainid = async (id) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.CATEGORY}/main/${id}`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Failed to getmainid");
  }
};
