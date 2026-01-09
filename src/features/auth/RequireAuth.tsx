import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "./session";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}