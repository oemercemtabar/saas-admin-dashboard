// src/features/users/queries.ts
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../api/client";
import type { UserResponse } from "./types";

export function useUsers(params: {
  q: string;
  role: "all" | "admin" | "client_admin" | "user";
  page: number;
  pageSize: number;
}) {
  const search = new URLSearchParams({
    q: params.q ?? "",
    role: params.role,
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  return useQuery<UserResponse>({
    queryKey: ["users", params],
    queryFn: () => apiGet<UserResponse>(`/api/users?${search.toString()}`),
  });
}