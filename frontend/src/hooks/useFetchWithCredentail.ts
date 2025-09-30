import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

interface Props {
  url?: string;
  queryKey: string[];
}

export const useFetchWithCredentail = <T>({ url, queryKey }: Props): UseQueryResult<T> => {
    return useQuery<T>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/${url}`, {withCredentials: true,});
            return res.data;
        }
    })
}