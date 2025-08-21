import axios from "axios";
import { API_ENDPOINTS } from "../../lib/constants";

// get
export const getallDeal = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.TIMEDEAL}/get`, {});
    return response.data;
  } catch (error) {
    console.error("Failed to get deals");
    throw error;
  }
};

// adddeal
export const addDeal = async (reqBody) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.TIMEDEAL}/create`, reqBody, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add");
    throw error;
  }
};

// edit
// export const updateDeal = async(reqBody, id)=>{
//     try{
//      const response = await axios.patch(`${API_ENDPOINTS}/update/${id}`,reqBody,{
//           headers: {
//          "Content-Type": "multipart/form-data",      },
//      })
//      return response.data;
//     }catch(error){
//         console.error("failed to update deal")
//     }
// }

// delete
export const deleteDeal = async(id)=>{
    try{
        const response = await axios.delete(`${API_ENDPOINTS.TIMEDEAL}/delete/${id}`,{

        })
        return response.data;
    }catch(error){
        console.error("failed to delete");
        throw error
    }
}