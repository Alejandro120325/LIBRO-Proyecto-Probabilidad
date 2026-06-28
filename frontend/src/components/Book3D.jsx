import { ArrowRight, BookOpen, BrainCircuit, ChartNoAxesCombined, Dices, Sparkles } from "lucide-react";
import BookCover3D from "./BookCover3D.jsx";
import ChapterContent from "./ChapterContent.jsx";
import ChapterIndex from "./ChapterIndex.jsx";

export default function Book3D({ isOpen, currentPage, turning, completedUnits, onOpen, onSelect }) {
  if (!isOpen) {
    return (
      <div className="book-launch">
        <BookCover3D compact />
        <div className="book-launch-copy">
          <div className="eyebrow"><Sparkles className="size-4" /> Edición personal</div>
          <h1>Tu libro está listo para abrirse.</h1>
          <p>Recorre el índice, estudia a tu ritmo y accede a un desafío al final de cada unidad.</p>
          <button onClick={onOpen} className="button button-primary">Abrir libro <BookOpen className="size-5" /></button>
        </div>
      </div>
    );
  }

  const chapter = typeof currentPage === "object" && currentPage !== null ? currentPage : null;

  return (
    <div className={`open-book-shell ${turning ? "is-turning" : ""}`}>
      <div className="book-edge book-edge-top" />
      <div className="open-book">
        {chapter ? (
          <ChapterContent chapter={chapter} />
        ) : (
          <>
            <section className="book-paper book-paper-left index-intro">
              <div className="book-page-number">01</div>
              <p className="book-label">Probabilidad & Estadística</p>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-tight tracking-tight text-slate-900">Aprender es conectar ideas con evidencia.</h1>
              <p className="mt-5 text-sm leading-7 text-slate-600">Este libro reúne conceptos, fórmulas, ejemplos y práctica en un recorrido diseñado para transformar intuición en razonamiento cuantitativo.</p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[{ icon: BrainCircuit, value: "Bayes" }, { icon: ChartNoAxesCombined, value: "Datos" }, { icon: Dices, value: "Azar" }].map(({ icon: Icon, value }) => <div key={value} className="index-topic"><Icon /><span>{value}</span></div>)}
              </div>
              <blockquote className="mt-9 border-l-2 border-cyan-600 pl-4 font-serif text-lg italic leading-7 text-slate-700">“En Dios confiamos. Todos los demás deben traer datos.”</blockquote>
              <p className="mt-2 pl-4 text-xs text-slate-400">— W. Edwards Deming</p>
            </section>
            <section className="book-paper book-paper-right"><div className="book-page-number">02</div><ChapterIndex onSelect={onSelect} completedUnits={completedUnits} /></section>
          </>
        )}
        <div className="book-gutter" />
        <div className="turn-sheet"><span><ArrowRight /></span></div>
      </div>
      <div className="book-edge book-edge-bottom" />
    </div>
  );
}
