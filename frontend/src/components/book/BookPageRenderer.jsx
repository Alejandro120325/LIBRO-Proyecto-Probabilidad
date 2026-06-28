import BookCoverPage from "./BookCoverPage.jsx";
import BookIndex from "./BookIndex.jsx";
import BookProloguePage from "./BookProloguePage.jsx";
import BookUtilityPage from "./BookUtilityPage.jsx";
import UnitExercisePage from "./UnitExercisePage.jsx";
import UnitFormulaPage from "./UnitFormulaPage.jsx";
import UnitIntroPage from "./UnitIntroPage.jsx";
import UnitVideoPage from "./UnitVideoPage.jsx";

export default function BookPageRenderer({ page, onNavigate }) {
  if (!page) return <div className="blank-book-page" />;
  if (page.type === "cover") return <BookCoverPage />;
  if (page.type === "prologue") return <BookProloguePage />;
  if (page.type === "index") return <BookIndex />;
  if (page.type === "unit-intro") return <UnitIntroPage unit={page.unit} />;
  if (page.type === "unit-formulas") return <UnitFormulaPage unit={page.unit} />;
  if (page.type === "unit-video") return <UnitVideoPage unit={page.unit} />;
  if (page.type === "unit-exercise") return <UnitExercisePage unit={page.unit} />;
  return <BookUtilityPage type={page.type} />;
}
