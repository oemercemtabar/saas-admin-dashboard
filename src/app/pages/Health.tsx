import { useHealth } from "../../features/health/queries";
import type { ServiceStatus } from "../../features/health/types";

function StatusPill({ status }: { status: ServiceStatus }) {
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

export default function Health() {
  const health = useHealth();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">System Health</h1>
        <p className="mt-1 text-gray-600">Live status of core services and dependencies.</p>
      </div>

      {health.isLoading ? (
        <div className="text-gray-600">Loading health…</div>
      ) : health.isError ? (
        <div className="text-red-600">Failed to load health status.</div>
      ) : (
        <>
          <div className="text-sm text-gray-600">
            Last updated:{" "}
            <span className="font-medium">
              {new Date(health.data!.updatedAt).toLocaleString()}
            </span>
            <span className="ml-2 text-xs text-gray-500">(auto-refreshes every 15s)</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {health.data!.services.map((s) => (
              <div key={s.name} className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold">{s.name}</div>
                    <div className="mt-1 text-xs text-gray-500">Uptime: {s.uptime}%</div>
                  </div>
                  <StatusPill status={s.status} />
                </div>

                <div className="mt-4 text-sm text-gray-700">
                  Latency: <span className="font-medium">{s.latencyMs} ms</span>
                </div>

                <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, 100 - s.latencyMs / 5))}%`,
                      backgroundColor:
                        s.status === "healthy"
                          ? "#16a34a"
                          : s.status === "degraded"
                          ? "#ca8a04"
                          : "#dc2626",
                    }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  (Lower latency = better)
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}