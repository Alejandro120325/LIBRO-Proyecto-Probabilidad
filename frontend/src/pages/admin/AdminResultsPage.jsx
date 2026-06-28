import { ListChecks, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Alert from "../../components/Alert.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import Loading from "../../components/Loading.jsx";
import { adminService } from "../../services/adminService.js";
import { getApiErrorMessage } from "../../services/api.js";
import { formatDate, formatTime } from "../../utils/format.js";

export default function AdminResultsPage() {
  const [results, setResults] = useState(null);
  const [search, setSearch] = useState("");
  const [unit, setUnit] = useState("");
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const load = () => adminService.getAllResults().then(({ results: data }) => setResults(data)).catch((error) => setMessage({ type: "error", text: getApiErrorMessage(error) }));
  useEffect(load, []);
  const filtered = useMemo(() => (results || []).filter((result) => (!unit || result.unitId === Number(unit)) && (!search || `${result.userName} ${result.email}`.toLowerCase().includes(search.toLowerCase()))), [results, search, unit]);
  const remove = async () => { setBusy(true); try { const data = await adminService.deleteResult(target.id); setMessage({ type: "success", text: data.message }); setTarget(null); await load(); } catch (error) { setMessage({ type: "error", text: getApiErrorMessage(error) }); } finally { setBusy(false); } };
  if (!results && !message) return <Loading label="Consultando resultados" />;
  return <div className="page-enter space-y-6"><header className="admin-page-header"><div><p>Rendimiento académico</p><h1>Resultados</h1><span>Consulta y depura los intentos guardados.</span></div><ListChecks /></header>{message && <Alert type={message.type} onClose={() => setMessage(null)}>{message.text}</Alert>}<section className="admin-filters"><label><Search /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar estudiante o correo" /></label><select value={unit} onChange={(e) => setUnit(e.target.value)}><option value="">Todas las unidades</option><option value="1">Unidad 1</option><option value="2">Unidad 2</option><option value="3">Unidad 3</option></select><span>{filtered.length} resultado(s)</span></section><section className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Estudiante</th><th>Unidad / tema</th><th>Juego</th><th>Puntaje</th><th>Porcentaje</th><th>Tiempo</th><th>Fecha</th><th /></tr></thead><tbody>{filtered.map((result) => <tr key={result.id}><td><strong>{result.userName}</strong><small>{result.email}</small></td><td><strong>Unidad {result.unitId}</strong><small>{result.topic}</small></td><td>{result.gameType}</td><td>{result.score}/{result.totalQuestions}</td><td><b className="text-amber-300">{Math.round(result.percentage)}%</b></td><td>{formatTime(result.timeSeconds)}</td><td>{formatDate(result.createdAt)}</td><td><div className="table-actions"><button className="danger" onClick={() => setTarget(result)} aria-label={`Eliminar resultado de ${result.userName}`}><Trash2 /></button></div></td></tr>)}</tbody></table>{!filtered.length && <div className="admin-empty">No existen resultados para estos filtros.</div>}</section><ConfirmModal open={Boolean(target)} busy={busy} danger title="Eliminar resultado" message={target ? `Se eliminará el intento de ${target.userName} en ${target.gameType}.` : ""} confirmText="Eliminar resultado" onClose={() => setTarget(null)} onConfirm={remove} /></div>;
}
