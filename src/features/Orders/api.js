import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants";


export const getAllOrders = async()=>{
    try{
        const response = await axios.get(`${API_ENDPOINTS.ORDERS}/get`,{

        })
        return response.data
    }catch(error){
        console.error("failed to get");
        throw error;
    }
}
export const getAllOrdersbyId = async(id)=>{
    try{
        const response = await axios.get(`${API_ENDPOINTS.ORDERS}/get/${id}`,{

        })
        return response.data
    }catch(error){
        console.error("failed to get");
        throw error;
    }
}
export const updateOrders = async(id)=>{
    try{
        const response = await axios.patch(`${API_ENDPOINTS.ORDERS}/patch/${id}`,{

        })
        return response.data
    }catch(error){
        console.error("failed to get");
        throw error;
    }
}