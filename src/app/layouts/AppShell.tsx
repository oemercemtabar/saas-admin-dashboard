import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { navItems } from "../nav";
import { clearToken, getUser } from "../../features/auth/session";

export default function AppShell() {
  const navigate = useNavigate();
  const user = getUser();

  function onLogout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-white">
          <div className="p-4 border-b">
            <div className="text-lg font-semibold">OpsPulse</div>
            <div className="text-xs text-gray-500">Admin Dashboard</div>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "block rounded-xl px-3 py-2 text-sm",
                    isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b bg-white">
            <div className="font-medium">Client Performance Console</div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                {user ? `${user.name} • ${user.role}` : "Admin"}
              </div>

              <button
                onClick={onLogout}
                className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="min-h-[calc(100vh-56px)]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}