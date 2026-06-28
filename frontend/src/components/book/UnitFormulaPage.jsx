import { Sigma } from "lucide-react";
import { getChapter } from "../../data/chapters.js";
import { unitDetails } from "../../data/bookPages.js";
import FormulaBox from "../FormulaBox.jsx";

export default function UnitFormulaPage({ unit }) {
  const chapter = getChapter(unit);
  return (
    <div className="unit-book-page formula-page">
      <p className="book-label">Capítulo {unit} · Lenguaje matemático</p>
      <h1>Fórmulas esenciales</h1>
      <div className="formula-stack">{chapter.formulas.map((formula) => <FormulaBox key={formula.label} formula={formula} />)}</div>
      {unit === 2 && <div className="book-data-table"><div><strong>Datos</strong>{[4, 7, 7, 9, 10, 13].map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}</div><div><strong>Posición</strong>{[1, 2, 3, 4, 5, 6].map((value) => <span key={value}>{value}</span>)}</div></div>}
      <section className="symbol-legend"><h2><Sigma />Símbolos y lectura</h2><ul>{unitDetails[unit].symbols.map((symbol) => <li key={symbol}>{symbol}</li>)}</ul></section>
    </div>
  );
}
