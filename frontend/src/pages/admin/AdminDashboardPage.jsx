import { Activity, ArrowRight, FileClock, Gamepad2, ListChecks, ShieldAlert, Sparkles, Trophy, UserCheck, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminStatCard from "../../components/AdminStatCard.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import ErrorState from "../../components/ErrorState.jsx";
import LoadingState from "../../components/LoadingState.jsx";
import { getApiErrorMessage } from "../../services/api.js";
import { adminService } from "../../services/adminService.js";
import { formatDate } from "../../utils/format.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

const shortcuts = [
  { to: "/admin/users", labelKey: "admin.manageUsers", icon: Users },
  { to: "/admin/results", labelKey: "admin.viewResults", icon: ListChecks },
  { to: "/admin/leaderboard", labelKey: "admin.globalRanking", icon: Trophy },
  { to: "/admin/audit-logs", labelKey: "admin.openAudit", icon: FileClock },
];

export default function AdminDashboardPage() {
  const { t, translateText } = useLanguage();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { dashboard: data } = await adminService.getDashboard();
      setDashboard(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  if (loading) return <LoadingState title={t("admin.loading")} message={t("admin.loadingText")} />;
  if (error || !dashboard) return <ErrorState title={t("admin.error")} message={t("admin.errorText")} onRetry={loadDashboard} />;

  const latestUsers = Array.isArray(dashboard.latestUsers) ? dashboard.latestUsers : [];
  const latestResults = Array.isArray(dashboard.latestResults) ? dashboard.latestResults : [];
  const latestAuditLogs = Array.isArray(dashboard.latestAuditLogs) ? dashboard.latestAuditLogs : [];

  return (
    <div className="page-enter space-y-8">
      <header className="admin-hero"><div><div className="fantasy-eyebrow"><Sparkles /> {t("admin.control")}</div><h1>{t("admin.dashboard")}</h1><p>{t("admin.dashboardText")}</p></div><ShieldAlert /></header>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <AdminStatCard label={t("common.users")} value={dashboard.totalUsers} detail={t("admin.registered")} icon={Users} />
        <AdminStatCard label={t("common.active")} value={dashboard.activeUsers} detail={t("admin.withAccess")} icon={UserCheck} tone="green" />
        <AdminStatCard label={t("common.suspended")} value={dashboard.suspendedUsers} detail={t("admin.withoutAccess")} icon={ShieldAlert} tone="red" />
        <AdminStatCard label={t("common.results")} value={dashboard.totalResults} detail={t("admin.stored")} icon={ListChecks} tone="violet" />
        <AdminStatCard label={t("dashboard.average")} value={`${Math.round(dashboard.globalAverage)}%`} detail={t("admin.globalPerformance")} icon={Activity} tone="blue" />
        <AdminStatCard label={t("book.games")} value={dashboard.completedGames} detail={t("admin.completed")} icon={Gamepad2} tone="green" />
      </section>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{shortcuts.map(({ to, labelKey, icon: Icon }) => <Link key={to} to={to} className="admin-shortcut"><Icon /><span>{t(labelKey)}</span><ArrowRight /></Link>)}</section>
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="admin-panel"><div className="admin-panel-heading"><div><p>{t("admin.newMembers")}</p><h2>{t("admin.latestUsers")}</h2></div><Link to="/admin/users">{t("admin.viewAll")}</Link></div>{latestUsers.length ? <div className="admin-list">{latestUsers.map((user) => <div key={user.id}><span className="admin-avatar">{user.name.charAt(0)}</span><div><strong>{user.name}</strong><small>{user.email}</small></div><span className={`status-badge status-${user.status}`}>{user.status === "active" ? t("common.active") : t("common.suspended")}</span></div>)}</div> : <EmptyState icon={Users} title={t("admin.noRecentUsers")} message={t("admin.noRecentUsersText")} />}</div>
        <div className="admin-panel"><div className="admin-panel-heading"><div><p>{t("admin.academicActivity")}</p><h2>{t("admin.latestResults")}</h2></div><Link to="/admin/results">{t("admin.viewAll")}</Link></div>{latestResults.length ? <div className="admin-list">{latestResults.map((result) => <div key={result.id}><span className="admin-avatar">U{result.unitId}</span><div><strong>{result.userName}</strong><small>{translateText(result.gameType)}</small></div><b className="text-amber-300">{Math.round(result.percentage)}%</b></div>)}</div> : <EmptyState icon={ListChecks} title={t("admin.noRecentResults")} message={t("admin.noRecentResultsText")} />}</div>
      </section>
      <section className="admin-panel"><div className="admin-panel-heading"><div><p>{t("admin.traceability")}</p><h2>{t("admin.recentEvents")}</h2></div><Link to="/admin/audit-logs">{t("admin.fullAudit")}</Link></div>{latestAuditLogs.length ? <div className="audit-timeline">{latestAuditLogs.map((log) => <div key={log.id}><span /><div><strong>{log.action}</strong><p>{log.description}</p><small>{log.userName} · {formatDate(log.createdAt)}</small></div></div>)}</div> : <EmptyState icon={FileClock} title={t("admin.noRecentEvents")} message={t("admin.noRecentEventsText")} />}</section>
    </div>
  );
}
