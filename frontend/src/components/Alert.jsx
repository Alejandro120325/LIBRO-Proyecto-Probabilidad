import { AlertCircle, CheckCircle2, X } from "lucide-react";

export default function Alert({ type = "error", children, onClose }) {
  const success = type === "success";
  const Icon = success ? CheckCircle2 : AlertCircle;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
        success
          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
          : "border-rose-400/25 bg-rose-400/10 text-rose-100"
      }`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p className="flex-1 leading-6">{children}</p>
      {onClose && (
        <button onClick={onClose} aria-label="Cerrar mensaje" className="rounded-lg p-1 hover:bg-white/10">
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
