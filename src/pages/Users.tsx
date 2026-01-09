import { useMemo, useState } from "react";
import { useUsers } from "../features/users/queries";
import type { UserRow } from "../features/users/types";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

function StatusPill({ status }: { status: UserRow["status"] }) {
  const cls =
    status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
}

export default function Users() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<"all" | "admin" | "client_admin" | "user">("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const users = useUsers({ q, role, page, pageSize });

  const columns = useMemo<ColumnDef<UserRow>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-700">{String(getValue()).replace("_", " ")}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusPill status={row.original.status} />,
      },
      {
        accessorKey: "lastSeen",
        header: "Last seen",
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-600">
            {new Date(String(getValue())).toLocaleDateString()}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: users.data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const total = users.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-gray-600">Search and manage user accounts.</p>
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
              placeholder="Search name or email..."
              className="w-full md:w-72 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value as any);
                setPage(1);
              }}
              className="rounded-xl border px-3 py-2 text-sm"
            >
              <option value="all">All roles</option>
              <option value="admin">Admin</option>
              <option value="client_admin">Client admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {users.isLoading ? "Loading…" : `${total} users`}
          </div>
        </div>

        {users.isError ? (
          <div className="text-red-600 text-sm">Failed to load users.</div>
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
                      <td key={cell.id} className="py-3 pr-4 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {!users.isLoading && (users.data?.items?.length ?? 0) === 0 && (
              <div className="py-6 text-sm text-gray-600">No users found.</div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || users.isLoading}
          >
            Previous
          </button>

          <div className="text-sm text-gray-600">
            Page {page} / {totalPages}
          </div>

          <button
            className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || users.isLoading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}