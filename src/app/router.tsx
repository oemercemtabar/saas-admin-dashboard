import { createBrowserRouter, Navigate } from "react-router-dom";
import RequireAuth from "../features/auth/RequireAuth";
import AppShell from "../app/layouts/AppShell.tsx";
import Dashboard from "../app/pages/Dashboard.tsx";
import Users from "../app/pages/Users.tsx";
import Tickets from "../app/pages/Tickets.tsx";
import Health from "../app/pages/Health.tsx";
import Settings from "../app/pages/Settings.tsx";
import Login from "../app/pages/Login.tsx";
import ErrorPage from "../app/pages/ErrorPage.tsx";
export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "users", element: <Users /> },
      { path: "tickets", element: <Tickets /> },
      { path: "health", element: <Health /> },
      { path: "settings", element: <Settings /> },
    ],
  }
]);