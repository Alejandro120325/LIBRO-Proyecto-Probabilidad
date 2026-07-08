import { FileClock, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Alert from "../../components/Alert.jsx";
import Loading from "../../components/Loading.jsx";
import { adminService } from "../../services/adminService.js";
import { getApiErrorMessage } from "../../services/api.js";
import { formatDate } from "../../utils/format.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function AdminAuditLogsPage() {
  const { t } = useLanguage();
  const [logs, setLogs] = useState(null); const [action, setAction] = useState(""); const [error, setError] = useState("");
  useEffect(() => { adminService.getAuditLogs().then(({ auditLogs }) => setLogs(auditLogs)).catch((err) => setError(getApiErrorMessage(err))); }, []);
  const actions = useMemo(() => [...new Set((logs || []).map((log) => log.action))].sort(), [logs]);
  const filtered = action ? logs?.filter((log) => log.action === action) : logs;
  if (!logs && !error) return <Loading label={t("adminAudit.loading")} />;
  return <div className="page-enter space-y-6"><header className="admin-page-header"><div><p>{t("adminAudit.eyebrow")}</p><h1>{t("admin.audit")}</h1><span>{t("adminAudit.subtitle")}</span></div><FileClock /></header>{error && <Alert>{error}</Alert>}<section className="admin-filters"><label className="max-w-sm"><Filter /><select value={action} onChange={(e) => setAction(e.target.value)}><option value="">{t("adminAudit.all")}</option>{actions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><span>{t("adminAudit.events", { count: filtered?.length || 0 })}</span></section><section className="admin-table-wrap"><table className="admin-table"><thead><tr><th>{t("common.date")}</th><th>{t("adminUsers.user")}</th><th>{t("adminAudit.action")}</th><th>{t("adminAudit.entity")}</th><th>{t("adminAudit.description")}</th><th>IP</th></tr></thead><tbody>{filtered?.map((log) => <tr key={log.id}><td>{formatDate(log.createdAt)}</td><td><strong>{log.userName}</strong><small>{log.userEmail || "—"}</small></td><td><span className="audit-action">{log.action}</span></td><td>{log.entity}{log.entityId ? ` #${log.entityId}` : ""}</td><td className="min-w-72">{log.description}</td><td><code>{log.ipAddress || "—"}</code></td></tr>)}</tbody></table>{!filtered?.length && <div className="admin-empty">{t("adminAudit.empty")}</div>}</section></div>;
}
