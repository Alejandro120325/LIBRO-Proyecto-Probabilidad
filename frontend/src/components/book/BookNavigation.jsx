import { ArrowLeft, ArrowRight, BarChart3, List, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function BookNavigation({ current, total, isFirst, isLast, turning, onPrevious, onNext, onIndex, onClose, onResults }) {
  const { user } = useAuth();
  return (
    <div className="real-book-navigation">
      <button onClick={onPrevious} disabled={isFirst || turning}><ArrowLeft />Anterior</button>
      <button onClick={onIndex} disabled={turning}><List />Índice</button>
      <span className="book-folio">{current} / {total}</span>
      <button onClick={onResults} disabled={turning}><BarChart3 />{user?.role === "admin" ? "Resultados" : "Mis resultados"}</button>
      <button onClick={onClose}><X />Cerrar</button>
      <button onClick={onNext} disabled={isLast || turning}>Siguiente<ArrowRight /></button>
    </div>
  );
}
