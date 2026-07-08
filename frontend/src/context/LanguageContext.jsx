import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { contentTranslations, translations } from "../i18n/translations.js";

const LanguageContext = createContext(null);
const STORAGE_KEY = "appLanguage";

function interpolate(value, params) {
  return Object.entries(params).reduce((text, [key, replacement]) => text.replaceAll(`{{${key}}}`, String(replacement)), value);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "es");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === "en" ? "en" : "es-419";
  }, [language]);

  const t = useCallback((key, params = {}) => interpolate(translations[language][key] || translations.es[key] || key, params), [language]);
  const translateText = useCallback((value) => {
    if (language === "es" || typeof value !== "string") return value;
    if (contentTranslations[value]) return contentTranslations[value];
    return value
      .replace(/^Unidad (\d+)/, "Unit $1")
      .replace(/^Capítulo (\d+)/, "Chapter $1")
      .replace(/ · Introducción$/, " · Introduction")
      .replace(/ · Fórmulas$/, " · Formulas")
      .replace(/ · Video$/, " · Video")
      .replace(/ · Ejercicio$/, " · Exercise");
  }, [language]);

  const translateObject = useCallback((value) => {
    if (language === "es") return value;
    if (Array.isArray(value)) return value.map(translateObject);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translateObject(item)]));
    return translateText(value);
  }, [language, translateText]);

  const contextValue = useMemo(() => ({ language, setLanguage, t, translateText, translateObject }), [language, t, translateText, translateObject]);
  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider.");
  return context;
}
