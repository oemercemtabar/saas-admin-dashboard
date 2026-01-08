import { useKpis } from "../features/dashboard/useKpis";
import { useActivity } from "../features/dashboard/useActivity";

function StatCard ({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const kpis = useKpis();
  const activity = useActivity();
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of Client KPIs</p>
      </div>

      {kpis.isLoading ? (
        <div className="text-gray-600">Loading KPIs...</div>
      ) : kpis.isError ? (
        <div className="text-red-600">Error loading KPIs</div>
      ) : (
        <div className="grid  gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active Users" value={kpis.data?.activeUsers ?? 0} />
          <StatCard label="Sessions" value={kpis.data?.sessions ?? 0} />
          <StatCard label="Crashes" value={kpis.data?.crashes ?? 0} />
          <StatCard label="Conversion Rate" value={Math.round((kpis.data?.conversionRate ?? 0) * 10000) / 100} />
        </div>
      )}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="text-lg font-semibold">Recent Activity</div>

        {activity.isLoading ? (
          <div className="mt-3 text-gray-600">Loading activity…</div>
        ) : activity.isError ? (
          <div className="mt-3 text-red-600">Failed to load activity</div>
        ) : (
          <ul className="mt-3 divide-y">
            {(activity.data ?? []).slice(0, 6).map((item) => (
              <li key={item.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">{item.message}</div>
                  <div className="mt-1 text-xs text-gray-500">{item.type.toUpperCase()}</div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(item.ts).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    
  );
}