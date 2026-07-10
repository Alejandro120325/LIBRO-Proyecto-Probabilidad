import { LoaderCircle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function LoadingState({ title, message }) {
  const { t } = useLanguage();
  return (
    <section className="ui-state" role="status" aria-live="polite">
      <span className="ui-state-icon"><LoaderCircle className="animate-spin" aria-hidden="true" /></span>
      <div><h2>{title || t("state.loading")}</h2><p>{message || t("state.loadingText")}</p></div>
    </section>
  );
}
