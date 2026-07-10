import { AlertTriangle, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function ConfirmModal({ open, title, message, confirmText, danger = false, busy = false, onConfirm, onClose }) {
  const { t } = useLanguage();
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !busy && onClose()}>
      <section className="admin-modal max-w-md" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <button className="modal-close" onClick={onClose} disabled={busy} aria-label={t("common.close")}><X /></button>
        <span className={`modal-warning ${danger ? "modal-warning-danger" : ""}`}><AlertTriangle /></span>
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} disabled={busy} className="button button-ghost">{t("common.cancel")}</button>
          <button onClick={onConfirm} disabled={busy} className={`button ${danger ? "button-danger" : "button-primary"}`}>{busy ? t("auth.processing") : (confirmText || t("state.confirm"))}</button>
        </div>
      </section>
    </div>
  );
}
