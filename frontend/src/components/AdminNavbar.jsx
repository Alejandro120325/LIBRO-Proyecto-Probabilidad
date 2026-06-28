import { BookOpen, FileClock, Gauge, ListChecks, LogOut, ShieldCheck, Trophy, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/admin", label: "Resumen", icon: Gauge, end: true },
  { to: "/admin/users", label: "Usuarios", icon: Users },
  { to: "/admin/results", label: "Resultados", icon: ListChecks },
  { to: "/admin/leaderboard", label: "Ranking", icon: Trophy },
  { to: "/admin/audit-logs", label: "Bitácora", icon: FileClock },
];

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate("/"); };

  return (
    <header className="admin-navbar">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <NavLink to="/admin" className="flex shrink-0 items-center gap-3">
          <span className="admin-brand-mark"><ShieldCheck /></span>
          <span className="hidden xl:block"><strong>Archivo del Guardián</strong><small>Administración</small></span>
        </NavLink>
        <nav className="admin-nav-links" aria-label="Administración">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `admin-nav-link ${isActive ? "admin-nav-active" : ""}`}>
              <Icon /><span className="hidden md:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <NavLink to="/book" className="icon-button" title="Abrir libro" aria-label="Abrir libro"><BookOpen /></NavLink>
          <div className="hidden text-right lg:block"><p className="text-xs font-bold text-amber-50">{user?.name}</p><p className="text-[10px] text-amber-300/60">Administrador</p></div>
          <button onClick={signOut} className="icon-button" aria-label="Cerrar sesión"><LogOut /></button>
        </div>
      </div>
    </header>
  );
}
