import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = typeof error.data === "string" ? error.data : message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <div className="text-xl font-semibold">{title}</div>
        <div className="mt-2 text-sm text-gray-600">{message}</div>

        <div className="mt-6 flex gap-3">
          <Link
            to="/dashboard"
            className="rounded-xl bg-black px-4 py-2 text-sm text-white"
          >
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
}