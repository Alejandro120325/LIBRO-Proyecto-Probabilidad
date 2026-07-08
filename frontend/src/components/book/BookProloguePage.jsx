import { Compass, Gamepad2, ScrollText, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function BookProloguePage() {
  const { t } = useLanguage();
  return (
    <div className="prologue-page">
      <p className="book-label">{t("book.before")}</p>
      <h1>{t("book.prologue")}</h1>
      <div className="dropcap-copy"><span>{t("book.prologueInitial")}</span><p>{t("book.prologueText")}</p></div>
      <p className="book-copy mt-4">{t("book.prologueDetail")}</p>
      <div className="prologue-steps">
        <div><Compass /><span><strong>{t("book.navigate")}</strong>{t("book.navigateText")}</span></div>
        <div><ScrollText /><span><strong>{t("book.study")}</strong>{t("book.studyText")}</span></div>
        <div><Gamepad2 /><span><strong>{t("book.practice")}</strong>{t("book.practiceText")}</span></div>
      </div>
      <blockquote><Sparkles /> {t("book.prologueQuote")}</blockquote>
    </div>
  );
}
