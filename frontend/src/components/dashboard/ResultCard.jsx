import { Clock3 } from "lucide-react";
import { formatDate, formatTime } from "../../utils/format.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function ResultCard({ result, compact = false }) {
  const { t, translateText } = useLanguage();
  const scoreColor = result.percentage >= 80 ? "text-emerald-300" : result.percentage >= 60 ? "text-cyan-300" : "text-amber-300";

  return (
    <article className={`result-card hover-lift ${compact ? "result-card-compact" : ""}`}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="unit-pill">{t("common.unit")} {result.unitId}</span>
          <span className="text-xs text-slate-500">{formatDate(result.createdAt)}</span>
        </div>
        <h3 className="mt-2 truncate font-bold text-white">{translateText(result.gameType)}</h3>
        <p className="mt-1 text-xs text-slate-400">{result.score}/{result.totalQuestions} {t("state.answers")} · <Clock3 className="inline size-3" /> {formatTime(result.timeSeconds)}</p>
      </div>
      <div className="text-right">
        <strong className={`text-2xl font-black ${scoreColor}`}>{Math.round(result.percentage)}%</strong>
        <span className="block text-xs uppercase tracking-wider text-slate-500">{t("common.score")}</span>
      </div>
    </article>
  );
}
