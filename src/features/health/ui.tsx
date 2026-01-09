import type { ServiceStatus } from "./types";

export function HealthPill({ status }: { status: ServiceStatus }) {
  const cls =
    status === "healthy"
      ? "bg-green-100 text-green-700"
      : status === "degraded"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-700";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}