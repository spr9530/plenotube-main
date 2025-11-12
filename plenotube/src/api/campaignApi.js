import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/v1`;

export const createCampaignApi = async (campaignData) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/campaign/create-campaign`,
            campaignData,
            { withCredentials: true });

        return response.data;
    } catch (error) {
        console.log(error);
        throw error.response?.data || { success: false, message: "Server error" };
    }
}

export const getUserCampaignsApi = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/user/campaign/get-user-campaigns`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false,message:'Somthing Went Wrong' }
    }
}

export const getDiscoverCampaignApi = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/user/campaign/get-campaigns`, { withCredentials: true });

        return response.data
    } catch (error) {
        throw error.response?.data || { success: false, message:'Somthing Went Wrong' }
    }
}

export const getCampaignInfoApi = async(id) => {
    try{
        const response = await axios.get(`${BASE_URL}/user/campaign/get-campaign-info/${id}`, {withCredentials: true});
        return response.data;
    }catch(error){
        throw error.response?.data || {success:false, message:'Somthing Went Wrong'}
    }
}