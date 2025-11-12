import { createContext, useContext, useState } from "react";
import { createCampaignApi, getCampaignInfoApi, getDiscoverCampaignApi, getUserCampaignsApi } from "../api/campaignApi";
import generateToast from "../toast/GenrateToast";

const CampaignContext = createContext();

export const CampaignProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [userCampaign, setUserCampaign] = useState([]);
    const [particularCampaign, setParticularCampaign] = useState('');
    const [discover, setDiscover] = useState([]);
    const [discoverLoading, setDiscoverLoading] = useState(false);
    const [discoverPage, setDiscoverPage] = useState(1);
    const [discoverEnd, setDiscoverEnd] = useState(false);

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
        try {
            console.log('called');
            setLoading(true);
            const res = await getUserCampaignsApi();
            if (res.success) {
                setUserCampaign(res.campaigns);
            }

        } catch (error) {
            generateToast({ title: 'Campaign Error', message: error.message, type: 'danger' })
        }
        setLoading(false);
    }

    const getDiscover = async (page=1) => {
        if (discoverLoading || discoverEnd) return; // prevent multiple or unnecessary requests

        try {
            setDiscoverLoading(true);
            const res = await getDiscoverCampaignApi(page); // pass page param to backend

            if (res.success && Array.isArray(res.campaigns)) {
                if (res.campaigns.length === 0) {
                    setDiscoverEnd(true); // no more data
                } else {
                    setDiscover((prev) => [...prev, ...res.campaigns]);
                    setDiscoverPage(page);
                }
            }
        } catch (error) {
            console.error(error);
            generateToast({
                title: 'Discover Error',
                message: 'Something went wrong',
                type: 'danger',
            });
        } finally {
            setDiscoverLoading(false);
        }
    };

    const getCampaignInfo = async (id) => {
        try {
            setLoading(true);
            setParticularCampaign('');
            const res = await getCampaignInfoApi(id);
            if (res.success) {
                setParticularCampaign(res.campaign)
            }
        } catch (error) {
            generateToast({ title: 'Campaign Error', message: error.message, type: 'danger' });
        } finally {
            setLoading(false);
        }
    }



    return <CampaignContext.Provider value={{ loading, userCampaign, discover, discoverEnd, discoverLoading,particularCampaign, createCampaign, getUserCampaigns, getDiscover, getCampaignInfo }}>
        {children}
    </CampaignContext.Provider>
}


export const useCampaignContext = () => useContext(CampaignContext);
