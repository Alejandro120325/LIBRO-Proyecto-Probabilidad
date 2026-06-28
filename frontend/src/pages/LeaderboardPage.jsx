import { Crown, Medal, Trophy, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import Alert from "../components/Alert.jsx";
import Loading from "../components/Loading.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage } from "../services/api.js";
import { resultService } from "../services/resultService.js";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    resultService.getLeaderboard()
      .then(({ leaderboard }) => setLeaders(leaderboard))
      .catch((requestError) => setError(getApiErrorMessage(requestError)));
  }, []);

  if (!leaders && !error) return <Loading label="Calculando posiciones" />;

  return (
    <div className="page-enter space-y-8">
      <header className="page-header leaderboard-header"><div><p>Comunidad</p><h1>Ranking de aprendizaje</h1><span>La constancia cuenta: el orden combina promedio, mejor marca y desafíos completados.</span></div><Trophy className="size-12 text-amber-300/60" /></header>
      {error && <Alert>{error}</Alert>}
      {leaders?.length ? (
        <section className="glass-card overflow-hidden">
          <div className="ranking-title-row"><span>Posición y estudiante</span><span>Promedio</span><span className="hidden sm:block">Mejor marca</span><span>Juegos</span></div>
          <div>{leaders.map((leader) => { const isCurrent = leader.id === user.id; return <div key={leader.id} className={`ranking-row ${isCurrent ? "ranking-current" : ""}`}><div className="flex min-w-0 items-center gap-3"><span className={`rank-number rank-${leader.position}`}>{leader.position === 1 ? <Crown /> : leader.position <= 3 ? <Medal /> : leader.position}</span><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/5 text-slate-400"><UserRound className="size-4" /></span><div className="min-w-0"><strong className="block truncate text-sm text-white">{leader.name}</strong>{isCurrent && <small className="text-cyan-300">Tú</small>}</div></div><strong className="text-cyan-300">{Math.round(leader.averagePercentage)}%</strong><span className="hidden text-slate-300 sm:block">{Math.round(leader.bestPercentage)}%</span><span className="text-slate-300">{leader.completedGames}</span></div>; })}</div>
        </section>
      ) : (
        <div className="empty-state"><Trophy className="size-7 text-amber-300" /><div><h3>El ranking aún está vacío</h3><p>Completa un desafío para inaugurar la clasificación.</p></div></div>
      )}
    </div>
  );
}
