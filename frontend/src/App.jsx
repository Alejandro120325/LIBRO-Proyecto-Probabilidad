import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleRoute from "./components/RoleRoute.jsx";
import ThemeSwitcher from "./components/ThemeSwitcher.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import BookPage from "./pages/BookPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import AdminAuditLogsPage from "./pages/admin/AdminAuditLogsPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminLeaderboardPage from "./pages/admin/AdminLeaderboardPage.jsx";
import AdminResultsPage from "./pages/admin/AdminResultsPage.jsx";
import AdminUserDetailPage from "./pages/admin/AdminUserDetailPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/book" element={<BookPage />} />
            <Route path="/book/unit/:id" element={<BookPage />} />
            <Route path="/game/bayes" element={<GamePage unit={1} />} />
            <Route path="/game/statistics" element={<GamePage unit={2} />} />
            <Route path="/game/random-variables" element={<GamePage unit={3} />} />
          </Route>

          <Route element={<RoleRoute role="student" />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/my-results" element={<ResultsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Route>
          </Route>

          <Route element={<RoleRoute role="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
              <Route path="/admin/results" element={<AdminResultsPage />} />
              <Route path="/admin/leaderboard" element={<AdminLeaderboardPage />} />
              <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/registro" element={<Navigate to="/register" replace />} />
        <Route path="/libro" element={<Navigate to="/book" replace />} />
        <Route path="/resultados" element={<Navigate to="/my-results" replace />} />
        <Route path="/ranking" element={<Navigate to="/leaderboard" replace />} />
        <Route path="/juego/1" element={<Navigate to="/game/bayes" replace />} />
        <Route path="/juego/2" element={<Navigate to="/game/statistics" replace />} />
        <Route path="/juego/3" element={<Navigate to="/game/random-variables" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ThemeSwitcher />
    </>
  );
}
