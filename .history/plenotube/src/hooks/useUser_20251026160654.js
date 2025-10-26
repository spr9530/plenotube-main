import { useState, useCallback } from "react";
import { generateUserMailOtpApi, getUserGeneralApi, updatePasswordApi, updateUserGeneralApi, verifyAndUpdateUserMailApi } from "../api/userApi";
import generateToast from "../toast/GenrateToast";

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

  const updateUserGeneral = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await updateUserGeneralApi(data);
      if (!response.success) {
        console.log(response);
      }
      setUser(response.user);

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [user])

  const genrateMailChangeOtp = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await generateUserMailOtpApi(data);
      generateToast({ title: 'Success', message: response.message, type: 'success' })
      setLoading(false);
      return true;
    } catch (error) {
      generateToast({ title: 'Mail Error', message: error.message, type: 'danger' })
      setLoading(false);
      return false;
    }

  }, [user])

  const verifyOtp = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await verifyAndUpdateUserMailApi(data);
      generateToast({ title: 'Success', message: response.message, type: 'success' })
      setUser(response.user);
      setLoading(false);
      setLoading(false);
      return true;
    } catch (error) {
      generateToast({ title: 'Mail Error', message: error.message, type: 'danger' })
      setLoading(false);
      return false;
    }
  }, [user])

  const updateUserPassword = useCallback(async (data) => {
    try {
      setLoading(true);
      const res = updatePasswordApi(data);
      if (!res.success) {
        console.log(res);
      }
      console.log(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  })

  return { getUserGeneral, updateUserGeneral, genrateMailChangeOtp, verifyOtp, updateUserPassword, user, loading };
};

export default useUser;
