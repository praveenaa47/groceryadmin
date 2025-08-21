import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants";


export const getHomeoffer = async()=>{
    try{
        const response = await axios.get(`${API_ENDPOINTS.HOMEGIF}/get`,{

        })
        return response.data
    }catch(error){
        console.error("failed to get homeoffer");
        throw error
    }
}