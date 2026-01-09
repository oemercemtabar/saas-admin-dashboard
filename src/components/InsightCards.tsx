import Skeleton from "./Skeleton";
import type { Insights } from "../features/dashboard/insights";

function formatPct(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${Math.round(n * 10) / 10}%`;
}

function formatPP(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${Math.round(n * 10) / 10} pp`;
}

function InsightCard({
  label,
  value,
  deltaText,
  delta,
}: {
  label: string;
  value: string;
  deltaText: string;
  delta: number;
}) {
  const deltaCls =
    delta > 0
      ? "text-green-700 bg-green-50 border-green-200"
      : delta < 0
      ? "text-red-700 bg-red-50 border-red-200"
      : "text-gray-700 bg-gray-50 border-gray-200";

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
      <div className="mt-2">
        <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${deltaCls}`}>
          {deltaText}
        </span>
      </div>
    </div>
  );
}

export default function InsightCards({
  isLoading,
  isError,
  insights,
}: {
  isLoading: boolean;
  isError: boolean;
  insights: Insights | null;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border bg-white p-4 shadow-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-7 w-28" />
            <Skeleton className="mt-3 h-5 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) return null;

  if (!insights || !insights.hasEnoughData) {
    return (
      <div className="rounded-2xl border bg-white p-4 shadow-sm text-sm text-gray-600">
        Not enough data to compute insights yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <InsightCard
        label="Sessions (total)"
        value={Math.round(insights.sessionsCur).toLocaleString()}
        deltaText={`${formatPct(insights.sessionsDeltaPct)} vs previous`}
        delta={insights.sessionsDeltaPct}
      />

      <InsightCard
        label="Active users (avg/day)"
        value={Math.round(insights.usersCurAvg).toLocaleString()}
        deltaText={`${formatPct(insights.usersDeltaPct)} vs previous`}
        delta={insights.usersDeltaPct}
      />

      <InsightCard
        label="Conversion (avg)"
        value={`${Math.round(insights.convCurAvg * 1000) / 10}%`}
        deltaText={`${formatPP(insights.convDeltaPP)} vs previous`}
        delta={insights.convDeltaPP}
      />

      <InsightCard
        label="Crashes (total)"
        value={Math.round(insights.crashesCur).toLocaleString()}
        deltaText={`${formatPct(insights.crashesDeltaPct)} vs previous`}
        delta={insights.crashesDeltaPct}
      />
    </div>
  );
}