import { Clock3 } from "lucide-react";
import { formatDate, formatTime } from "../utils/format.js";

export default function ResultCard({ result, compact = false }) {
  const scoreColor = result.percentage >= 80 ? "text-emerald-300" : result.percentage >= 60 ? "text-cyan-300" : "text-amber-300";

  return (
    <article className={`result-card ${compact ? "result-card-compact" : ""}`}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="unit-pill">Unidad {result.unitId}</span>
          <span className="text-xs text-slate-500">{formatDate(result.createdAt)}</span>
        </div>
        <h3 className="mt-2 truncate font-bold text-white">{result.gameType}</h3>
        <p className="mt-1 text-xs text-slate-400">{result.score}/{result.totalQuestions} respuestas · <Clock3 className="inline size-3" /> {formatTime(result.timeSeconds)}</p>
      </div>
      <div className="text-right">
        <strong className={`text-2xl font-black ${scoreColor}`}>{Math.round(result.percentage)}%</strong>
        <span className="block text-[10px] uppercase tracking-widest text-slate-500">Puntaje</span>
      </div>
    </article>
  );
}
