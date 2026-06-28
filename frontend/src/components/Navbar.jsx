import { BarChart3, BookOpen, LayoutDashboard, LogOut, Trophy } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const studentLinks = [
  { to: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { to: "/book", label: "Libro", icon: BookOpen },
  { to: "/my-results", label: "Resultados", icon: BarChart3 },
  { to: "/leaderboard", label: "Ranking", icon: Trophy },
];

const adminLinks = [
  { to: "/admin", label: "Administración", icon: LayoutDashboard },
  { to: "/book", label: "Libro", icon: BookOpen },
  { to: "/admin/results", label: "Resultados", icon: BarChart3 },
  { to: "/admin/leaderboard", label: "Ranking", icon: Trophy },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === "admin" ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#050816]/82 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to={user?.role === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-3" aria-label="Ir al panel principal">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-600 text-[#251607] shadow-lg shadow-amber-500/20">
            <BookOpen className="size-5" strokeWidth={2.4} />
          </span>
          <span className="hidden sm:block">
            <strong className="block text-sm tracking-tight text-white">Probabilidad 3D</strong>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">Crónica interactiva</span>
          </span>
        </NavLink>

        <nav className="flex items-center gap-1 rounded-2xl border border-white/8 bg-white/[0.035] p-1" aria-label="Navegación principal">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="hidden md:inline">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden text-right lg:block">
            <p className="max-w-36 truncate text-xs font-bold text-white">{user?.name}</p>
            <p className="text-[10px] text-slate-500">Sesión activa</p>
          </div>
          <button onClick={handleLogout} className="icon-button" aria-label="Cerrar sesión" title="Cerrar sesión">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
