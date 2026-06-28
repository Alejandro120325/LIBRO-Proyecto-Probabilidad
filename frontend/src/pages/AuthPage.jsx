import { ArrowLeft, ArrowRight, BookOpen, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import BookCover3D from "../components/BookCover3D.jsx";
import { useAuth } from "../context/AuthContext.jsx";
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
    if (isRegister && form.name.trim().length < 2) return setError("Ingresa un nombre válido.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Ingresa un correo electrónico válido.");
    if (form.password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");

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
        <ArrowLeft className="size-4" /> Volver a la portada
      </Link>
      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
        <div className="hidden lg:block">
          <BookCover3D compact />
          <div className="mx-auto mt-2 max-w-sm text-center">
            <p className="text-sm font-bold uppercase tracking-[.24em] text-amber-300">Tu crónica, en un solo lugar</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">Estudia, completa desafíos y consulta tu evolución en cada unidad.</p>
          </div>
        </div>

        <section className="auth-card mx-auto w-full max-w-md">
          <div className="mb-8">
            <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-amber-300 text-[#211408] shadow-lg shadow-amber-500/20"><BookOpen className="size-6" /></span>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-amber-300">{isRegister ? "Nueva crónica" : "Bienvenido de vuelta"}</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">{isRegister ? "Comienza tu recorrido" : "Continúa aprendiendo"}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">{isRegister ? "Crea tu perfil para guardar resultados y progreso." : "Ingresa tus datos para abrir tu libro interactivo."}</p>
          </div>

          {demoMode && !isRegister && <div className="mb-5"><Alert type="success">Las credenciales demo ya están listas. Solo pulsa “Iniciar sesión”.</Alert></div>}
          {error && <div className="mb-5"><Alert onClose={() => setError("")}>{error}</Alert></div>}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {isRegister && (
              <label className="form-field"><span>Nombre completo</span><div><UserRound /><input name="name" value={form.name} onChange={updateField} placeholder="Alejandro Ojeda" autoComplete="name" required /></div></label>
            )}
            <label className="form-field"><span>Correo electrónico</span><div><Mail /><input name="email" type="email" value={form.email} onChange={updateField} placeholder="nombre@correo.com" autoComplete="email" required /></div></label>
            <label className="form-field"><span>Contraseña</span><div><LockKeyhole /><input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={updateField} placeholder="Mínimo 6 caracteres" autoComplete={isRegister ? "new-password" : "current-password"} required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
            <button type="submit" disabled={submitting} className="button button-primary mt-2 w-full">
              {submitting ? "Procesando…" : isRegister ? "Crear cuenta" : "Iniciar sesión"} {!submitting && <ArrowRight className="size-5" />}
            </button>
          </form>
          {!isRegister && <div className="demo-switcher"><span>Accesos de demostración</span><button type="button" onClick={() => setForm({ name: "", email: "demo@libro.com", password: "123456" })}>Estudiante</button><button type="button" onClick={() => setForm({ name: "", email: "admin@libro.com", password: "123456" })}>Administrador</button></div>}
          <p className="mt-6 text-center text-sm text-slate-400">
            {isRegister ? "¿Ya tienes una cuenta?" : "¿Aún no tienes una cuenta?"}{" "}
            <Link className="font-bold text-amber-300 hover:text-amber-200" to={isRegister ? "/login" : "/register"}>{isRegister ? "Inicia sesión" : "Regístrate"}</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
