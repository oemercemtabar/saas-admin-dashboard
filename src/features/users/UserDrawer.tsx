import { useEffect } from "react";
import { useUser } from "./useUser";

export default function UserDrawer({
  userId,
  onClose,
}: {
  userId: string | null;
  onClose: () => void;
}) {
  const detail = useUser(userId);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!userId) return null;

  const data = detail.data; // may be undefined until success

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl border-l">
        <div className="h-14 px-4 border-b flex items-center justify-between">
          <div className="font-semibold">User Details</div>
          <button
            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-auto h-[calc(100vh-56px)]">
          {detail.isLoading ? (
            <div className="text-gray-600">Loading user…</div>
          ) : detail.isError ? (
            <div className="text-red-600">Failed to load user.</div>
          ) : detail.isSuccess && data ? (
            <>
              <div className="rounded-2xl border p-4">
                <div className="text-lg font-semibold">{data.user.name}</div>
                <div className="mt-1 text-sm text-gray-600">{data.user.email}</div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Role</div>
                    <div className="font-medium">{data.user.role.replace("_", " ")}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Status</div>
                    <div className="font-medium">{data.user.status}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Last seen</div>
                    <div className="font-medium">
                      {new Date(data.user.lastSeen).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">User ID</div>
                    <div className="font-medium">{data.user.id}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border p-4">
                <div className="font-semibold">Recent Sessions</div>
                <div className="mt-3 space-y-3">
                  {data.sessions.map((s) => (
                    <div key={s.id} className="rounded-xl border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">
                            {s.brand} — {s.model}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {new Date(s.ts).toLocaleString()}
                          </div>
                        </div>

                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            s.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-gray-600">
                        Foot: <span className="font-medium">{s.footShape}</span> • Toe:{" "}
                        <span className="font-medium">{s.toeShape}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}