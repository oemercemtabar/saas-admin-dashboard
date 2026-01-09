import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../api/client";
import type { HealthResponse } from "./types";

export function useHealth() {
  return useQuery<HealthResponse>({
    queryKey: ["health"],
    queryFn: () => apiGet("/health"),
    refetchInterval: 15000,
  });
}