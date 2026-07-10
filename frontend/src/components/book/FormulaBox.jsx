import { Sigma } from "lucide-react";

export default function FormulaBox({ formula }) {
  return (
    <div className="formula-box">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-cyan-700"><Sigma className="size-4" />{formula.label}</div>
      <div className="my-3 overflow-x-auto whitespace-nowrap font-serif text-lg font-bold text-slate-900 sm:text-xl">{formula.expression}</div>
      <p className="text-xs leading-5 text-slate-600">{formula.note}</p>
    </div>
  );
}
