import { ArrowRight, BookOpen, ChartNoAxesCombined, CircleGauge, Medal, Sparkles, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import Loading from "../components/Loading.jsx";
import ProgressCard from "../components/ProgressCard.jsx";
import ResultCard from "../components/ResultCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { chapters } from "../data/chapters.js";
import { getApiErrorMessage } from "../services/api.js";
import { resultService } from "../services/resultService.js";

const themeClass = {
  cyan: "unit-card-cyan",
  emerald: "unit-card-emerald",
  violet: "unit-card-violet",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    resultService.getSummary()
      .then(({ summary: data }) => setSummary(data))
      .catch((requestError) => setError(getApiErrorMessage(requestError)));
  }, []);

  if (!summary && !error) return <Loading label="Preparando tu panel" />;
  const data = summary || { completedGames: 0, averagePercentage: 0, bestPercentage: 0, completedUnits: 0, recentResults: [], byUnit: [] };

  return (
    <div className="page-enter space-y-8">
      {error && <Alert>{error}</Alert>}
      <section className="dashboard-hero">
        <div className="relative z-10 max-w-2xl">
          <div className="eyebrow"><Sparkles className="size-4" /> Panel de aprendizaje</div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">Hola, {user?.name?.split(" ")[0]}.</h1>
          <p className="mt-3 max-w-xl leading-7 text-slate-300">Cada reto completado convierte conceptos abstractos en habilidades que puedes medir.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/book" className="button button-primary">Abrir libro <BookOpen className="size-5" /></Link>
            <Link to="/my-results" className="button button-ghost">Mis resultados <ChartNoAxesCombined className="size-4" /></Link>
            <Link to="/leaderboard" className="button button-ghost">Ranking <Trophy className="size-4" /></Link>
          </div>
        </div>
        <div className="hero-progress" style={{ "--progress": `${Math.round((data.completedUnits / 3) * 100)}%` }}>
          <div><strong>{data.completedUnits}/3</strong><span>unidades superadas</span></div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <ProgressCard label="Progreso general" value={`${data.completedUnits}/3`} detail="Unidades con 60% o más" color="cyan" icon={CircleGauge} />
        <ProgressCard label="Promedio" value={`${Math.round(data.averagePercentage)}%`} detail={`${data.completedGames} juegos completados`} color="emerald" icon={ChartNoAxesCombined} />
        <ProgressCard label="Mejor resultado" value={`${Math.round(data.bestPercentage)}%`} detail="Tu marca personal" color="violet" icon={Medal} />
      </section>

      <section>
        <div className="section-heading">
          <div><p>Tu recorrido</p><h2>Continúa por una unidad</h2></div>
          <Link to="/book">Ver índice <ArrowRight className="size-4" /></Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {chapters.map((chapter) => {
            const progress = data.byUnit.find((item) => Number(item.unitId) === chapter.id);
            return (
              <Link key={chapter.id} to={`/book/unit/${chapter.id}`} className={`unit-card ${themeClass[chapter.theme]}`}>
                <div className="flex items-center justify-between"><span className="unit-number">0{chapter.id}</span><span className="status-dot">{progress?.bestPercentage >= 60 ? "Superada" : progress ? "En curso" : "Nueva"}</span></div>
                <p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-current/70">{chapter.category}</p>
                <h3 className="mt-2 text-xl font-black text-white">{chapter.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{chapter.subtitle}</p>
                <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4"><span className="text-xs text-slate-500">Mejor: {Math.round(progress?.bestPercentage || 0)}%</span><ArrowRight className="size-4 transition group-hover:translate-x-1" /></div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="section-heading"><div><p>Actividad reciente</p><h2>Últimos resultados</h2></div><Link to="/my-results">Ver historial <ArrowRight className="size-4" /></Link></div>
        {data.recentResults.length ? (
          <div className="grid gap-3 lg:grid-cols-2">{data.recentResults.map((result) => <ResultCard key={result.id} result={result} compact />)}</div>
        ) : (
          <div className="empty-state"><BookOpen className="size-7 text-amber-300" /><div><h3>Aún no hay resultados</h3><p>Abre una unidad y completa su primer desafío.</p></div><Link to="/book" className="button button-outline button-sm">Empezar</Link></div>
        )}
      </section>
    </div>
  );
}
