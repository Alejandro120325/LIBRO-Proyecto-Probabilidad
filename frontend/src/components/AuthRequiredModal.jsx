import { KeyRound, ScrollText, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthRequiredModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="auth-required-modal" role="dialog" aria-modal="true" aria-labelledby="auth-required-title">
        <button onClick={onClose} className="modal-close" aria-label="Cerrar"><X /></button>
        <div className="modal-book-seal"><KeyRound /></div>
        <p className="book-label">Acceso al conocimiento</p>
        <h2 id="auth-required-title">Este libro está sellado.</h2>
        <p>Para abrir este libro debes iniciar sesión o registrarte.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link to="/login" className="button button-primary"><KeyRound />Iniciar sesión</Link>
          <Link to="/register" className="button button-outline"><ScrollText />Registrarse</Link>
        </div>
      </section>
    </div>
  );
}
