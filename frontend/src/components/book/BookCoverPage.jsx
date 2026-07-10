import { BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function BookCoverPage() {
  const { t } = useLanguage();
  return (
    <div className="internal-cover-page">
      <div className="internal-ornament"><Sparkles /></div>
      <p>{t("book.coverPeriod")}</p>
      <BookOpen className="internal-cover-icon" />
      <h1>{t("book.title")}</h1>
      <h2>{t("book.subtitle")}</h2>
      <div className="internal-divider"><span /></div>
      <div className="book-authors"><strong><GraduationCap /> {t("book.authors")}</strong><span>Alejandro Ojeda</span><span>Juan Figueroa</span><span>Josue Vele</span></div>
    </div>
  );
}
