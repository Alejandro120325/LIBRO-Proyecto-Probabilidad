import { ArrowLeft, ArrowRight, BarChart3, List, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function BookNavigation({ current, total, isFirst, isLast, turning, onPrevious, onNext, onIndex, onClose, onResults }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  return (
    <div className="real-book-navigation">
      <button onClick={onPrevious} disabled={isFirst || turning}><ArrowLeft />{t("common.previous")}</button>
      <button onClick={onIndex} disabled={turning}><List />{t("common.index")}</button>
      <span className="book-folio">{current} / {total}</span>
      <button onClick={onResults} disabled={turning}><BarChart3 />{user?.role === "admin" ? t("common.results") : t("book.myResults")}</button>
      <button onClick={onClose}><X />{t("common.close")}</button>
      <button onClick={onNext} disabled={isLast || turning}>{t("common.next")}<ArrowRight /></button>
    </div>
  );
}
