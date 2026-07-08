import { useLanguage } from "../context/LanguageContext.jsx";

function EcuadorFlag() {
  return <svg viewBox="0 0 24 16" role="presentation"><path fill="#FCD116" d="M0 0h24v8H0z"/><path fill="#003893" d="M0 8h24v4H0z"/><path fill="#CE1126" d="M0 12h24v4H0z"/><circle cx="12" cy="8" r="2" fill="#D6A63B" stroke="#704C18" strokeWidth=".5"/></svg>;
}

function UnitedStatesFlag() {
  return <svg viewBox="0 0 24 16" role="presentation"><path fill="#fff" d="M0 0h24v16H0z"/><path stroke="#B22234" strokeWidth="1.25" d="M0 .7h24M0 3.2h24M0 5.7h24M0 8.2h24M0 10.7h24M0 13.2h24M0 15.3h24"/><path fill="#3C3B6E" d="M0 0h10.5v8.7H0z"/><path fill="#fff" d="m2 1 .35 1.05h1.1l-.9.65.35 1.05L2 3.1l-.9.65.35-1.05-.9-.65h1.1zm3.3 0 .35 1.05h1.1l-.9.65.35 1.05-.9-.65-.9.65.35-1.05-.9-.65h1.1zm3.2 0 .35 1.05h1.1l-.9.65.35 1.05-.9-.65-.9.65.35-1.05-.9-.65h1.1zM2 5l.35 1.05h1.1l-.9.65.35 1.05L2 7.1l-.9.65.35-1.05-.9-.65h1.1zm3.3 0 .35 1.05h1.1l-.9.65.35 1.05-.9-.65-.9.65.35-1.05-.9-.65h1.1zm3.2 0 .35 1.05h1.1l-.9.65.35 1.05-.9-.65-.9.65.35-1.05-.9-.65h1.1z"/></svg>;
}

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const nextLanguage = language === "es" ? "en" : "es";
  return (
    <button type="button" className="language-switcher" onClick={() => setLanguage(nextLanguage)} aria-label={t("preferences.toggleLanguage")} title={t("preferences.toggleLanguage")}>
      <span className="language-flag" aria-hidden="true">{language === "es" ? <EcuadorFlag /> : <UnitedStatesFlag />}</span>
      <strong>{language.toUpperCase()}</strong>
    </button>
  );
}
