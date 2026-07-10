import { ArrowLeft, CalendarDays, Mail, Pencil, ShieldCheck, ShieldOff, Trash2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/common/Alert.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import Loading from "../../components/common/Loading.jsx";
import ResultCard from "../../components/dashboard/ResultCard.jsx";
import UserEditModal from "../../components/dashboard/UserEditModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { adminService } from "../../services/adminService.js";
import { getApiErrorMessage } from "../../services/api.js";
import { formatDate } from "../../utils/format.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const load = () => adminService.getUserById(id).then(setData).catch((error) => setMessage({ type: "error", text: getApiErrorMessage(error) }));
  useEffect(load, [id]);

  const save = async (form, roleChanged) => {
    if (roleChanged && !window.confirm(t("adminUsers.confirmRole"))) return;
    setBusy(true); try { const result = await adminService.updateUser(id, form); setMessage({ type: "success", text: result.message }); setEdit(false); await load(); } catch (error) { setMessage({ type: "error", text: getApiErrorMessage(error) }); } finally { setBusy(false); }
  };
  const act = async () => {
    setBusy(true);
    try {
      if (confirm === "delete") { await adminService.deleteUser(id); navigate("/admin/users", { replace: true }); return; }
      const result = confirm === "suspend" ? await adminService.suspendUser(id) : await adminService.activateUser(id);
      setMessage({ type: "success", text: result.message }); setConfirm(null); await load();
    } catch (error) { setMessage({ type: "error", text: getApiErrorMessage(error) }); }
    finally { setBusy(false); }
  };
  if (!data && !message) return <Loading label={t("adminUsers.opening")} />;
  const user = data?.user;
  return (
    <div className="page-enter space-y-6">
      <Link to="/admin/users" className="back-link"><ArrowLeft />{t("adminUsers.back")}</Link>
      {message && <Alert type={message.type} onClose={() => setMessage(null)}>{message.text}</Alert>}
      {user && <>
        <section className="user-profile-card"><div className="profile-seal">{user.name.charAt(0)}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={`role-badge role-${user.role}`}>{user.role === "admin" ? t("common.admin") : t("common.student")}</span><span className={`status-badge status-${user.status}`}>{user.status === "active" ? t("common.active") : t("common.suspended")}</span></div><h1>{user.name}</h1><div className="profile-meta"><span><Mail />{user.email}</span><span><CalendarDays />{t("adminUsers.registered")} {formatDate(user.createdAt)}</span></div></div><div className="profile-actions"><button onClick={() => setEdit(true)} className="button button-outline"><Pencil />{t("common.edit")}</button>{user.id !== currentUser.id && <>{user.status === "active" ? <button onClick={() => setConfirm("suspend")} className="button button-ghost"><ShieldOff />{t("common.suspend")}</button> : <button onClick={() => setConfirm("activate")} className="button button-ghost"><ShieldCheck />{t("common.activate")}</button>}<button onClick={() => setConfirm("delete")} className="button button-danger"><Trash2 />{t("common.delete")}</button></>}</div></section>
        <section className="grid gap-4 sm:grid-cols-3"><div className="profile-metric"><span>{t("dashboard.average")}</span><strong>{Math.round(user.averagePercentage)}%</strong></div><div className="profile-metric"><span>{t("dashboard.best")}</span><strong>{Math.round(user.bestPercentage)}%</strong></div><div className="profile-metric"><span>{t("dashboard.gamesDone", { count: user.completedGames })}</span><strong>{user.completedGames}</strong></div></section>
        <section><div className="admin-panel-heading"><div><p>{t("adminUsers.academicProgress")}</p><h2>{t("adminUsers.resultHistory")}</h2></div></div>{data.results.length ? <div className="grid gap-3 lg:grid-cols-2">{data.results.map((result) => <ResultCard key={result.id} result={result} />)}</div> : <div className="admin-empty"><UserRound /> {t("adminUsers.noResults")}</div>}</section>
      </>}
      <UserEditModal user={edit ? user : null} busy={busy} onClose={() => setEdit(false)} onSave={save} />
      <ConfirmModal open={Boolean(confirm)} busy={busy} danger={confirm !== "activate"} title={confirm === "delete" ? t("adminUsers.deleteTitle") : confirm === "suspend" ? t("adminUsers.suspendTitle") : t("adminUsers.activateTitle")} message={user ? t("adminUsers.confirmAction", { email: user.email }) : ""} confirmText={confirm === "delete" ? t("common.delete") : confirm === "suspend" ? t("common.suspend") : t("common.activate")} onClose={() => setConfirm(null)} onConfirm={act} />
    </div>
  );
}
