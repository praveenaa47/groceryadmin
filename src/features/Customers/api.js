import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants";
const API_BASE_URL = "https://grocery-codeedex.onrender.com/api";


// referl api 
export const getreferal = async()=>{
    try{
         const resposne = await axios.get(`${API_BASE_URL}/admin/coin-setting`,{});
         return resposne.data;
    }catch(error){
        console.error("Error fetching refreal code")
        throw error
    }
}

// upadte or create
export const addreferal = async(reqBody)=>{
    try{
        const response = await axios.post(`${API_BASE_URL}/admin/coin-setting`, reqBody,{
             headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;                   

    }catch(error){
        console.error("Error adding or updating referal code", error);
        throw error;
    }
}

// CUSTOMER
export const getCustomerbyId = async(id)=>{
    try{
     const response = await axios.get(`${API_ENDPOINTS.CUSTOMER}/${id}`,{

     })
     return response.data;
    }catch(error){
        console.error("failed to get customer");
        throw error
    }
}
export const getAllCustomer = async()=>{
    try{
     const response = await axios.get(`${API_ENDPOINTS.CUSTOMER}`,{

     })
     return response.data;
    }catch(error){
        console.error("failed to get customer");
        throw error
    }
}
export const deleteCustomer = async(id)=>{
    try{
     const response = await axios.delete(`${API_ENDPOINTS.CUSTOMER}/${id}`,{

     })
     return response.data;
    }catch(error){
        console.error("failed to get customer");
        throw error
    }
}