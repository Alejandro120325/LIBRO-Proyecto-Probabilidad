import { BookOpen, FileClock, Gauge, ListChecks, LogOut, ShieldCheck, Trophy, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import HeaderPreferences from "./HeaderPreferences.jsx";

const links = [
  { to: "/admin", label: "admin.summary", icon: Gauge, end: true },
  { to: "/admin/users", label: "common.users", icon: Users },
  { to: "/admin/results", label: "common.results", icon: ListChecks },
  { to: "/admin/leaderboard", label: "common.ranking", icon: Trophy },
  { to: "/admin/audit-logs", label: "admin.audit", icon: FileClock },
];

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate("/"); };

  return (
    <header className="admin-navbar">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <NavLink to="/admin" className="flex shrink-0 items-center gap-3">
          <span className="admin-brand-mark"><ShieldCheck /></span>
          <span className="hidden xl:block"><strong>{t("admin.brand")}</strong><small>{t("common.administration")}</small></span>
        </NavLink>
        <nav className="admin-nav-links" aria-label={t("header.adminNav")}>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `admin-nav-link ${isActive ? "admin-nav-active" : ""}`}>
              <Icon /><span className="hidden md:inline">{t(label)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <NavLink to="/book" className="icon-button" title={t("common.openBook")} aria-label={t("common.openBook")}><BookOpen /></NavLink>
          <div className="hidden text-right lg:block"><p className="text-sm font-bold text-amber-50">{user?.name}</p><p className="text-xs text-amber-300/60">{t("common.admin")}</p></div>
          <HeaderPreferences />
          <button onClick={signOut} className="icon-button" aria-label={t("common.logout")}><LogOut /></button>
        </div>
      </div>
    </header>
  );
}
