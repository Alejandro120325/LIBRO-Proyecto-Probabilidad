import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Loading from "./Loading.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();

  if (loading) return <Loading fullScreen label={t("state.verifying")} />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
