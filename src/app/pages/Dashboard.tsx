import { useState } from "react";
import { useKpis } from "../../features/dashboard/useKpis";
import { useActivity } from "../../features/dashboard/useActivity";
import { useTimeseries } from "../../features/dashboard/useTimeseries";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar} from "recharts";
import Skeleton from "../../components/Skeleton";
import InsightCards from "../../components/InsightCards";
import { computeInsights } from "../../features/dashboard/insights";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function RangePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-xl border px-3 py-1.5 text-sm",
        active ? "bg-black text-white" : "bg-white hover:bg-gray-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function Dashboard() {
  const kpis = useKpis();
  const activity = useActivity();

  const [days, setDays] = useState(14);
  const ts = useTimeseries(days);

  const items = ts.data?.items ?? [];
  const insights = ts.isLoading || ts.isError ? null : computeInsights(items);  

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of Client KPIs</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {kpis.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border bg-white p-4 shadow-sm">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-3 h-8 w-20" />
                </div>
              ))}
            </div>
          ) : kpis.isError ? (
            <div className="text-red-600">Error loading KPIs</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Active Users" value={kpis.data?.activeUsers ?? 0} />
              <StatCard label="Sessions" value={kpis.data?.sessions ?? 0} />
              <StatCard label="Crashes" value={kpis.data?.crashes ?? 0} />
              <StatCard
                label="Conversion"
                value={`${Math.round((kpis.data?.conversionRate ?? 0) * 1000) / 10}%`}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Trends</div>
              <div className="text-sm text-gray-600">Last {days} days</div>
            </div>
            <InsightCards isLoading={ts.isLoading} isError={ts.isError} insights={insights} />

            <div className="flex items-center gap-2">
              <RangePill active={days === 7} onClick={() => setDays(7)}>
                7d
              </RangePill>
              <RangePill active={days === 14} onClick={() => setDays(14)}>
                14d
              </RangePill>
              <RangePill active={days === 30} onClick={() => setDays(30)}>
                30d
              </RangePill>
            </div>
          </div>

          {ts.isLoading ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-2xl border bg-white p-4 shadow-sm">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="mt-4 h-64 w-full rounded-2xl" />
                </div>
              ))}
            </div>
          ) : ts.isError ? (
            <div className="text-red-600">Failed to load charts.</div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="text-sm font-medium text-gray-700">
                  Sessions & Active Users
                </div>
                <div className="mt-3 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ts.data?.items ?? []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="day"
                        tickFormatter={(v) => new Date(v).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(v) => new Date(String(v)).toLocaleString()}
                      />
                      <Line type="monotone" dataKey="sessions" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="activeUsers" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="text-sm font-medium text-gray-700">Crashes</div>
                <div className="mt-3 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ts.data?.items ?? []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="day"
                        tickFormatter={(v) => new Date(v).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(v) => new Date(String(v)).toLocaleString()}
                      />
                      <Bar dataKey="crashes" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-lg font-semibold">Recent Activity</div>

            {activity.isLoading ? (
              <ul className="mt-3 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i} className="py-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="mt-2 h-3 w-1/3" />
                  </li>
                ))}
              </ul>
            ) : activity.isError ? (
              <div className="mt-3 text-red-600">Failed to load activity</div>
            ) : (
              <ul className="mt-3 divide-y">
                {(activity.data ?? []).slice(0, 6).map((item) => (
                  <li key={item.id} className="py-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium">{item.message}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        {String(item.type).toUpperCase()}
                      </div>
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
      </div>
    </div>
  );
}