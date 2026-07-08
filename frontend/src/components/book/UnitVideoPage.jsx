import { Play, Video } from "lucide-react";
import { getChapter } from "../../data/chapters.js";
import { unitDetails } from "../../data/bookPages.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function UnitVideoPage({ unit }) {
  const chapter = getChapter(unit);
  const { t, translateText } = useLanguage();
  return (
    <div className="unit-video-page">
      <p className="book-label">{t("book.chapterVideo", { number: unit })}</p>
      <h1>{t("book.video")}</h1>
      <div className="embedded-video-placeholder"><div className="video-runes" /><span><Play /></span><h2>{translateText(chapter.title)}</h2><p>{translateText(unitDetails[unit].videoPlaceholder)}</p><small><Video /> {t("book.videoSpace")}</small></div>
      <p className="video-note">{t("book.videoNote")}</p>
    </div>
  );
}
