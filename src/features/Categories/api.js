import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants";


export const getMainCategories = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.MAINCATEGORY}/get`);
    return response.data;
  } catch (error) {
    console.error("Error fetching referral points:", error);
    throw error;
  }
}
export const addMainCategories = async (categoryData) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.MAINCATEGORY}/create`, categoryData,
       {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching referral points:", error);
    throw error;
  }
}

export const editMainCategories = async (id , reqBody,formData) => {
  try {
    const response = await axios.patch(`${API_ENDPOINTS.MAINCATEGORY}/update/${id}`,reqBody,formData,{
       headers: {
          "Content-Type": "multipart/form-data",
        },
    }
      
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching referral points:", error);
    throw error;
  }
}
export const deleteMainCategories = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.MAINCATEGORY}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching referral points:", error);
    throw error;
  }
}
export const getByIdMainCategories = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.MAINCATEGORY}/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching referral points:", error);
    throw error;
  }
}


// category api

export const addCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.CATEGORY}/create`,
      categoryData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
      
    return response.data;
  } catch (error) {
    console.error("Error fetching referral points:", error);
    throw error;
  }
}
export const getAllCategory = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.CATEGORY}/get`);
    return response.data;
  } catch (error) {
    console.error("Error fetching referral points:", error);
    throw error;
  }
}
export const updateCategory = async (id,reqBody) => {
  try {
    const response = await axios.patch(`${API_ENDPOINTS.CATEGORY}/update/${id}`,reqBody,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching referral points:", error);
    throw error;
  }
}
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.CATEGORY}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching referral points:", error);
    throw error;
  }
}

export const getbyMainid = async(id)=>{
  try{
    const response = await axios.get(`${API_ENDPOINTS.CATEGORY}/main/${id}`,{

    })
  return response.data
  }catch(error){
    console.error("Failed to getmainid");
    
  }
}
export const getbyCatid = async(id)=>{
  try{
    const response = await axios.get(`${API_ENDPOINTS.CATEGORY}/get/category/${id}`,{

    })
  return response.data
  }catch(error){
    console.error("Failed to getmainid");
    
  }
}

export const getAllSubCategory = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.SUBCATEGORY}/get`);
    return response.data;
  } catch (error) {
    console.error("Error fetching referral points:", error);
    throw error;
  }
}
export const addSubCategory = async (reqBody) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.SUBCATEGORY}/create`,reqBody,{
       headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching referral points:", error);
    throw error;
  }
}
export const updateSubCategory = async (id, reqBody) => {
  try {
    const response = await axios.patch(`${API_ENDPOINTS.SUBCATEGORY}/update/${id}`,reqBody,{
          headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching referral points:", error);
    throw error;
  }
}
export const deleteSubCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.SUBCATEGORY}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching referral points:", error);
    throw error;
  }
}

