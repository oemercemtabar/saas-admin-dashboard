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

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ["tickets"] });

      const previous = qc.getQueriesData<TicketsResponse>({ queryKey: ["tickets"] });
      previous.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<TicketsResponse>(key, {
          ...data,
          items: data.items.map((t) =>
            t.id === payload.id ? { ...t, status: payload.status } : t
          ),
        });
      });

      return { previous };
    },
    onError: (_err, _payload, ctx) => {
      ctx?.previous?.forEach(([key, data]) => {
        qc.setQueryData(key, data);
      });
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}