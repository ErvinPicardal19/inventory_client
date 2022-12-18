import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
   const {setAuth} = useAuth();

   const refresh = async() => {
      const response = await axios.post('/refresh', {}, {
         withCredentials: true
      });
      setAuth(prev => {
         return {
            ...prev,
            roles: response?.data?.roles,
            accessToken: response?.data?.accessToken,
            name: response?.data?.name,
            email: response?.data?.email,
            profile: response?.data?.profile
         }
      });
      return response.data.accessToken;

   }
  return refresh;
}

export default useRefreshToken