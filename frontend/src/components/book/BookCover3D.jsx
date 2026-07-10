import { BarChart3, BookOpen } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function BookCover3D({ compact = false }) {
  const { t } = useLanguage();
  return (
    <div className={`book-scene antique-book-scene ${compact ? "book-scene-compact" : ""}`} aria-label={t("landing.openLabel")}>
      <div className="book-object antique-book">
        <div className="book-back-cover" />
        <div className="book-pages antique-pages" />
        <div className="book-front leather-cover">
          <div className="leather-grain" />
          <span className="ornate-corner corner-tl" /><span className="ornate-corner corner-tr" /><span className="ornate-corner corner-bl" /><span className="ornate-corner corner-br" />
          <div className="gold-frame"><span /><span /></div>
          <div className="book-front-content antique-cover-content">
            <span className="book-kicker">{t("landing.coverEdition")}</span>
            <div className="arcane-seal academic-emblem"><BookOpen /><BarChart3 /><span /></div>
            <h2>{t("header.project").split(" & ")[0]}<br /><em>&</em> {t("header.project").split(" & ")[1] || "Statistics"}</h2>
            <p>{t("landing.coverTagline")}</p>
            <div className="book-cover-rule" aria-hidden="true"><span /></div>
          </div>
          <div className="book-clasp"><span /></div>
        </div>
        <div className="book-spine antique-spine"><span>{t("header.project").toUpperCase()}</span></div>
      </div>
      <div className="book-shadow antique-shadow" />
      <div className="book-glow" />
    </div>
  );
}
