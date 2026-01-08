import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShell from "./AppShell.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import Users from "../pages/Users.tsx";
import Tickets from "../pages/Tickets.tsx";
import Health from "../pages/Health.tsx";
import Settings from "../pages/Settings.tsx";
import Login from "../pages/Login.tsx";

export const router = createBrowserRouter([
  { path: "/login", element: <Login/>},
  { path: "/",
    element: <AppShell/>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard/> },
      { path: "user", element: <Users/> },
      { path: "tickets", element: <Tickets/> },
      { path: "health", element: <Health/> },
      { path: "settings", element: <Settings/> },
    ],
  },
]);