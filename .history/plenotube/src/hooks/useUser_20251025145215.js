import { useState, useCallback } from "react";
import { getUserGeneralApi } from "../api/userApi";

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
  }, []);

  return { getUserGeneral, user, loading };
};

export default useUser;
