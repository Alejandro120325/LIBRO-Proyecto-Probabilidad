import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserEditModal({ user, busy, onSave, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", role: "student", status: "active" });

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
  }, [user]);
  if (!user) return null;

  const submit = (event) => {
    event.preventDefault();
    onSave(form, form.role !== user.role);
  };

  return (
    <div className="modal-backdrop">
      <section className="admin-modal max-w-lg" role="dialog" aria-modal="true" aria-labelledby="edit-title">
        <button className="modal-close" onClick={onClose} disabled={busy} aria-label="Cerrar"><X /></button>
        <p className="admin-kicker">Gestión de identidad</p>
        <h2 id="edit-title">Editar usuario</h2>
        <p>Actualiza los datos y permisos de <strong>{user.email}</strong>.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="admin-field sm:col-span-2"><span>Nombre</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required minLength={2} /></label>
          <label className="admin-field sm:col-span-2"><span>Correo</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          <label className="admin-field"><span>Rol</span><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="student">Estudiante</option><option value="admin">Administrador</option></select></label>
          <label className="admin-field"><span>Estado</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="active">Activo</option><option value="suspended">Suspendido</option></select></label>
          <div className="mt-2 flex justify-end gap-3 sm:col-span-2"><button type="button" onClick={onClose} disabled={busy} className="button button-ghost">Cancelar</button><button type="submit" disabled={busy} className="button button-primary"><Save />{busy ? "Guardando…" : "Guardar cambios"}</button></div>
        </form>
      </section>
    </div>
  );
}
