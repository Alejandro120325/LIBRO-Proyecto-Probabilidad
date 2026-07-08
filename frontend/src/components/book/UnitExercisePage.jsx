import { ChevronDown, ChevronUp, Gamepad2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getChapter } from "../../data/chapters.js";
import { unitDetails } from "../../data/bookPages.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function UnitExercisePage({ unit }) {
  const [showSolution, setShowSolution] = useState(false);
  const chapter = getChapter(unit);
  const { t, translateObject } = useLanguage();
  const localizedChapter = translateObject(chapter);
  const { example } = localizedChapter;
  return (
    <div className="unit-book-page exercise-page">
      <p className="book-label">{t("book.chapterPractice", { number: unit })}</p>
      <h1>{t("book.exercise")}</h1>
      <div className="exercise-scroll"><h2>{example.title}</h2><p>{example.description}</p>{example.data && <div className="exercise-data">{example.data.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}</div>}{example.distribution && <div className="exercise-distribution">{example.distribution.map((item) => <div key={item.value}><span>{item.probability}%</span><i style={{ height: `${item.probability}px` }} /><small>{item.value}</small></div>)}</div>}</div>
      <button onClick={() => setShowSolution((value) => !value)} className="solution-toggle">{showSolution ? <ChevronUp /> : <ChevronDown />}{showSolution ? t("book.hideSolution") : t("book.showSolution")}</button>
      {showSolution && <div className="solution-reveal"><ol>{example.steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol><strong>{example.result}</strong></div>}
      <Link to={unitDetails[unit].gamePath} className="book-game-button"><Gamepad2 />{t("book.startGame", { game: localizedChapter.game })}</Link>
    </div>
  );
}
