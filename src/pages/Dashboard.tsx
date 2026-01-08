import { useKpis } from "../features/dashboard/useKpis";

function StatCard ({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const kpis = useKpis();
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
          <StatCard label="Conversion Rate" value={Math.round((kpis.data?.conersionRate ?? 0) * 10000) / 100}/>
        </div>
      )}
    </div>
  );
}