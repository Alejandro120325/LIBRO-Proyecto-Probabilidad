import { KeyRound, ScrollText, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function AuthRequiredModal({ open, onClose }) {
  const { t } = useLanguage();
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="auth-required-modal" role="dialog" aria-modal="true" aria-labelledby="auth-required-title">
        <button onClick={onClose} className="modal-close" aria-label={t("common.close")}><X /></button>
        <div className="modal-book-seal"><KeyRound /></div>
        <p className="book-label">{t("modal.protected")}</p>
        <h2 id="auth-required-title">{t("modal.accessTitle")}</h2>
        <p>{t("modal.accessText")}</p>
        <div className="auth-required-actions mt-6 grid gap-3 sm:grid-cols-2">
          <Link to="/login" className="button button-primary"><KeyRound />{t("modal.login")}</Link>
          <Link to="/register" className="button button-outline"><ScrollText />{t("modal.register")}</Link>
          <button type="button" onClick={onClose} className="button button-ghost sm:col-span-2">{t("common.cancel")}</button>
        </div>
      </section>
    </div>
  );
}
