const cacheCampaign = async(campaign) => {
    try{
        await redisClient.set(`campaign:${campaign._id}`, JSON.stringify(campaign));
    }catch(error){
        console.error("❌ Error caching campaign:", error);
    }
}