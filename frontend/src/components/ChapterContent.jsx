import { ArrowRight, BookMarked, Lightbulb, Target } from "lucide-react";
import { Link } from "react-router-dom";
import ExampleBox from "./ExampleBox.jsx";
import FormulaBox from "./FormulaBox.jsx";
import VideoBox from "./VideoBox.jsx";

export default function ChapterContent({ chapter }) {
  const gameRoutes = { 1: "/game/bayes", 2: "/game/statistics", 3: "/game/random-variables" };
  return (
    <>
      <section className="book-paper book-paper-left">
        <div className="book-page-number">0{chapter.id + 1}</div>
        <p className="book-label">Unidad 0{chapter.id} · {chapter.category}</p>
        <h2 className="mt-2 font-serif text-3xl font-bold leading-tight tracking-tight text-slate-900">{chapter.title}</h2>
        <p className="mt-2 text-sm italic text-slate-500">{chapter.subtitle}</p>

        <div className="mt-5 space-y-4">
          <div><h3 className="book-subheading"><BookMarked />¿Qué es?</h3><p className="book-copy">{chapter.definition}</p></div>
          <div><h3 className="book-subheading"><Lightbulb />Explicación sencilla</h3><p className="book-copy">{chapter.explanation}</p></div>
          <div><h3 className="book-subheading"><Target />¿Para qué sirve?</h3><p className="book-copy">{chapter.serves}</p></div>
        </div>

        <div className="mt-5 space-y-3">{chapter.formulas.map((formula) => <FormulaBox key={formula.label} formula={formula} />)}</div>
      </section>

      <section className="book-paper book-paper-right">
        <div className="book-page-number">0{chapter.id + 2}</div>
        <ExampleBox example={chapter.example} />
        <div className="mt-4">
          <p className="book-label">Aplicaciones reales</p>
          <div className="mt-2 flex flex-wrap gap-2">{chapter.applications.map((item) => <span key={item} className="application-chip">{item}</span>)}</div>
        </div>
        <div className="mt-4 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-3">
          <p className="text-[10px] font-black uppercase tracking-[.16em] text-amber-700">Mini resumen</p>
          <p className="mt-1 text-xs leading-5 text-amber-950">{chapter.summary}</p>
        </div>
        <div className="mt-4"><VideoBox title={chapter.videoTitle} /></div>
        <Link to={gameRoutes[chapter.id]} className="book-game-button">Ir a {chapter.game}<ArrowRight className="size-4" /></Link>
      </section>
    </>
  );
}
