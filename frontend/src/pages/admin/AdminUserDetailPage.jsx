import { ArrowLeft, CalendarDays, Mail, Pencil, ShieldCheck, ShieldOff, Trash2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import Loading from "../../components/Loading.jsx";
import ResultCard from "../../components/ResultCard.jsx";
import UserEditModal from "../../components/UserEditModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { adminService } from "../../services/adminService.js";
import { getApiErrorMessage } from "../../services/api.js";
import { formatDate } from "../../utils/format.js";

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const load = () => adminService.getUserById(id).then(setData).catch((error) => setMessage({ type: "error", text: getApiErrorMessage(error) }));
  useEffect(load, [id]);

  const save = async (form, roleChanged) => {
    if (roleChanged && !window.confirm("Cambiar el rol modifica permisos críticos. ¿Continuar?")) return;
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
  if (!data && !message) return <Loading label="Abriendo expediente" />;
  const user = data?.user;
  return (
    <div className="page-enter space-y-6">
      <Link to="/admin/users" className="back-link"><ArrowLeft />Volver a usuarios</Link>
      {message && <Alert type={message.type} onClose={() => setMessage(null)}>{message.text}</Alert>}
      {user && <>
        <section className="user-profile-card"><div className="profile-seal">{user.name.charAt(0)}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={`role-badge role-${user.role}`}>{user.role}</span><span className={`status-badge status-${user.status}`}>{user.status}</span></div><h1>{user.name}</h1><div className="profile-meta"><span><Mail />{user.email}</span><span><CalendarDays />Registrado {formatDate(user.createdAt)}</span></div></div><div className="profile-actions"><button onClick={() => setEdit(true)} className="button button-outline"><Pencil />Editar</button>{user.id !== currentUser.id && <>{user.status === "active" ? <button onClick={() => setConfirm("suspend")} className="button button-ghost"><ShieldOff />Suspender</button> : <button onClick={() => setConfirm("activate")} className="button button-ghost"><ShieldCheck />Activar</button>}<button onClick={() => setConfirm("delete")} className="button button-danger"><Trash2 />Eliminar</button></>}</div></section>
        <section className="grid gap-4 sm:grid-cols-3"><div className="profile-metric"><span>Promedio</span><strong>{Math.round(user.averagePercentage)}%</strong></div><div className="profile-metric"><span>Mejor resultado</span><strong>{Math.round(user.bestPercentage)}%</strong></div><div className="profile-metric"><span>Juegos completados</span><strong>{user.completedGames}</strong></div></section>
        <section><div className="admin-panel-heading"><div><p>Progreso académico</p><h2>Historial de resultados</h2></div></div>{data.results.length ? <div className="grid gap-3 lg:grid-cols-2">{data.results.map((result) => <ResultCard key={result.id} result={result} />)}</div> : <div className="admin-empty"><UserRound /> Este usuario aún no tiene resultados.</div>}</section>
      </>}
      <UserEditModal user={edit ? user : null} busy={busy} onClose={() => setEdit(false)} onSave={save} />
      <ConfirmModal open={Boolean(confirm)} busy={busy} danger={confirm !== "activate"} title={confirm === "delete" ? "Eliminar usuario" : confirm === "suspend" ? "Suspender usuario" : "Activar usuario"} message={user ? `Confirma la acción sobre ${user.email}.` : ""} confirmText={confirm === "delete" ? "Eliminar" : confirm === "suspend" ? "Suspender" : "Activar"} onClose={() => setConfirm(null)} onConfirm={act} />
    </div>
  );
}
