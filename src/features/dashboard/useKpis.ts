import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../api/client.ts";

export type Kpis ={
    activeUsers: number;
    sessions: number;
    crashes: number;
    conversionRate: number;
};

export function useKpis() {
    return useQuery<Kpis>({
        queryKey: ['kpis'],
        queryFn: () => apiGet<Kpis>('/api/kpis'),
    });
};