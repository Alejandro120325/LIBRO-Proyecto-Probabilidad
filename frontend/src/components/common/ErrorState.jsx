import { AlertTriangle, RefreshCw } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function ErrorState({ title, message, onRetry }) {
  const { t } = useLanguage();
  return (
    <section className="ui-state ui-state-error" role="alert">
      <span className="ui-state-icon"><AlertTriangle aria-hidden="true" /></span>
      <div><h2>{title || t("state.error")}</h2><p>{message}</p></div>
      {onRetry && <button type="button" className="button button-outline button-sm" onClick={onRetry}><RefreshCw />{t("common.retry")}</button>}
    </section>
  );
}
