import { Crown, Medal, Trophy, UserRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getApiErrorMessage } from "../services/api.js";
import { resultService } from "../services/resultService.js";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { leaderboard } = await resultService.getLeaderboard();
      setLeaders(Array.isArray(leaderboard) ? leaderboard : []);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadLeaderboard(); }, [loadLeaderboard]);

  if (loading) return <LoadingState title={t("ranking.loading")} message={t("ranking.loadingText")} />;
  if (error) return <ErrorState title={t("ranking.error")} message={error} onRetry={loadLeaderboard} />;

  return (
    <div className="page-enter space-y-8">
      <header className="page-header leaderboard-header"><div><p>{t("ranking.community")}</p><h1>{t("ranking.title")}</h1><span>{t("ranking.subtitle")}</span></div><Trophy className="size-12 text-amber-300/60" /></header>
      {leaders.length ? (
        <section className="glass-card overflow-hidden">
          <div className="ranking-title-row"><span>{t("ranking.position")}</span><span>{t("ranking.average")}</span><span className="hidden sm:block">{t("ranking.best")}</span><span>{t("ranking.games")}</span></div>
          <div>{leaders.map((leader) => { const isCurrent = leader.id === user.id; return <div key={leader.id} className={`ranking-row ${isCurrent ? "ranking-current" : ""}`}><div className="flex min-w-0 items-center gap-3"><span className={`rank-number rank-${leader.position}`}>{leader.position === 1 ? <Crown /> : leader.position <= 3 ? <Medal /> : leader.position}</span><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/5 text-slate-400"><UserRound className="size-4" /></span><div className="min-w-0"><strong className="block truncate text-sm text-white">{leader.name}</strong>{isCurrent && <small className="text-cyan-300">{t("ranking.you")}</small>}</div></div><strong className="text-cyan-300">{Math.round(leader.averagePercentage)}%</strong><span className="hidden text-slate-300 sm:block">{Math.round(leader.bestPercentage)}%</span><span className="text-slate-300">{leader.completedGames}</span></div>; })}</div>
        </section>
      ) : <EmptyState icon={Trophy} title={t("ranking.empty")} message={t("ranking.emptyText")} />}
    </div>
  );
}
