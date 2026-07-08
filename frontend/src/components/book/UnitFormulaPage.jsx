import { Sigma } from "lucide-react";
import { getChapter } from "../../data/chapters.js";
import { unitDetails } from "../../data/bookPages.js";
import FormulaBox from "../FormulaBox.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function UnitFormulaPage({ unit }) {
  const chapter = getChapter(unit);
  const { t, translateObject } = useLanguage();
  const localizedChapter = translateObject(chapter);
  return (
    <div className="unit-book-page formula-page">
      <p className="book-label">{t("book.chapterMath", { number: unit })}</p>
      <h1>{t("book.formulas")}</h1>
      <div className="formula-stack">{localizedChapter.formulas.map((formula) => <FormulaBox key={formula.label} formula={formula} />)}</div>
      {unit === 2 && <div className="book-data-table"><div><strong>{t("book.data")}</strong>{[4, 7, 7, 9, 10, 13].map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}</div><div><strong>{t("book.position")}</strong>{[1, 2, 3, 4, 5, 6].map((value) => <span key={value}>{value}</span>)}</div></div>}
      <section className="symbol-legend"><h2><Sigma />{t("book.symbols")}</h2><ul>{translateObject(unitDetails[unit].symbols).map((symbol) => <li key={symbol}>{symbol}</li>)}</ul></section>
    </div>
  );
}
