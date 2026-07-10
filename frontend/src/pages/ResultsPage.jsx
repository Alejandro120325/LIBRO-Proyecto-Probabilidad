import { BarChart3, BookOpen, CircleGauge, Medal, Target } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import ProgressCard from "../components/dashboard/ProgressCard.jsx";
import ResultCard from "../components/dashboard/ResultCard.jsx";
import { chapters } from "../data/chapters.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getApiErrorMessage } from "../services/api.js";
import { resultService } from "../services/resultService.js";

export default function ResultsPage() {
  const { t, translateObject } = useLanguage();
  const localizedChapters = translateObject(chapters);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadResults = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [resultsData, summaryData] = await Promise.all([resultService.getMine(), resultService.getSummary()]);
      setResults(Array.isArray(resultsData.results) ? resultsData.results : []);
      setSummary(summaryData.summary);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadResults(); }, [loadResults]);

  if (loading) return <LoadingState title={t("results.loading")} message={t("results.loadingText")} />;
  if (error) return <ErrorState title={t("results.error")} message={error} onRetry={loadResults} />;

  const data = summary || { averagePercentage: 0, bestPercentage: 0, completedGames: 0, byUnit: [] };

  return (
    <div className="page-enter space-y-8">
      <header className="page-header"><div><p>{t("results.analytics")}</p><h1>{t("results.title")}</h1><span>{t("results.subtitle")}</span></div><BarChart3 className="size-12 text-cyan-300/50" /></header>
      <section className="grid gap-4 sm:grid-cols-3">
        <ProgressCard label={t("results.average")} value={`${Math.round(data.averagePercentage)}%`} detail={t("results.allChallenges")} icon={CircleGauge} color="cyan" />
        <ProgressCard label={t("results.best")} value={`${Math.round(data.bestPercentage)}%`} detail={t("dashboard.personalBest")} icon={Medal} color="emerald" />
        <ProgressCard label={t("results.attempts")} value={data.completedGames} detail={t("results.saved")} icon={Target} color="violet" />
      </section>
      <section className="glass-card p-5 sm:p-6">
        <div className="section-heading mb-5"><div><p>{t("results.byUnit")}</p><h2>{t("results.bestMarks")}</h2></div></div>
        <div className="grid gap-4 md:grid-cols-3">{localizedChapters.map((chapter) => { const unit = data.byUnit.find((item) => Number(item.unitId) === chapter.id); const percentage = Math.round(unit?.bestPercentage || 0); return <div key={chapter.id} className="unit-summary"><div className="flex items-center justify-between"><span>{t("common.unit")} 0{chapter.id}</span><strong>{percentage}%</strong></div><h3>{chapter.title}</h3><div className="mini-progress"><span style={{ width: `${percentage}%` }} /></div><p>{unit?.attempts || 0} {t("results.attempts").toLowerCase()}</p></div>; })}</div>
      </section>
      <section>
        <div className="section-heading"><div><p>{t("results.history")}</p><h2>{t("results.allAttempts")}</h2></div></div>
        {results.length ? <div className="grid gap-3 lg:grid-cols-2">{results.map((result) => <ResultCard key={result.id} result={result} />)}</div> : <EmptyState icon={BookOpen} title={t("results.noAttempts")} message={t("results.noAttemptsText")} action={<Link to="/book" className="button button-outline button-sm">{t("common.openBook")}</Link>} />}
      </section>
    </div>
  );
}
