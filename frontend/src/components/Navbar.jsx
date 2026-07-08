import { BarChart3, BookOpen, LayoutDashboard, LogOut, Trophy } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import HeaderPreferences from "./HeaderPreferences.jsx";

const studentLinks = [
  { to: "/dashboard", label: "header.home", icon: LayoutDashboard },
  { to: "/book", label: "header.book", icon: BookOpen },
  { to: "/my-results", label: "header.myResults", icon: BarChart3 },
  { to: "/leaderboard", label: "common.ranking", icon: Trophy },
];

const adminLinks = [
  { to: "/admin", label: "common.administration", icon: LayoutDashboard },
  { to: "/book", label: "header.book", icon: BookOpen },
  { to: "/admin/results", label: "common.results", icon: BarChart3 },
  { to: "/admin/leaderboard", label: "common.ranking", icon: Trophy },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
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
            <strong className="block text-sm tracking-tight text-white">{t("header.project")}</strong>
            <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">{t("header.subtitle")}</span>
          </span>
        </NavLink>

        <nav className="flex items-center gap-1 rounded-2xl border border-white/8 bg-white/[0.035] p-1" aria-label={t("header.mainNav")}>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="hidden md:inline">{t(label)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden text-right lg:block">
            <p className="max-w-36 truncate text-xs font-bold text-white">{user?.name}</p>
            <p className="text-xs text-slate-500">{t("header.session")}</p>
          </div>
          <HeaderPreferences />
          <button onClick={handleLogout} className="icon-button" aria-label={t("common.logout")} title={t("common.logout")}>
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
