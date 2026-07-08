import { ArrowLeft, ShieldX } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function AccessDeniedPage() {
  const { t } = useLanguage();
  return (
    <div className="fantasy-bg grid min-h-screen place-items-center px-5 text-center text-stone-100">
      <div className="max-w-lg rounded-[2rem] border border-amber-300/15 bg-black/35 p-10 shadow-2xl backdrop-blur-xl">
        <ShieldX className="mx-auto size-14 text-amber-300" />
        <p className="mt-6 text-xs font-black uppercase tracking-[.24em] text-amber-300">{t("access.eyebrow")}</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">{t("access.title")}</h1>
        <p className="mt-4 leading-7 text-stone-400">{t("access.text")}</p>
        <Link to="/dashboard" className="button button-primary mt-7"><ArrowLeft className="size-4" />{t("access.back")}</Link>
      </div>
    </div>
  );
}
