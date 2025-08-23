import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants";

export const getComboOffer = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.COMBO_OFFER}/get`, {});
    return response.data;
  } catch (error) {
    console.error("failed to get data");
    throw error;
  }
};
export const getbyIdComboOffer = async (id) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.COMBO_OFFER}/get/${id}`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("failed to get data");
    throw error;
  }
};
export const addComboOffer = async (reqBody) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.COMBO_OFFER}/create`,
      reqBody,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("failed to get data");
    throw error;
  }
};
export const updateComboOffer = async (id, reqBody) => {
  try {
    const response = await axios.patch(
      `${API_ENDPOINTS.COMBO_OFFER}/update/${id}`,
      reqBody,
      {
          headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("failed to get data");
    throw error;
  }
};
export const deleteComboOffer = async (id) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.COMBO_OFFER}/delete/${id}`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("failed to get data");
    throw error;
  }
};

export const offerCategoryget = async()=>{
    try{
        const response = await axios.get(`${API_ENDPOINTS.COMBO_CATEGORY}/get`,{

        })
        return response.data
    }catch(error){
        console.error("Failed to get data");
        throw error
    }
}
export const offerCategorycreate = async(reqBody)=>{
    try{
        const response = await axios.post(`${API_ENDPOINTS.COMBO_CATEGORY}/create`,reqBody,{

        })
        return response.data
    }catch(error){
        console.error("Failed to get data");
        throw error
    }
}
