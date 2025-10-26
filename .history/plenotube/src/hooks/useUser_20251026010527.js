import { useState, useCallback } from "react";
import { getUserGeneralApi, updateUserGeneralApi, verifyAndUpdateUserMailApi } from "../api/userApi";

const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const getUserGeneral = useCallback(async (token) => {
    try {
      setLoading(true);
      const res = await getUserGeneralApi(token);

      if (!res?.success) {
        console.error("Error fetching user:", res?.message);
        setLoading(false);
        return null;
      }

      setUser(res.user);
      setLoading(false);
      return res.user;
    } catch (error) {
      console.error("Error in getUserGeneral hook:", error);
      setLoading(false);
      return null;
    }
  }, [user]);

  const updateUserGeneral = useCallback(async (data)=>{
    try{
      setLoading(true);
      const response = await updateUserGeneralApi(data);
      if(!response.success){
        console.log(response);
      }
      setUser(response.user);
      
    }catch(error){
      console.log(error);
    }
    setLoading(false);
  },[user])

  const genrateMailChangeOtp = useCallback(async(data) => {
    const response = await genrateUserMailOtpApi(data);

    if(!response.success){
      console.log(response);
    }
    console.log(response);
  },[user])

  const verifyOtp = useCallback(async(data)=>{
    const response = await verifyAndUpdateUserMailApi(data);
    console.log(response);
  },[user])

  return { getUserGeneral,updateUserGeneral, genrateMailChangeOtp, verifyOtp,  user, loading };
};

export default useUser;
