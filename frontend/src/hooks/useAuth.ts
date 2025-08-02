import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useAuth = () => {
  const { data, isPending: isLoading, isSuccess, isError } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        withCredentials: true,
      });
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const user = isSuccess && data?.isAuthenticated ? data.user : null;

  return { isLoading, isAuthenticated: !!user, user, isAdmin: user?.role === "admin", isError };
};

export default useAuth;
