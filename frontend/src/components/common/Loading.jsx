import { LoaderCircle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function Loading({ fullScreen = false, label }) {
  const { t } = useLanguage();
  return (
    <div className={`grid place-items-center ${fullScreen ? "min-h-screen bg-[#050816]" : "min-h-60"}`}>
      <div className="flex flex-col items-center gap-3 text-slate-300">
        <LoaderCircle className="size-7 animate-spin text-cyan-300" aria-hidden="true" />
        <span className="text-sm font-semibold">{label || t("state.loading")}…</span>
      </div>
    </div>
  );
}
