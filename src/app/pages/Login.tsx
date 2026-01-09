import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken, setUser } from "../../features/auth/session";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@opspulse.dev");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Login failed");
      }

      const data = (await res.json()) as {
        token: string;
        user: { id: string; name: string; role: string };
      };

      setToken(data.token);
      setUser(data.user);

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <div className="text-xl font-semibold">Sign in</div>
        <div className="mt-1 text-sm text-gray-600">Use demo credentials to access the console.</div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block space-y-1">
            <div className="text-sm font-medium">Email</div>
            <input
              className="w-full rounded-xl border px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="block space-y-1">
            <div className="text-sm font-medium">Password</div>
            <input
              className="w-full rounded-xl border px-3 py-2 text-sm"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-2 text-sm disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <div className="text-xs text-gray-500">
            Demo: admin@opspulse.dev / admin123
          </div>
        </form>
      </div>
    </div>
  );
}