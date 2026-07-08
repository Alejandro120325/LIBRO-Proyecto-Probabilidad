import { Check, ChevronDown, Palette, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const { t, translateText } = useLanguage();
  const [open, setOpen] = useState(false);
  const [footerOffset, setFooterOffset] = useState(0);
  const containerRef = useRef(null);
  const location = useLocation();
  const activeTheme = themes.find((option) => option.id === theme) || themes[0];
  const isBook = location.pathname.startsWith("/book");

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const footer = document.querySelector(".app-footer");
    if (!footer) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      const visibleHeight = Math.ceil(entry.intersectionRect.height);
      setFooterOffset(entry.isIntersecting ? Math.max(24, visibleHeight + 16) : 0);
    }, { threshold:[0, 0.1, 0.25, 0.5, 0.75, 1] });

    observer.observe(footer);
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const selectTheme = (themeId) => {
    setTheme(themeId);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`theme-switcher ${isBook ? "theme-switcher-book" : ""} ${footerOffset ? "theme-switcher-footer-visible" : ""}`}
      style={footerOffset ? { "--footer-overlap":`${footerOffset}px` } : undefined}
    >
      {open && (
        <section className="theme-switcher-panel" id="theme-options" aria-label={t("preferences.appearance")}>
          <header><div><span>{t("preferences.appearance")}</span><strong>{t("preferences.chooseTheme")}</strong></div><button type="button" onClick={() => setOpen(false)} aria-label={t("preferences.closeThemes")}><X /></button></header>
          <div className="theme-options-list">
            {themes.map((option) => (
              <button key={option.id} type="button" className={`theme-option ${option.id === theme ? "theme-option-active" : ""}`} onClick={() => selectTheme(option.id)} aria-pressed={option.id === theme}>
                <span className="theme-swatches" aria-hidden="true">{option.swatches.map((color) => <i key={color} style={{ backgroundColor: color }} />)}</span>
                <span>{translateText(option.label)}</span>
                {option.id === theme && <Check aria-hidden="true" />}
              </button>
            ))}
          </div>
        </section>
      )}
      <button type="button" className="theme-switcher-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="theme-options" aria-label={t("preferences.changeTheme")}>
        <Palette aria-hidden="true" />
        <span>{translateText(activeTheme.label)}</span>
        <span className="theme-trigger-swatches" aria-hidden="true">{activeTheme.swatches.map((color) => <i key={color} style={{ backgroundColor: color }} />)}</span>
        <ChevronDown className={open ? "theme-chevron-open" : ""} aria-hidden="true" />
      </button>
    </div>
  );
}
