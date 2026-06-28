import { BookOpen, GraduationCap, Sparkles } from "lucide-react";

export default function BookCoverPage() {
  return (
    <div className="internal-cover-page">
      <div className="internal-ornament"><Sparkles /></div>
      <p>Universidad · Periodo académico 2026</p>
      <BookOpen className="internal-cover-icon" />
      <h1>Probabilidad<br />y Estadística</h1>
      <h2>Libro Interactivo 3D</h2>
      <div className="internal-divider"><span /></div>
      <div className="book-authors"><strong><GraduationCap /> Integrantes</strong><span>Alejandro Ojeda</span><span>Juan Figueroa</span><span>Josué Vélez</span></div>
    </div>
  );
}
