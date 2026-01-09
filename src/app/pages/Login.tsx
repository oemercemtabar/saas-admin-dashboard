import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiPost } from "../../api/client";
import { setToken } from "../../features/auth/session";

export default function Login() {
  const [email, setEmail] = useState("admin@opspulse.dev");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const loc = useLocation() as any;
  const from = loc.state?.from ?? "/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiPost<{ token: string }>("/auth/login", { email, password });
      setToken(data.token);
      nav(from, { replace: true });
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-sm">
        <div className="text-xl font-semibold">Sign in</div>
        <div className="mt-1 text-sm text-gray-600">Use demo credentials to enter.</div>

        <div className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-2 text-sm disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-xs text-gray-500">
            Demo: admin@opspulse.dev / admin123
          </div>
        </div>
      </form>
    </div>
  );
}