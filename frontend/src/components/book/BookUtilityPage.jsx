import { BarChart3, BookOpenCheck, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function BookUtilityPage({ type }) {
  const { user } = useAuth();
  if (type === "epilogue") return <div className="epilogue-page"><Sparkles /><p className="book-label">Fin de la primera travesía</p><h1>Epílogo</h1><p>Las probabilidades no predicen el futuro con certeza; nos enseñan a razonar mejor frente a la incertidumbre. Regresa a cualquier capítulo, practica y supera tu propia marca.</p><BookOpenCheck /><blockquote>El conocimiento crece cada vez que vuelves a abrir el libro.</blockquote></div>;

  const admin = user?.role === "admin";
  const results = type === "results";
  const path = admin
    ? results ? "/admin/results" : "/admin/leaderboard"
    : results ? "/my-results" : "/leaderboard";
  const Icon = results ? BarChart3 : Trophy;
  return (
    <div className="utility-book-page">
      <Icon />
      <p className="book-label">{results ? "Tu recorrido" : "Comunidad de aprendizaje"}</p>
      <h1>{results ? "Resultados" : "Ranking"}</h1>
      <p>{results ? "Consulta tus intentos, promedio general y mejores resultados por unidad." : "Descubre las mejores puntuaciones y compara tu avance con otros estudiantes."}</p>
      <Link to={path} className="book-game-button">Abrir {results ? "mis resultados" : "ranking completo"}</Link>
    </div>
  );
}
