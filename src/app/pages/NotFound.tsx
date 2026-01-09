import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-sm space-y-4">
        <div className="text-2xl font-semibold">404 — Page not found</div>
        <div className="text-sm text-gray-600">
          The page you’re looking for doesn’t exist (or was moved).
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="rounded-xl bg-black text-white px-4 py-2 text-sm"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/tickets"
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Go to Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}