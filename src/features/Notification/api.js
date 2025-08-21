import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants";

export const getAllNotifications = async () => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.get(`${API_ENDPOINTS.NOTIFICATION}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch {
    console.error("Failed to get Notifications");
    throw error;
  }
};

export const createNotifications = async (reqBody) => {
  const token = localStorage.getItem("adminToken");
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.NOTIFICATION}`,
      reqBody,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch {
    console.error("Failed to get Notifications");
    throw error;
  }
};

export const updateNotifications = async (reqBody) => {
  try {
    const response = await axios.patch(
      `${API_ENDPOINTS.NOTIFICATION}/${id}`,
      reqBody,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch {
    console.error("Failed to get Notifications");
    throw error;
  }
};
export const deleteNotifications = async (id) => {
  const token = localStorage.getItem("adminToken")
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.NOTIFICATION}/${id}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch {
    console.error("Failed to get Notifications");
    throw error;
  }
};
