import { createContext, useContext, useState } from "react";
import { createCampaignApi, getUserCampaignsApi } from "../api/campaignApi";
import generateToast from "../toast/GenrateToast";

const CampaignContext = createContext();

export const CampaignProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [userCampaign, setUserCampaign] = useState([]);

    const createCampaign = async (campaignData) => {
        try {
            setLoading(true);
            const res = await createCampaignApi(campaignData);
            if (res.success) {
                generateToast({ title: 'Campaign Created', message: res.message, type: 'success' });
                setUserCampaign([...userCampaign, res.campaign]);
            }
            setLoading(false);

            return true;

        } catch (error) {
            generateToast({ title: 'Campaign Error', message: error.message, type: 'danger' });
            setLoading(false);
            return false;
        }
    }

    const getUserCampaigns = async () => {
        try{
            console.log('called');
            setLoading(true);
            const res = await getUserCampaignsApi();
            if(res.success){
                setUserCampaign(res.campaigns);
            }
            
        }catch(error){
            generateToast({title:'Campaign Error', message:error.message, type:'danger'})
        }
        setLoading(false);
    }


    return <CampaignContext.Provider value={{ loading, userCampaign, createCampaign, getUserCampaigns }}>
        {children}
    </CampaignContext.Provider>
}


export const useCampaignContext = () => useContext(CampaignContext);
