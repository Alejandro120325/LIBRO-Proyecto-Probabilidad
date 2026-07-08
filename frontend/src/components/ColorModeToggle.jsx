import { Moon, Sun } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ColorModeToggle() {
  const { mode, toggleMode } = useTheme();
  const { t } = useLanguage();
  const nextLabel = mode === "dark" ? t("preferences.light") : t("preferences.dark");

  return <button type="button" className="preference-button" onClick={toggleMode} aria-label={nextLabel} title={nextLabel}>{mode === "dark" ? <Sun /> : <Moon />}</button>;
}
