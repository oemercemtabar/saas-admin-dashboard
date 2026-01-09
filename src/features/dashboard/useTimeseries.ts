import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../api/client";

export type TimeseriesPoint = {
  day: string;
  activeUsers: number;
  sessions: number;
  crashes: number;
  conversionRate: number;
};

export function useTimeseries(days: number) {
  return useQuery<{ items: TimeseriesPoint[] }>({
    queryKey: ["timeseries", days],
    queryFn: () => apiGet(`/api/metrics/timeseries?days=${days}`),
    placeholderData: (prev) => prev,
  });
}