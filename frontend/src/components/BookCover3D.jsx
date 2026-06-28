import { Crown, Feather, ScrollText, Sigma, Sparkles } from "lucide-react";

export default function BookCover3D({ compact = false }) {
  return (
    <div className={`book-scene antique-book-scene ${compact ? "book-scene-compact" : ""}`} aria-label="Libro antiguo 3D de Probabilidad y Estadística">
      <div className="book-object antique-book">
        <div className="book-pages antique-pages" />
        <div className="book-front leather-cover">
          <div className="leather-grain" />
          <span className="ornate-corner corner-tl" /><span className="ornate-corner corner-tr" /><span className="ornate-corner corner-bl" /><span className="ornate-corner corner-br" />
          <div className="gold-frame"><span /><span /></div>
          <div className="book-front-content antique-cover-content">
            <span className="book-kicker"><Sparkles /> Libro Interactivo 3D <Sparkles /></span>
            <div className="arcane-seal"><Sigma /><span /></div>
            <h2>Probabilidad<br /><em>&</em> Estadística</h2>
            <p>Conocimiento · Azar · Descubrimiento</p>
            <div className="book-icons" aria-hidden="true"><Feather /><Crown /><ScrollText /></div>
          </div>
          <div className="book-clasp"><span /></div>
        </div>
        <div className="book-spine antique-spine"><span>PROBABILIDAD & ESTADÍSTICA</span></div>
      </div>
      <div className="book-shadow antique-shadow" />
      <div className="book-glow" />
    </div>
  );
}
