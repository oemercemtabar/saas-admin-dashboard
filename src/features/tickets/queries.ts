import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet } from "../../api/client";
import type { Ticket, TicketsResponse, TicketStatus } from "./types";

export type TicketsQueryParams = {
  q: string;
  status: "all" | TicketStatus;
  page: number;
  pageSize: number;
};

export function useTickets(params: TicketsQueryParams) {
  const search = new URLSearchParams({
    q: params.q,
    status: params.status,
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  return useQuery<TicketsResponse>({
    queryKey: ["tickets", params],
    queryFn: () => apiGet(`/api/tickets?${search.toString()}`), 
    placeholderData: (prev) => prev,
  });
}

export function useUpdateTicketStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; status: TicketStatus }) => {
      const res = await fetch(`/api/tickets/${payload.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: payload.status }),
      });

      if (!res.ok) throw new Error("Failed to update ticket");
      return (await res.json()) as Ticket;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}