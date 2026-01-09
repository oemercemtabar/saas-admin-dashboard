import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../api/client";
import type { UserRow } from "./types";

export type UserSession = {
    id: string;
    ts: string;
    brand: string;
    model: string;
    footShape: string;
    toeShape: string;
    status: "completed" | "failed";
};

export type UserDetailResponse = {
    user: UserRow;
    sessions: UserSession[];
};

export function useUser(userId: string | null) {
    return useQuery<UserDetailResponse>({
        queryKey: ["user", userId],
        queryFn: () => apiGet<UserDetailResponse>(`/api/users/${userId}`),
        enabled: !!userId,
    });
}