import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const THEME_OPTIONS = [
  { id: "classic-gold", label: "Ámbar Académico", swatches: ["#120E09", "#E0A94F", "#F1DEB6"] },
  { id: "executive-blue", label: "Azul Bruma", swatches: ["#08111C", "#7BAFD4", "#EAF0F2"] },
  { id: "slate-green", label: "Salvia Profesional", swatches: ["#08130E", "#A8C686", "#EEF0D5"] },
  { id: "academic-burgundy", label: "Terracota Suave", swatches: ["#160D09", "#E08A5B", "#F1D6B8"] },
  { id: "premium-graphite", label: "Grafito Cálido", swatches: ["#0B0C0E", "#C8A96A", "#E8E1D2"] },
];

const STORAGE_KEY = "appTheme";
const MODE_STORAGE_KEY = "appColorMode";
const DEFAULT_THEME = THEME_OPTIONS[0].id;
const ThemeContext = createContext(null);
const legacyThemes = {
  "classic-library": "classic-gold",
  "academic-night": "executive-blue",
  "emerald-forest": "slate-green",
  "imperial-wine": "academic-burgundy",
  "modern-graphite": "premium-graphite",
};

function getInitialTheme() {
  const storedTheme = localStorage.getItem(STORAGE_KEY);
  if (THEME_OPTIONS.some(({ id }) => id === storedTheme)) return storedTheme;

  const legacyTheme = legacyThemes[localStorage.getItem("probabilidad_theme")];
  return legacyTheme || DEFAULT_THEME;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [mode, setMode] = useState(() => localStorage.getItem(MODE_STORAGE_KEY) === "light" ? "light" : "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    localStorage.removeItem("probabilidad_theme");
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo(() => ({ theme, setTheme, themes: THEME_OPTIONS, mode, setMode, toggleMode: () => setMode((current) => current === "dark" ? "light" : "dark") }), [theme, mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe utilizarse dentro de ThemeProvider.");
  return context;
}
