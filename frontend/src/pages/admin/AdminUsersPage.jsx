import { Eye, Pencil, Search, ShieldCheck, ShieldOff, Trash2, UserCog, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../../components/Alert.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import Loading from "../../components/Loading.jsx";
import UserEditModal from "../../components/UserEditModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { adminService } from "../../services/adminService.js";
import { getApiErrorMessage } from "../../services/api.js";
import { formatDate } from "../../utils/format.js";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState(null);
  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const [editUser, setEditUser] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const loadUsers = () => adminService.getUsers().then(({ users: data }) => setUsers(data)).catch((error) => setMessage({ type: "error", text: getApiErrorMessage(error) }));
  useEffect(loadUsers, []);
  const filtered = useMemo(() => (users || []).filter((user) => {
    const query = filters.search.toLowerCase();
    return (!query || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)) && (!filters.role || user.role === filters.role) && (!filters.status || user.status === filters.status);
  }), [users, filters]);

  const saveUser = async (form, roleChanged) => {
    if (roleChanged && !window.confirm("Cambiar el rol modifica los permisos del usuario. ¿Deseas continuar?")) return;
    setBusy(true);
    try { const data = await adminService.updateUser(editUser.id, form); setMessage({ type: "success", text: data.message }); setEditUser(null); await loadUsers(); }
    catch (error) { setMessage({ type: "error", text: getApiErrorMessage(error) }); }
    finally { setBusy(false); }
  };

  const executeAction = async () => {
    setBusy(true);
    try {
      const data = confirm.action === "delete" ? await adminService.deleteUser(confirm.user.id) : confirm.action === "suspend" ? await adminService.suspendUser(confirm.user.id) : await adminService.activateUser(confirm.user.id);
      setMessage({ type: "success", text: data.message }); setConfirm(null); await loadUsers();
    } catch (error) { setMessage({ type: "error", text: getApiErrorMessage(error) }); }
    finally { setBusy(false); }
  };

  if (!users && !message) return <Loading label="Consultando usuarios" />;
  return (
    <div className="page-enter space-y-6">
      <header className="admin-page-header"><div><p>Gestión de acceso</p><h1>Usuarios</h1><span>Busca, edita y controla el acceso a la plataforma.</span></div><Users /></header>
      {message && <Alert type={message.type} onClose={() => setMessage(null)}>{message.text}</Alert>}
      <section className="admin-filters"><label><Search /><input placeholder="Buscar por nombre o correo" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /></label><select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}><option value="">Todos los roles</option><option value="student">Estudiante</option><option value="admin">Administrador</option></select><select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">Todos los estados</option><option value="active">Activos</option><option value="suspended">Suspendidos</option></select><span>{filtered.length} usuario(s)</span></section>
      <section className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Resultados</th><th>Promedio</th><th>Registro</th><th>Acciones</th></tr></thead><tbody>{filtered.map((user) => <tr key={user.id}><td><strong>{user.name}</strong><small>{user.email}</small></td><td><span className={`role-badge role-${user.role}`}>{user.role === "admin" ? <ShieldCheck /> : <UserCog />}{user.role}</span></td><td><span className={`status-badge status-${user.status}`}>{user.status === "active" ? "Activo" : "Suspendido"}</span></td><td>{user.resultCount}</td><td><b>{Math.round(user.averagePercentage)}%</b></td><td>{formatDate(user.createdAt)}</td><td><div className="table-actions"><Link to={`/admin/users/${user.id}`} title="Ver detalle"><Eye /></Link><button onClick={() => setEditUser(user)} title="Editar"><Pencil /></button>{user.id !== currentUser.id && <>{user.status === "active" ? <button onClick={() => setConfirm({ action: "suspend", user })} title="Suspender"><ShieldOff /></button> : <button onClick={() => setConfirm({ action: "activate", user })} title="Activar"><ShieldCheck /></button>}<button className="danger" onClick={() => setConfirm({ action: "delete", user })} title="Eliminar"><Trash2 /></button></>}</div></td></tr>)}</tbody></table>{!filtered.length && <div className="admin-empty">No se encontraron usuarios con estos filtros.</div>}</section>
      <UserEditModal user={editUser} busy={busy} onClose={() => setEditUser(null)} onSave={saveUser} />
      <ConfirmModal open={Boolean(confirm)} busy={busy} danger={confirm?.action !== "activate"} title={confirm?.action === "delete" ? "Eliminar usuario" : confirm?.action === "suspend" ? "Suspender usuario" : "Activar usuario"} message={confirm ? `${confirm.action === "delete" ? "Se eliminarán también sus resultados" : "Se modificará el acceso"} de ${confirm.user.email}.` : ""} confirmText={confirm?.action === "delete" ? "Eliminar" : confirm?.action === "suspend" ? "Suspender" : "Activar"} onClose={() => setConfirm(null)} onConfirm={executeAction} />
    </div>
  );
}
