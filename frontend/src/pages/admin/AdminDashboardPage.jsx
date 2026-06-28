import { Activity, ArrowRight, FileClock, Gamepad2, ListChecks, ShieldAlert, Sparkles, Trophy, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminStatCard from "../../components/AdminStatCard.jsx";
import Alert from "../../components/Alert.jsx";
import Loading from "../../components/Loading.jsx";
import { getApiErrorMessage } from "../../services/api.js";
import { adminService } from "../../services/adminService.js";
import { formatDate } from "../../utils/format.js";

const shortcuts = [
  { to: "/admin/users", label: "Gestionar usuarios", icon: Users },
  { to: "/admin/results", label: "Ver resultados", icon: ListChecks },
  { to: "/admin/leaderboard", label: "Ranking global", icon: Trophy },
  { to: "/admin/audit-logs", label: "Abrir bitácora", icon: FileClock },
];

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { adminService.getDashboard().then(({ dashboard: data }) => setDashboard(data)).catch((err) => setError(getApiErrorMessage(err))); }, []);
  if (!dashboard && !error) return <Loading label="Abriendo el archivo administrativo" />;

  return (
    <div className="page-enter space-y-8">
      <header className="admin-hero"><div><div className="fantasy-eyebrow"><Sparkles /> Centro de control</div><h1>Archivo del Guardián</h1><p>Supervisa usuarios, aprendizaje y eventos críticos desde una vista central.</p></div><ShieldAlert /></header>
      {error && <Alert>{error}</Alert>}
      {dashboard && <>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <AdminStatCard label="Usuarios" value={dashboard.totalUsers} detail="Registrados" icon={Users} />
          <AdminStatCard label="Activos" value={dashboard.activeUsers} detail="Con acceso" icon={UserCheck} tone="green" />
          <AdminStatCard label="Suspendidos" value={dashboard.suspendedUsers} detail="Sin acceso" icon={ShieldAlert} tone="red" />
          <AdminStatCard label="Resultados" value={dashboard.totalResults} detail="Guardados" icon={ListChecks} tone="violet" />
          <AdminStatCard label="Promedio" value={`${Math.round(dashboard.globalAverage)}%`} detail="Rendimiento global" icon={Activity} tone="blue" />
          <AdminStatCard label="Juegos" value={dashboard.completedGames} detail="Completados" icon={Gamepad2} tone="green" />
        </section>
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{shortcuts.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className="admin-shortcut"><Icon /><span>{label}</span><ArrowRight /></Link>)}</section>
        <section className="grid gap-6 xl:grid-cols-2">
          <div className="admin-panel"><div className="admin-panel-heading"><div><p>Nuevos miembros</p><h2>Últimos usuarios</h2></div><Link to="/admin/users">Ver todos</Link></div><div className="admin-list">{dashboard.latestUsers.map((user) => <div key={user.id}><span className="admin-avatar">{user.name.charAt(0)}</span><div><strong>{user.name}</strong><small>{user.email}</small></div><span className={`status-badge status-${user.status}`}>{user.status === "active" ? "Activo" : "Suspendido"}</span></div>)}</div></div>
          <div className="admin-panel"><div className="admin-panel-heading"><div><p>Actividad académica</p><h2>Últimos resultados</h2></div><Link to="/admin/results">Ver todos</Link></div><div className="admin-list">{dashboard.latestResults.length ? dashboard.latestResults.map((result) => <div key={result.id}><span className="admin-avatar">U{result.unitId}</span><div><strong>{result.userName}</strong><small>{result.gameType}</small></div><b className="text-amber-300">{Math.round(result.percentage)}%</b></div>) : <p className="admin-empty">Todavía no hay resultados.</p>}</div></div>
        </section>
        <section className="admin-panel"><div className="admin-panel-heading"><div><p>Trazabilidad</p><h2>Eventos recientes</h2></div><Link to="/admin/audit-logs">Bitácora completa</Link></div><div className="audit-timeline">{dashboard.latestAuditLogs.map((log) => <div key={log.id}><span /><div><strong>{log.action}</strong><p>{log.description}</p><small>{log.userName} · {formatDate(log.createdAt)}</small></div></div>)}</div></section>
      </>}
    </div>
  );
}
