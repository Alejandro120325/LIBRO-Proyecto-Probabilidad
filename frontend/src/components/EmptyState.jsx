import { Inbox } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function EmptyState({ title, message, action, icon: Icon = Inbox }) {
  const { t } = useLanguage();
  return (
    <section className="ui-state ui-state-empty">
      <span className="ui-state-icon"><Icon aria-hidden="true" /></span>
      <div><h2>{title || t("state.empty")}</h2><p>{message}</p></div>
      {action}
    </section>
  );
}
