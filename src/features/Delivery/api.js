import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants";

export const getDeliveryfee = async()=>{
    try{
        const response = await axios.get(`${API_ENDPOINTS.DELIVERYFEE}/get`,{

        })
        return response.data;
    }catch(error){
        console.error("failed to get delivery fee");
        throw error
    }
}
export const createDeliveryfee = async(reqBody)=>{
    try{
        const response = await axios.post(`${API_ENDPOINTS.DELIVERYFEE}/create`,reqBody,{
        })
        return response.data;
    }catch(error){
        console.error("failed to get delivery fee");
        throw error
    }
}
export const updateDeliveryfee = async(id,reqBody)=>{
    try{
        const response = await axios.patch(`${API_ENDPOINTS.DELIVERYFEE}/update/${id}`,reqBody,{
        })
        return response.data;
    }catch(error){
        console.error("failed to get delivery fee");
        throw error
    }
}
export const deleteDeliveryfee = async(id)=>{
    try{
        const response = await axios.delete(`${API_ENDPOINTS.DELIVERYFEE}/delete/${id}`,{
        })
        return response.data;
    }catch(error){
        console.error("failed to get delivery fee");
        throw error
    }
}