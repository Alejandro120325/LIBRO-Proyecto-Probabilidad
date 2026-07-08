import { BarChart3, CircleDot, Coins, Dices, FileText } from "lucide-react";

export default function AcademicBackdrop() {
  return (
    <div className="academic-backdrop" aria-hidden="true">
      <span className="floating-formula floating-equation landing-bg-symbol formula-glow formula-pulse formula-bayes">P(A|B)</span>
      <span className="floating-formula floating-equation landing-bg-symbol formula-glow formula-pulse formula-mean">x̄ = Σx/n</span>
      <span className="floating-formula floating-equation landing-bg-symbol formula-glow formula-pulse formula-expected">E(X)</span>
      <span className="floating-formula floating-equation landing-bg-symbol formula-glow formula-pulse formula-variance">Var(X)</span>
      <Dices className="academic-symbol landing-bg-symbol formula-glow formula-pulse symbol-dice" />
      <Coins className="academic-symbol landing-bg-symbol formula-glow formula-pulse symbol-coins" />
      <BarChart3 className="academic-symbol landing-bg-symbol formula-glow formula-pulse symbol-chart" />
      <FileText className="academic-symbol landing-bg-symbol formula-glow formula-pulse symbol-page" />
      <svg className="probability-network background-stat-line landing-bg-symbol formula-glow formula-pulse stat-line-glow" viewBox="0 0 320 180" role="presentation">
        <path d="M22 132 88 84 154 110 218 42 298 68" />
        {[{ x:22,y:132 },{ x:88,y:84 },{ x:154,y:110 },{ x:218,y:42 },{ x:298,y:68 }].map((point) => <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r="4" />)}
      </svg>
      <CircleDot className="academic-symbol landing-bg-symbol formula-glow formula-pulse symbol-node" />
    </div>
  );
}
