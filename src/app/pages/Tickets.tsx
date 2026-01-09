import { useMemo, useState } from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import { useTickets, useUpdateTicketStatus } from "../../features/tickets/queries";
import type { Ticket, TicketStatus } from "../../features/tickets/types";

function StatusPill({ status }: { status: TicketStatus }) {
  const cls =
    status === "pending"
      ? "bg-red-100 text-red-700"
      : status === "in_progress"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-700";
  const label = status === "in_progress" ? "in progress" : status;

  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
}

export default function Tickets() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | TicketStatus>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const tickets = useTickets({ q, status, page, pageSize });
  const updateStatus = useUpdateTicketStatus();

  const columns = useMemo<ColumnDef<Ticket>[]>(
    () => [
      { accessorKey: "code", header: "Code" },
      { accessorKey: "client", header: "Client" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "subject", header: "Subject" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusPill status={row.original.status} />,
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-600">
            {new Date(String(getValue())).toLocaleString()}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const t = row.original;
          const busy = updateStatus.isPending;

          return (
            <div className="flex items-center gap-2">
              <button
                className="rounded-xl border px-3 py-1.5 text-xs disabled:opacity-50 hover:bg-gray-50"
                disabled={busy || t.status === "in_progress"}
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus.mutate({ id: t.id, status: "in_progress" });
                }}
              >
                In progress
              </button>
              <button
                className="rounded-xl border px-3 py-1.5 text-xs disabled:opacity-50 hover:bg-gray-50"
                disabled={busy || t.status === "resolved"}
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus.mutate({ id: t.id, status: "resolved" });
                }}
              >
                Resolved
              </button>
            </div>
          );
        },
      },
    ],
    [updateStatus.isPending]
  );

  const table = useReactTable({
    data: tickets.data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const total = tickets.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tickets</h1>
        <p className="mt-1 text-gray-600">Track and manage support requests.</p>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search code, client, email, subject..."
              className="w-full md:w-96 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as any);
                setPage(1);
              }}
              className="rounded-xl border px-3 py-2 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {tickets.isLoading ? "Loading…" : `${total} tickets`}
          </div>
        </div>

        {tickets.isError ? (
          <div className="text-red-600 text-sm">Failed to load tickets.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs uppercase text-gray-500 border-b">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th key={h.id} className="py-3 pr-4">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="divide-y">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 pr-4 text-sm align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {!tickets.isLoading && (tickets.data?.items?.length ?? 0) === 0 && (
              <div className="py-6 text-sm text-gray-600">No tickets found.</div>
            )}
          </div>
        )}

        {updateStatus.isError ? (
          <div className="text-sm text-red-600">Failed to update ticket.</div>
        ) : null}

        <div className="flex items-center justify-between pt-2">
          <button
            className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || tickets.isLoading}
          >
            Previous
          </button>

          <div className="text-sm text-gray-600">
            Page {page} / {totalPages}
          </div>

          <button
            className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || tickets.isLoading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}