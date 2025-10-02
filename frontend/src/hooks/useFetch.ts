import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

interface FetchParams {
  url: string;
  queryKey: string[];
}

export const useFetch = <T>({ url, queryKey }: FetchParams): UseQueryResult<T> => {
    return useQuery<T>({
    queryKey: queryKey,
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/${url}`);
      return res.data;
    },
  });
}