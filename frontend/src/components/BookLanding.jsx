import { ArrowRight, BookOpen, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import AppFooter from "./AppFooter.jsx";
import AuthRequiredModal from "./AuthRequiredModal.jsx";
import ClosedBook3D from "./ClosedBook3D.jsx";
import HeaderPreferences from "./HeaderPreferences.jsx";
import AcademicBackdrop from "./AcademicBackdrop.jsx";

export default function BookLanding() {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const panelPath = user?.role === "admin" ? "/admin" : "/dashboard";

  const openBook = () => {
    if (!isAuthenticated) setShowAuthModal(true);
    else navigate("/book");
  };

  const signOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="fantasy-landing book-only-landing min-h-screen overflow-hidden text-stone-100">
      <div className="library-vignette" />
      <AcademicBackdrop />
      <header className="relative z-30 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="fantasy-brand"><span><BookOpen /></span><div><strong>{t("header.project")}</strong><small>{t("header.subtitle")}</small></div></Link>
        <nav className="flex items-center gap-2" aria-label="Acceso">
          {isAuthenticated && <><button type="button" onClick={openBook} className="button button-primary button-sm"><BookOpen />{t("common.openBook")}</button><Link to={panelPath} className="button button-ghost button-sm"><LayoutDashboard />{user?.role === "admin" ? t("common.administration") : t("common.dashboard")}</Link><button type="button" onClick={signOut} className="icon-button" aria-label={t("common.logout")} title={t("common.logout")}><LogOut /></button></>}
          <HeaderPreferences />
        </nav>
      </header>

      <main className="closed-book-hero relative z-10 mx-auto max-w-5xl px-5 pb-10">
        <button className="closed-book-trigger" onClick={openBook} aria-label={t("landing.openLabel")}>
          <ClosedBook3D />
        </button>
        <button onClick={openBook} className="button button-primary closed-book-button">{t("common.openBook")} <ArrowRight /></button>
      </main>
      <AppFooter />
      <AuthRequiredModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
