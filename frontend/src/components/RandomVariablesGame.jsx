import GameLayout from "./GameLayout.jsx";
import RandomSimulator from "./RandomSimulator.jsx";

export default function RandomVariablesGame({ game }) {
  return <GameLayout unitId={3} game={game}><RandomSimulator /></GameLayout>;
}
