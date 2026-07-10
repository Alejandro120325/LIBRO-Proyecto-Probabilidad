import { Eye, Pencil, Search, ShieldCheck, ShieldOff, Trash2, UserCog, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../../components/common/Alert.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import LoadingState from "../../components/common/LoadingState.jsx";
import UserEditModal from "../../components/dashboard/UserEditModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { adminService } from "../../services/adminService.js";
import { getApiErrorMessage } from "../../services/api.js";
import { formatDate } from "../../utils/format.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

const initialFilters = { search: "", role: "", status: "" };

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [editUser, setEditUser] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const loadUsers = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setLoadError("");
    try {
      const { users: data } = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setLoadError(getApiErrorMessage(error));
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const filtered = useMemo(() => users.filter((user) => {
    const query = filters.search.trim().toLowerCase();
    return (!query || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query))
      && (!filters.role || user.role === filters.role)
      && (!filters.status || user.status === filters.status);
  }), [users, filters]);

  const saveUser = async (form, roleChanged) => {
    if (roleChanged && !window.confirm(t("adminUsers.confirmRole"))) return;
    setBusy(true);
    try {
      const data = await adminService.updateUser(editUser.id, form);
      setMessage({ type: "success", text: data.message });
      setEditUser(null);
      await loadUsers({ silent: true });
    } catch (error) {
      setMessage({ type: "error", text: getApiErrorMessage(error) });
    } finally {
      setBusy(false);
    }
  };

  const executeAction = async () => {
    setBusy(true);
    try {
      const data = confirm.action === "delete"
        ? await adminService.deleteUser(confirm.user.id)
        : confirm.action === "suspend"
          ? await adminService.suspendUser(confirm.user.id)
          : await adminService.activateUser(confirm.user.id);
      setMessage({ type: "success", text: data.message });
      setConfirm(null);
      await loadUsers({ silent: true });
    } catch (error) {
      setMessage({ type: "error", text: getApiErrorMessage(error) });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <LoadingState title={t("adminUsers.loading")} message={t("adminUsers.loadingText")} />;
  if (loadError) return <ErrorState title={t("adminUsers.error")} message={t("adminUsers.errorText")} onRetry={loadUsers} />;

  return (
    <div className="page-enter space-y-6">
      <header className="admin-page-header"><div><p>{t("adminUsers.eyebrow")}</p><h1>{t("common.users")}</h1><span>{t("adminUsers.subtitle")}</span></div><Users /></header>
      {message && <Alert type={message.type} onClose={() => setMessage(null)}>{message.text}</Alert>}
      <section className="admin-filters">
        <label><Search /><input placeholder={t("adminUsers.search")} value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} /></label>
        <select value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })}><option value="">{t("adminUsers.allRoles")}</option><option value="student">{t("common.student")}</option><option value="admin">{t("common.admin")}</option></select>
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">{t("adminUsers.allStatuses")}</option><option value="active">{t("common.active")}</option><option value="suspended">{t("common.suspended")}</option></select>
        <span>{t("adminUsers.count", { count: filtered.length })}</span>
      </section>
      <section className="admin-table-wrap">
        {filtered.length ? <table className="admin-table admin-users-table"><thead><tr><th>ID</th><th>{t("adminUsers.user")}</th><th>{t("adminUsers.role")}</th><th>{t("adminUsers.status")}</th><th>{t("common.results")}</th><th>{t("dashboard.average")}</th><th>{t("adminUsers.registered")}</th><th>{t("common.actions")}</th></tr></thead><tbody>{filtered.map((user) => <tr key={user.id}><td><code>#{user.id}</code></td><td><strong>{user.name}</strong><small>{user.email}</small></td><td><span className={`role-badge role-${user.role}`}>{user.role === "admin" ? <ShieldCheck /> : <UserCog />}{user.role === "admin" ? t("common.admin") : t("common.student")}</span></td><td><span className={`status-badge status-${user.status}`}>{user.status === "active" ? t("common.active") : t("common.suspended")}</span></td><td>{user.resultCount}</td><td><b>{Math.round(user.averagePercentage)}%</b></td><td>{formatDate(user.createdAt)}</td><td><div className="table-actions"><Link to={`/admin/users/${user.id}`} title={t("adminUsers.detail")} aria-label={`${t("adminUsers.detail")} ${user.name}`}><Eye /></Link><button onClick={() => setEditUser(user)} title={t("common.edit")} aria-label={`${t("common.edit")} ${user.name}`}><Pencil /></button>{user.id !== currentUser.id && <>{user.status === "active" ? <button onClick={() => setConfirm({ action: "suspend", user })} title={t("common.suspend")} aria-label={`${t("common.suspend")} ${user.name}`}><ShieldOff /></button> : <button onClick={() => setConfirm({ action: "activate", user })} title={t("common.activate")} aria-label={`${t("common.activate")} ${user.name}`}><ShieldCheck /></button>}<button className="danger" onClick={() => setConfirm({ action: "delete", user })} title={t("common.delete")} aria-label={`${t("common.delete")} ${user.name}`}><Trash2 /></button></>}</div></td></tr>)}</tbody></table> : <EmptyState icon={Users} title={t("adminUsers.empty")} message={t("adminUsers.emptyText")} action={<button type="button" className="button button-outline button-sm" onClick={() => setFilters(initialFilters)}>{t("adminUsers.clear")}</button>} />}
      </section>
      <UserEditModal user={editUser} busy={busy} onClose={() => setEditUser(null)} onSave={saveUser} />
      <ConfirmModal open={Boolean(confirm)} busy={busy} danger={confirm?.action !== "activate"} title={confirm?.action === "delete" ? t("adminUsers.deleteTitle") : confirm?.action === "suspend" ? t("adminUsers.suspendTitle") : t("adminUsers.activateTitle")} message={confirm ? `${confirm.action === "delete" ? t("adminUsers.deleteText") : t("adminUsers.accessText")} ${confirm.user.email}.` : ""} confirmText={confirm?.action === "delete" ? t("common.delete") : confirm?.action === "suspend" ? t("common.suspend") : t("common.activate")} onClose={() => setConfirm(null)} onConfirm={executeAction} />
    </div>
  );
}
