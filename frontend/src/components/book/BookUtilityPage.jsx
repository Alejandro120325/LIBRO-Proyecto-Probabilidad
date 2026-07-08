import { BarChart3, BookOpenCheck, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function BookUtilityPage({ type }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  if (type === "epilogue") return <div className="epilogue-page"><Sparkles /><p className="book-label">{t("book.endJourney")}</p><h1>{t("book.epilogue")}</h1><p>{t("book.epilogueText")}</p><BookOpenCheck /><blockquote>{t("book.epilogueQuote")}</blockquote></div>;

  const admin = user?.role === "admin";
  const results = type === "results";
  const path = admin
    ? results ? "/admin/results" : "/admin/leaderboard"
    : results ? "/my-results" : "/leaderboard";
  const Icon = results ? BarChart3 : Trophy;
  return (
    <div className="utility-book-page">
      <Icon />
      <p className="book-label">{results ? t("dashboard.journey") : t("book.community")}</p>
      <h1>{results ? t("common.results") : t("common.ranking")}</h1>
      <p>{results ? t("book.resultsText") : t("book.rankingText")}</p>
      <Link to={path} className="book-game-button">{results ? t("book.openResults") : t("book.openRanking")}</Link>
    </div>
  );
}
