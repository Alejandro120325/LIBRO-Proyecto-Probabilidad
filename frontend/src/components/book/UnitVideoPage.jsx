import { Play, Video } from "lucide-react";
import { getChapter } from "../../data/chapters.js";
import { unitDetails } from "../../data/bookPages.js";

export default function UnitVideoPage({ unit }) {
  const chapter = getChapter(unit);
  return (
    <div className="unit-video-page">
      <p className="book-label">Capítulo {unit} · Recurso audiovisual</p>
      <h1>Video explicativo</h1>
      <div className="embedded-video-placeholder"><div className="video-runes" /><span><Play /></span><h2>{chapter.title}</h2><p>{unitDetails[unit].videoPlaceholder}</p><small><Video /> Espacio preparado para un enlace embed de YouTube</small></div>
      <p className="video-note">Después del video, continúa al ejercicio para aplicar lo aprendido.</p>
    </div>
  );
}
