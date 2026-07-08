import { ArrowLeft, ArrowRight, BookOpen, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import AppFooter from "../components/AppFooter.jsx";
import BookCover3D from "../components/BookCover3D.jsx";
import HeaderPreferences from "../components/HeaderPreferences.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getApiErrorMessage } from "../services/api.js";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const [searchParams] = useSearchParams();
  const demoMode = searchParams.get("demo");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register, isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (demoMode && !isRegister) {
      setForm({ name: "", email: demoMode === "admin" ? "admin@libro.com" : "demo@libro.com", password: "123456" });
    }
  }, [demoMode, isRegister]);

  if (isAuthenticated) return <Navigate to={user?.role === "admin" ? "/admin" : "/book"} replace />;

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (isRegister && form.name.trim().length < 2) return setError(t("auth.invalidName"));
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError(t("auth.invalidEmail"));
    if (form.password.length < 6) return setError(t("auth.invalidPassword"));

    setSubmitting(true);
    try {
      const authenticatedUser = isRegister
        ? await register(form)
        : await login({ email: form.email, password: form.password });
      const defaultPath = authenticatedUser.role === "admin" ? "/admin" : "/book";
      navigate(defaultPath, { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page min-h-screen text-slate-100">
      <div className="landing-grid" />
      <Link to="/" className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
        <ArrowLeft className="size-4" /> {t("auth.back")}
      </Link>
      <div className="auth-preferences"><HeaderPreferences /></div>
      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
        <div className="hidden lg:block">
          <BookCover3D compact />
          <div className="mx-auto mt-2 max-w-sm text-center">
            <p className="text-sm font-bold uppercase tracking-[.24em] text-amber-300">{t("auth.sideTitle")}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">{t("auth.sideText")}</p>
          </div>
        </div>

        <section className="auth-card mx-auto w-full max-w-md">
          <div className="mb-8">
            <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-amber-300 text-[#211408] shadow-lg shadow-amber-500/20"><BookOpen className="size-6" /></span>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-amber-300">{isRegister ? t("auth.new") : t("auth.welcome")}</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">{isRegister ? t("auth.registerTitle") : t("auth.loginTitle")}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">{isRegister ? t("auth.registerText") : t("auth.loginText")}</p>
          </div>

          {demoMode && !isRegister && <div className="mb-5"><Alert type="success">{t("auth.demoReady")}</Alert></div>}
          {error && <div className="mb-5"><Alert onClose={() => setError("")}>{error}</Alert></div>}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {isRegister && (
              <label className="form-field"><span>{t("auth.name")}</span><div><UserRound /><input name="name" value={form.name} onChange={updateField} placeholder="Alejandro Ojeda" autoComplete="name" required /></div></label>
            )}
            <label className="form-field"><span>{t("auth.email")}</span><div><Mail /><input name="email" type="email" value={form.email} onChange={updateField} placeholder="name@email.com" autoComplete="email" required /></div></label>
            <label className="form-field"><span>{t("auth.password")}</span><div><LockKeyhole /><input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={updateField} placeholder={t("auth.passwordPlaceholder")} autoComplete={isRegister ? "new-password" : "current-password"} required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
            <button type="submit" disabled={submitting} className="button button-primary mt-2 w-full">
              {submitting ? t("auth.processing") : isRegister ? t("auth.create") : t("auth.login")} {!submitting && <ArrowRight className="size-5" />}
            </button>
          </form>
          {!isRegister && <div className="demo-switcher"><span>{t("auth.demo")}</span><button type="button" onClick={() => setForm({ name: "", email: "demo@libro.com", password: "123456" })}>{t("common.student")}</button><button type="button" onClick={() => setForm({ name: "", email: "admin@libro.com", password: "123456" })}>{t("common.admin")}</button></div>}
          {!isRegister && <div className="demo-credentials"><p><strong>{t("common.student")}</strong><span>demo@libro.com · 123456</span></p><p><strong>{t("common.admin")}</strong><span>admin@libro.com · 123456</span></p></div>}
          <p className="mt-6 text-center text-sm text-slate-400">
            {isRegister ? t("auth.haveAccount") : t("auth.noAccount")}{" "}
            <Link className="font-bold text-amber-300 hover:text-amber-200" to={isRegister ? "/login" : "/register"}>{isRegister ? t("auth.signIn") : t("auth.signUp")}</Link>
          </p>
        </section>
      </div>
      <AppFooter />
    </div>
  );
}
