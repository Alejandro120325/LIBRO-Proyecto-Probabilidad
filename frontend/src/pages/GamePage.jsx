import { Navigate, useParams } from "react-router-dom";
import BayesGame from "../components/BayesGame.jsx";
import RandomVariablesGame from "../components/RandomVariablesGame.jsx";
import StatisticsGame from "../components/StatisticsGame.jsx";
import { getGame } from "../data/questions.js";

export default function GamePage({ unit: fixedUnit }) {
  const { unitId } = useParams();
  const unit = Number(fixedUnit || unitId);
  const game = getGame(unit);
  if (!game) return <Navigate to="/book" replace />;
  if (unit === 1) return <BayesGame game={game} />;
  if (unit === 2) return <StatisticsGame game={game} />;
  return <RandomVariablesGame game={game} />;
}
