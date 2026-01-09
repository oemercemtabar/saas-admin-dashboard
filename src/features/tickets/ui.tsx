import type { TicketStatus } from "./types";

export function TicketStatusPill({ status }: { status: TicketStatus }) {
  const cls =
    status === "pending"
      ? "bg-red-100 text-red-700"
      : status === "in_progress"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-700";

  const label = status === "in_progress" ? "in progress" : status;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}