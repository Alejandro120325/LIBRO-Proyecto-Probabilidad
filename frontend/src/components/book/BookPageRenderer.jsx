import BookCoverPage from "./BookCoverPage.jsx";
import BookIndex from "./BookIndex.jsx";
import BookProloguePage from "./BookProloguePage.jsx";
import BookUtilityPage from "./BookUtilityPage.jsx";
import UnitExercisePage from "./UnitExercisePage.jsx";
import UnitFormulaPage from "./UnitFormulaPage.jsx";
import UnitIntroPage from "./UnitIntroPage.jsx";
import UnitVideoPage from "./UnitVideoPage.jsx";

export default function BookPageRenderer({ page, onNavigate, bookFontScale = 1 }) {
  let content;

  if (!page) {
    content = <div className="blank-book-page" />;
  } else if (page.type === "cover") {
    content = <BookCoverPage />;
  } else if (page.type === "prologue") {
    content = <BookProloguePage />;
  } else if (page.type === "index") {
    content = <BookIndex />;
  } else if (page.type === "unit-intro") {
    content = <UnitIntroPage unit={page.unit} />;
  } else if (page.type === "unit-formulas") {
    content = <UnitFormulaPage unit={page.unit} />;
  } else if (page.type === "unit-video") {
    content = <UnitVideoPage unit={page.unit} />;
  } else if (page.type === "unit-exercise") {
    content = <UnitExercisePage unit={page.unit} />;
  } else {
    content = <BookUtilityPage type={page.type} />;
  }

  return (
    <div className="book-content" style={{ "--book-font-scale": bookFontScale }}>
      {content}
    </div>
  );
}
