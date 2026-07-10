import { ListChecks, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "../../components/common/Alert.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import LoadingState from "../../components/common/LoadingState.jsx";
import { adminService } from "../../services/adminService.js";
import { getApiErrorMessage } from "../../services/api.js";
import { formatDate, formatTime } from "../../utils/format.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function AdminResultsPage() {
  const { t, translateText } = useLanguage();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [unit, setUnit] = useState("");
  const [game, setGame] = useState("");
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const loadResults = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setLoadError("");
    try {
      const { results: data } = await adminService.getAllResults();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      setLoadError(getApiErrorMessage(error));
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { loadResults(); }, [loadResults]);

  const gameOptions = useMemo(() => [...new Set(results.map(({ gameType }) => gameType))].sort(), [results]);
  const filtered = useMemo(() => results.filter((result) => {
    const query = search.trim().toLowerCase();
    return (!unit || result.unitId === Number(unit))
      && (!game || result.gameType === game)
      && (!query || `${result.userName} ${result.email}`.toLowerCase().includes(query));
  }), [results, search, unit, game]);

  const remove = async () => {
    setBusy(true);
    try {
      const data = await adminService.deleteResult(target.id);
      setMessage({ type: "success", text: data.message });
      setTarget(null);
      await loadResults({ silent: true });
    } catch (error) {
      setMessage({ type: "error", text: getApiErrorMessage(error) });
    } finally {
      setBusy(false);
    }
  };

  const clearFilters = () => { setSearch(""); setUnit(""); setGame(""); };

  if (loading) return <LoadingState title={t("adminResults.loading")} message={t("adminResults.loadingText")} />;
  if (loadError) return <ErrorState title={t("adminResults.error")} message={t("adminUsers.errorText")} onRetry={loadResults} />;

  return (
    <div className="page-enter space-y-6">
      <header className="admin-page-header"><div><p>{t("adminResults.eyebrow")}</p><h1>{t("common.results")}</h1><span>{t("adminResults.subtitle")}</span></div><ListChecks /></header>
      {message && <Alert type={message.type} onClose={() => setMessage(null)}>{message.text}</Alert>}
      <section className="admin-filters">
        <label><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("adminResults.search")} /></label>
        <select value={unit} onChange={(event) => setUnit(event.target.value)}><option value="">{t("adminResults.allUnits")}</option><option value="1">{t("common.unit")} 1</option><option value="2">{t("common.unit")} 2</option><option value="3">{t("common.unit")} 3</option></select>
        <select value={game} onChange={(event) => setGame(event.target.value)}><option value="">{t("adminResults.allGames")}</option>{gameOptions.map((option) => <option key={option} value={option}>{translateText(option)}</option>)}</select>
        <span>{t("adminResults.count", { count: filtered.length })}</span>
      </section>
      <section className="admin-table-wrap">
        {filtered.length ? <table className="admin-table admin-results-table"><thead><tr><th>ID</th><th>{t("adminResults.student")}</th><th>{t("adminResults.topic")}</th><th>{t("adminResults.game")}</th><th>{t("common.score")}</th><th>{t("adminResults.total")}</th><th>{t("adminResults.percentage")}</th><th>{t("common.time")}</th><th>{t("common.date")}</th><th>{t("common.actions")}</th></tr></thead><tbody>{filtered.map((result) => <tr key={result.id}><td><code>#{result.id}</code></td><td><strong>{result.userName}</strong><small>{result.email}</small></td><td><strong>{t("common.unit")} {result.unitId}</strong><small>{translateText(result.topic)}</small></td><td>{translateText(result.gameType)}</td><td>{result.score}</td><td>{result.totalQuestions}</td><td><b className="text-amber-300">{Math.round(result.percentage)}%</b></td><td>{formatTime(result.timeSeconds)}</td><td>{formatDate(result.createdAt)}</td><td><div className="table-actions"><button className="danger" onClick={() => setTarget(result)} aria-label={`${t("adminResults.delete")} ${result.userName}`} title={t("adminResults.delete")}><Trash2 /></button></div></td></tr>)}</tbody></table> : <EmptyState icon={ListChecks} title={t("adminResults.empty")} message={t("adminResults.emptyText")} action={<button type="button" className="button button-outline button-sm" onClick={clearFilters}>{t("adminUsers.clear")}</button>} />}
      </section>
      <ConfirmModal open={Boolean(target)} busy={busy} danger title={t("adminResults.delete")} message={target ? t("adminResults.deleteText", { name: target.userName, game: translateText(target.gameType) }) : ""} confirmText={t("adminResults.delete")} onClose={() => setTarget(null)} onConfirm={remove} />
    </div>
  );
}
