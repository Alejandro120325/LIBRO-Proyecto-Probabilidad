import { Lightbulb, MapPin, Target } from "lucide-react";
import { getChapter } from "../../data/chapters.js";
import { unitDetails } from "../../data/bookPages.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function UnitIntroPage({ unit }) {
  const chapter = getChapter(unit);
  const { t, translateObject, translateText } = useLanguage();
  const localizedChapter = translateObject(chapter);
  return (
    <div className="unit-book-page">
      <p className="book-label">{t("book.chapter", { number: unit })}</p>
      <h1>{translateText(unitDetails[unit].heading)}</h1>
      <p className="chapter-lead">{localizedChapter.subtitle}</p>
      <section><h2><MapPin />{t("book.introduction")}</h2><p>{localizedChapter.definition}</p></section>
      <section><h2><Lightbulb />{t("book.simple")}</h2><p>{localizedChapter.explanation}</p></section>
      <section><h2><Target />{t("book.purpose")}</h2><p>{localizedChapter.serves}</p></section>
      <div className="applications-grid">{localizedChapter.applications.map((item) => <span key={item}>{item}</span>)}</div>
    </div>
  );
}
