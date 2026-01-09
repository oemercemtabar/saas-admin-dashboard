import Skeleton from "./Skeleton";

export default function TableSkeleton({
  rows = 8,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="text-xs uppercase text-gray-500 border-b">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="py-3 pr-4">
                <Skeleton className="h-3 w-24" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="py-3 pr-4">
                  <Skeleton className="h-3 w-28" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}