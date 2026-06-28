import { FileClock, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Alert from "../../components/Alert.jsx";
import Loading from "../../components/Loading.jsx";
import { adminService } from "../../services/adminService.js";
import { getApiErrorMessage } from "../../services/api.js";
import { formatDate } from "../../utils/format.js";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState(null); const [action, setAction] = useState(""); const [error, setError] = useState("");
  useEffect(() => { adminService.getAuditLogs().then(({ auditLogs }) => setLogs(auditLogs)).catch((err) => setError(getApiErrorMessage(err))); }, []);
  const actions = useMemo(() => [...new Set((logs || []).map((log) => log.action))].sort(), [logs]);
  const filtered = action ? logs?.filter((log) => log.action === action) : logs;
  if (!logs && !error) return <Loading label="Leyendo la bitácora" />;
  return <div className="page-enter space-y-6"><header className="admin-page-header"><div><p>Trazabilidad del sistema</p><h1>Bitácora</h1><span>Registro cronológico de accesos y operaciones sensibles.</span></div><FileClock /></header>{error && <Alert>{error}</Alert>}<section className="admin-filters"><label className="max-w-sm"><Filter /><select value={action} onChange={(e) => setAction(e.target.value)}><option value="">Todas las acciones</option>{actions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><span>{filtered?.length || 0} evento(s)</span></section><section className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Entidad</th><th>Descripción</th><th>IP</th></tr></thead><tbody>{filtered?.map((log) => <tr key={log.id}><td>{formatDate(log.createdAt)}</td><td><strong>{log.userName}</strong><small>{log.userEmail || "—"}</small></td><td><span className="audit-action">{log.action}</span></td><td>{log.entity}{log.entityId ? ` #${log.entityId}` : ""}</td><td className="min-w-72">{log.description}</td><td><code>{log.ipAddress || "—"}</code></td></tr>)}</tbody></table>{!filtered?.length && <div className="admin-empty">No existen eventos para este filtro.</div>}</section></div>;
}
