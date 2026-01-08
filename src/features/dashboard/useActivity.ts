import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../api/client";

export type ActivityItem = {
    id: string;
    ts: string;
    type: "session" | "message" | "ticket" | "crash" | "health";
    message: string;
};

export function useActivity() {
    return useQuery({
        queryKey: ["activity"],
        queryFn: () => apiGet<ActivityItem[]>("/api/activity"),
    });
}