import { ArrowRight, BookOpen, LayoutDashboard, LogIn, ScrollText } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthRequiredModal from "./AuthRequiredModal.jsx";
import ClosedBook3D from "./ClosedBook3D.jsx";

export default function BookLanding() {
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const panelPath = user?.role === "admin" ? "/admin" : "/dashboard";

  const openBook = () => {
    if (!isAuthenticated) setShowAuthModal(true);
    else navigate("/book");
  };

  return (
    <div className="fantasy-landing book-only-landing min-h-screen overflow-hidden text-stone-100">
      <div className="library-vignette" /><div className="magic-particles" /><div className="candle-glow candle-left" /><div className="candle-glow candle-right" />
      <header className="relative z-30 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="fantasy-brand"><span><BookOpen /></span><div><strong>Probabilidad & Estadística</strong><small>Libro Interactivo 3D</small></div></Link>
        <nav className="flex items-center gap-2" aria-label="Acceso">
          {isAuthenticated ? <Link to={panelPath} className="button button-ghost button-sm"><LayoutDashboard />{user?.role === "admin" ? "Administración" : "Mi progreso"}</Link> : <><Link to="/login" className="button button-ghost button-sm"><LogIn />Iniciar sesión</Link><Link to="/register" className="button button-outline button-sm hidden sm:inline-flex"><ScrollText />Registrarse</Link></>}
        </nav>
      </header>

      <main className="closed-book-hero relative z-10 mx-auto max-w-5xl px-5 pb-10">
        <p className="closed-book-caption">Una aventura entre datos, evidencia y azar</p>
        <button className="closed-book-trigger" onClick={openBook} aria-label="Abrir Libro Interactivo 3D">
          <ClosedBook3D />
        </button>
        <button onClick={openBook} className="button button-primary closed-book-button">Abrir libro <ArrowRight /></button>
        {!isAuthenticated && <p className="closed-book-hint">Inicia sesión para descubrir sus capítulos.</p>}
      </main>
      <AuthRequiredModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
