import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants";

export const getCoupon = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.COUPONS}`, {});
    return response.data;
  } catch (error) {
    console.error("Failed to get response");
  }
};
export const createCoupon = async (reqBody) => {
  const token = localStorage.getItem("adminToken")
  try {
    const response = await axios.post(`${API_ENDPOINTS.COUPONS}`, reqBody,{
         headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${token}`
        },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get response");
  }
};
export const updateCoupon = async (id,reqBody) => {
  try {
    const response = await axios.patch(`${API_ENDPOINTS.COUPONS}/${id}`,reqBody,{
       headers: {
          "Content-Type": "application/json",
        },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get response");
  }
};

export const deleteCoupon = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.COUPONS}/${id}`, {});
    return response.data;
  } catch (error) {
    console.error("Failed to get response");
  }
};
