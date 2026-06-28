import { Compass, Gamepad2, ScrollText, Sparkles } from "lucide-react";

export default function BookProloguePage() {
  return (
    <div className="prologue-page">
      <p className="book-label">Antes de comenzar</p>
      <h1>Prólogo</h1>
      <div className="dropcap-copy"><span>E</span><p>ste libro transforma conceptos de Probabilidad y Estadística en una experiencia que puedes recorrer, practicar y medir. Aprenderás a interpretar evidencia, resumir datos y modelar resultados inciertos.</p></div>
      <p className="book-copy mt-4">Cada unidad está dividida como un capítulo real: introducción, fórmulas, video, ejercicio resuelto y un desafío interactivo.</p>
      <div className="prologue-steps">
        <div><Compass /><span><strong>Navega</strong>con pestañas y páginas</span></div>
        <div><ScrollText /><span><strong>Estudia</strong>teoría y ejemplos</span></div>
        <div><Gamepad2 /><span><strong>Practica</strong>y guarda resultados</span></div>
      </div>
      <blockquote><Sparkles /> Abre el índice y elige tu próximo descubrimiento.</blockquote>
    </div>
  );
}
