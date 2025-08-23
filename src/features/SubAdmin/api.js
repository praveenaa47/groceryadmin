import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants";

export const addSubadmin = async (reqBody) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.SUBADMIN}/`, reqBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add subadmin");
    throw error;
  }
};

export const viewSubadmin = async (reqBody) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.SUBADMIN}`, reqBody, {});
    return response.data;
  } catch (error) {
    console.error("Failed to get subadmin");
    throw error;
  }
};
export const updateSubadmin = async (reqBody, id) => {
  try {
    const response = await axios.patch(
      `${API_ENDPOINTS.SUBADMIN}/${id}`,
      reqBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to edit subadmin");
    throw error;
  }
};

export const deleteSubadmin = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.SUBADMIN}/${id}`, {});
    return response.data;
  } catch (error) {
    console.error("Failed to delete subadmin");
    throw error;
  }
};

// activities api

export const viewSubadminActivity = async () => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.get(`${API_ENDPOINTS.SUBADMINACTIVITIES}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to view activity");
    throw error;
  }
};
export const viewbyIdSubadminActivity = async (id) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.SUBADMINACTIVITIES}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to view activity");
    throw error;
  }
};
