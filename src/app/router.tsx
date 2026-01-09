import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import RequireAuth from "../features/auth/RequireAuth";
import { getToken } from "../features/auth/session";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Tickets from "./pages/Tickets";
import Health from "./pages/Health";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: getToken() ? <Navigate to="/dashboard" replace /> : <Login />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "users", element: <Users /> },
      { path: "tickets", element: <Tickets /> },
      { path: "health", element: <Health /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);