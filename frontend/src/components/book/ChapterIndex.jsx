import { ArrowUpRight, BrainCircuit, ChartNoAxesCombined, CheckCircle2, Dices } from "lucide-react";
import { chapters } from "../../data/chapters.js";

const icons = [BrainCircuit, ChartNoAxesCombined, Dices];

export default function ChapterIndex({ onSelect, completedUnits = [] }) {
  return (
    <div className="h-full">
      <p className="book-label">Tabla de contenidos</p>
      <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-slate-900">Tres ideas esenciales</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">Selecciona una unidad para estudiar sus conceptos, fórmulas y ejemplo resuelto.</p>
      <div className="mt-6 space-y-3">
        {chapters.map((chapter, index) => {
          const Icon = icons[index];
          const completed = completedUnits.includes(chapter.id);
          return (
            <button key={chapter.id} onClick={() => onSelect(chapter.id)} className={`index-entry index-entry-${chapter.theme}`}>
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-current/10"><Icon className="size-5" /></span>
              <span className="min-w-0 flex-1 text-left"><small>Unidad 0{chapter.id}</small><strong>{chapter.title}</strong><em>{chapter.category}</em></span>
              {completed ? <CheckCircle2 className="size-5 text-emerald-600" /> : <ArrowUpRight className="size-5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
