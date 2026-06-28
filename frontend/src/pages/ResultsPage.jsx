import { BarChart3, BookOpen, CircleGauge, Medal, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import Loading from "../components/Loading.jsx";
import ProgressCard from "../components/ProgressCard.jsx";
import ResultCard from "../components/ResultCard.jsx";
import { chapters } from "../data/chapters.js";
import { getApiErrorMessage } from "../services/api.js";
import { resultService } from "../services/resultService.js";

export default function ResultsPage() {
  const [results, setResults] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([resultService.getMine(), resultService.getSummary()])
      .then(([resultsData, summaryData]) => { setResults(resultsData.results); setSummary(summaryData.summary); })
      .catch((requestError) => setError(getApiErrorMessage(requestError)));
  }, []);

  if (!results && !error) return <Loading label="Consultando tu historial" />;
  const data = summary || { averagePercentage: 0, bestPercentage: 0, completedGames: 0, byUnit: [] };

  return (
    <div className="page-enter space-y-8">
      <header className="page-header"><div><p>Analítica personal</p><h1>Mis resultados</h1><span>Consulta cada intento y detecta dónde seguir mejorando.</span></div><BarChart3 className="size-12 text-cyan-300/50" /></header>
      {error && <Alert>{error}</Alert>}
      <section className="grid gap-4 sm:grid-cols-3">
        <ProgressCard label="Promedio general" value={`${Math.round(data.averagePercentage)}%`} detail="Todos tus desafíos" icon={CircleGauge} color="cyan" />
        <ProgressCard label="Mejor resultado" value={`${Math.round(data.bestPercentage)}%`} detail="Tu marca personal" icon={Medal} color="emerald" />
        <ProgressCard label="Intentos" value={data.completedGames} detail="Resultados guardados" icon={Target} color="violet" />
      </section>

      <section className="glass-card p-5 sm:p-6">
        <div className="section-heading mb-5"><div><p>Por unidad</p><h2>Mejores marcas</h2></div></div>
        <div className="grid gap-4 md:grid-cols-3">{chapters.map((chapter) => { const unit = data.byUnit.find((item) => Number(item.unitId) === chapter.id); const percentage = Math.round(unit?.bestPercentage || 0); return <div key={chapter.id} className="unit-summary"><div className="flex items-center justify-between"><span>Unidad 0{chapter.id}</span><strong>{percentage}%</strong></div><h3>{chapter.title}</h3><div className="mini-progress"><span style={{ width: `${percentage}%` }} /></div><p>{unit?.attempts || 0} intento(s)</p></div>; })}</div>
      </section>

      <section>
        <div className="section-heading"><div><p>Historial</p><h2>Todos los intentos</h2></div></div>
        {results?.length ? <div className="grid gap-3 lg:grid-cols-2">{results.map((result) => <ResultCard key={result.id} result={result} />)}</div> : <div className="empty-state"><BookOpen className="size-7 text-amber-300" /><div><h3>No hay intentos guardados</h3><p>Completa un minijuego y su resultado aparecerá aquí.</p></div><Link to="/book" className="button button-outline button-sm">Abrir libro</Link></div>}
      </section>
    </div>
  );
}
