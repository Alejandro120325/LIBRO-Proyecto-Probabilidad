import { useLanguage } from "../../context/LanguageContext.jsx";

export default function BookFontSizeControls({
  scale,
  onDecrease,
  onIncrease,
  onReset,
  canDecrease,
  canIncrease,
  compact = false,
}) {
  const { t } = useLanguage();
  const percentage = Math.round(Number(scale || 1) * 100);

  return (
    <section className={`book-font-controls ${compact ? "book-font-controls-compact" : ""}`} aria-label={t("book.fontSize")}>
      <span className="book-font-label">{t("book.fontSize")}</span>
      <button
        type="button"
        onClick={onDecrease}
        disabled={!canDecrease}
        aria-label={t("book.decreaseFontSize")}
        title={t("book.decreaseFontSize")}
      >
        A-
      </button>
      <span className="book-font-value" aria-live="polite">{percentage}%</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={!canIncrease}
        aria-label={t("book.increaseFontSize")}
        title={t("book.increaseFontSize")}
      >
        A+
      </button>
      <button
        type="button"
        className="book-font-reset"
        onClick={onReset}
        aria-label={t("book.resetFontSize")}
        title={t("book.resetFontSize")}
      >
        100%
      </button>
    </section>
  );
}
