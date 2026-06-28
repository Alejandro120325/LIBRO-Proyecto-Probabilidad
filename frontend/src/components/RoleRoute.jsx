import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AccessDeniedPage from "../pages/AccessDeniedPage.jsx";

export default function RoleRoute({ role }) {
  const { user } = useAuth();
  if (user?.role === role) return <Outlet />;
  if (role === "admin") return <AccessDeniedPage />;
  return <Navigate to="/admin" replace />;
}
