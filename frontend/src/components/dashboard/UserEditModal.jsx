import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function UserEditModal({ user, busy, onSave, onClose }) {
  const { t } = useLanguage();
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
        <button className="modal-close" onClick={onClose} disabled={busy} aria-label={t("common.close")}><X /></button>
        <p className="admin-kicker">{t("adminUsers.identity")}</p>
        <h2 id="edit-title">{t("adminUsers.edit")}</h2>
        <p>{t("adminUsers.editText")} <strong>{user.email}</strong>.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="admin-field sm:col-span-2"><span>{t("auth.name")}</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required minLength={2} /></label>
          <label className="admin-field sm:col-span-2"><span>{t("auth.email")}</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          <label className="admin-field"><span>{t("adminUsers.role")}</span><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="student">{t("common.student")}</option><option value="admin">{t("common.admin")}</option></select></label>
          <label className="admin-field"><span>{t("adminUsers.status")}</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="active">{t("common.active")}</option><option value="suspended">{t("common.suspended")}</option></select></label>
          <div className="mt-2 flex justify-end gap-3 sm:col-span-2"><button type="button" onClick={onClose} disabled={busy} className="button button-ghost">{t("common.cancel")}</button><button type="submit" disabled={busy} className="button button-primary"><Save />{busy ? t("state.saving") : t("common.save")}</button></div>
        </form>
      </section>
    </div>
  );
}
