import { Navigate, useParams } from "react-router-dom";
import BayesGame from "../components/games/BayesGame.jsx";
import RandomVariablesGame from "../components/games/RandomVariablesGame.jsx";
import StatisticsGame from "../components/games/StatisticsGame.jsx";
import { getGame } from "../data/questions.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function GamePage({ unit: fixedUnit }) {
  const { unitId } = useParams();
  const unit = Number(fixedUnit || unitId);
  const { translateObject } = useLanguage();
  const game = translateObject(getGame(unit));
  if (!game) return <Navigate to="/book" replace />;
  if (unit === 1) return <BayesGame game={game} />;
  if (unit === 2) return <StatisticsGame game={game} />;
  return <RandomVariablesGame game={game} />;
}
