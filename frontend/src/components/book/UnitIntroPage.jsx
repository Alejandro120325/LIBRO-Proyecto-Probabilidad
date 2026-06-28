import { Lightbulb, MapPin, Target } from "lucide-react";
import { getChapter } from "../../data/chapters.js";
import { unitDetails } from "../../data/bookPages.js";

export default function UnitIntroPage({ unit }) {
  const chapter = getChapter(unit);
  return (
    <div className="unit-book-page">
      <p className="book-label">Capítulo {unit}</p>
      <h1>{unitDetails[unit].heading}</h1>
      <p className="chapter-lead">{chapter.subtitle}</p>
      <section><h2><MapPin />Introducción</h2><p>{chapter.definition}</p></section>
      <section><h2><Lightbulb />Explicación sencilla</h2><p>{chapter.explanation}</p></section>
      <section><h2><Target />¿Para qué sirve?</h2><p>{chapter.serves}</p></section>
      <div className="applications-grid">{chapter.applications.map((item) => <span key={item}>{item}</span>)}</div>
    </div>
  );
}
