import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet } from "../../api/client";
import type { Settings } from "./types";

export function useSettings() {
  return useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: () => apiGet("/api/settings"), 
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Settings>) => {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save settings");
      return (await res.json()) as Settings;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}