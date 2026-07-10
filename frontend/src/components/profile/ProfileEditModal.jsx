import { Save, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getApiErrorMessage } from "../../services/api.js";
import Alert from "../common/Alert.jsx";

const emptyProfile = {
  name: "",
  phone: "",
  nationalId: "",
  city: "",
  university: "",
  career: "",
  semester: "",
  birthDate: "",
  bio: "",
};

export default function ProfileEditModal({ open, user, onClose, onSaved }) {
  const { updateProfile } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState(emptyProfile);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(Object.fromEntries(Object.keys(emptyProfile).map((key) => [key, user?.[key] || ""])));
    setError("");
  }, [open, user]);

  if (!open) return null;

  const change = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError(t("profile.validationName"));
    if (form.phone.trim() && form.phone.trim().length < 7) return setError(t("profile.validationPhone"));
    if (form.nationalId.trim() && !/^\d{10}$/.test(form.nationalId.trim())) return setError(t("profile.validationNationalId"));

    setBusy(true);
    try {
      const result = await updateProfile(form);
      onSaved?.(result.message || t("profile.success"));
      onClose();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !busy && onClose()}>
      <section className="admin-modal profile-edit-modal" role="dialog" aria-modal="true" aria-labelledby="profile-edit-title">
        <button type="button" className="modal-close" onClick={onClose} disabled={busy} aria-label={t("common.close")}><X /></button>
        <div className="modal-warning"><UserRound /></div>
        <p className="admin-kicker">{t("profile.title")}</p>
        <h2 id="profile-edit-title">{t("profile.edit")}</h2>
        <p>{t("profile.editText")}</p>

        <form className="profile-form" onSubmit={submit}>
          {error && <Alert>{error}</Alert>}
          <div className="profile-form-grid">
            <label className="admin-field profile-field-wide"><span>{t("auth.name")}</span><input name="name" value={form.name} onChange={change} required minLength="2" maxLength="80" /></label>
            <label className="admin-field profile-field-wide"><span>{t("profile.email")}</span><input value={user?.email || ""} readOnly aria-readonly="true" /></label>
            <label className="admin-field"><span>{t("profile.phone")}</span><input name="phone" type="tel" value={form.phone} onChange={change} maxLength="30" autoComplete="tel" /></label>
            <label className="admin-field"><span>{t("profile.nationalId")}</span><input name="nationalId" inputMode="numeric" value={form.nationalId} onChange={change} maxLength="10" /></label>
            <label className="admin-field"><span>{t("profile.city")}</span><input name="city" value={form.city} onChange={change} maxLength="80" autoComplete="address-level2" /></label>
            <label className="admin-field"><span>{t("profile.birthDate")}</span><input name="birthDate" type="date" value={form.birthDate} onChange={change} max={new Date().toISOString().slice(0, 10)} /></label>
            <label className="admin-field profile-field-wide"><span>{t("profile.university")}</span><input name="university" value={form.university} onChange={change} maxLength="120" /></label>
            <label className="admin-field"><span>{t("profile.career")}</span><input name="career" value={form.career} onChange={change} maxLength="100" /></label>
            <label className="admin-field"><span>{t("profile.semester")}</span><input name="semester" value={form.semester} onChange={change} maxLength="40" /></label>
            <label className="admin-field profile-field-wide"><span>{t("profile.bio")}</span><textarea name="bio" value={form.bio} onChange={change} maxLength="180" rows="3" /><small>{form.bio.length}/180</small></label>
          </div>
          <div className="profile-form-actions">
            <button type="button" className="button button-ghost" onClick={onClose} disabled={busy}>{t("common.cancel")}</button>
            <button type="submit" className="button button-primary" disabled={busy}><Save />{busy ? t("profile.saving") : t("profile.save")}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
