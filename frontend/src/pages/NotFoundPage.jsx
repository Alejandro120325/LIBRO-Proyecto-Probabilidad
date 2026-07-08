import { ArrowLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <div className="grid min-h-screen place-items-center bg-[#050816] px-5 text-center text-white">
      <div><Compass className="mx-auto size-12 text-cyan-300" /><p className="mt-6 text-xs font-bold uppercase tracking-[.25em] text-cyan-300">Error 404</p><h1 className="mt-2 text-4xl font-black">{t("notFound.title")}</h1><p className="mt-3 text-slate-400">{t("notFound.text")}</p><Link to="/" className="button button-primary mt-7"><ArrowLeft className="size-4" />{t("notFound.back")}</Link></div>
    </div>
  );
}
