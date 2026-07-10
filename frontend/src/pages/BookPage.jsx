import { Component, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import BookNavigation from "../components/book/BookNavigation.jsx";
import OpenBook3D from "../components/book/OpenBook3D.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { bookIndexGroups, bookPages, getBookPageIndex, unitDetails } from "../data/bookPages.js";
import { getChapter } from "../data/chapters.js";
import { useBookAccessibility } from "../context/BookAccessibilityContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

function joinReadableParts(parts) {
  return parts
    .flat(Infinity)
    .filter(Boolean)
    .map((part) => String(part).replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(". ");
}

function makeFormulaReadable(expression) {
  return String(expression || "")
    .replace("P(A|B) = [P(B|A) · P(A)] / P(B)", "P de A dado B es igual a P de B dado A por P de A, dividido para P de B")
    .replace("P(B) = P(B|A) · P(A) + P(B|Aᶜ) · P(Aᶜ)", "P de B es igual a P de B dado A por P de A, más P de B dado no A por P de no A")
    .replace("x̄ = (x₁ + x₂ + ··· + xₙ) / n", "La media es igual a la suma de todos los valores, dividida para n")
    .replace("Me = valor central de los datos ordenados", "La mediana es el valor central de los datos ordenados")
    .replace("Mo = dato con mayor frecuencia", "La moda es el dato con mayor frecuencia")
    .replace("P(X=x) ≥ 0  y  ΣP(X=x) = 1", "La probabilidad de X igual a x es mayor o igual que cero, y la suma de todas las probabilidades es igual a uno")
    .replace("E(X) = Σ x · P(x)", "El valor esperado de X es la suma de cada valor por su probabilidad")
    .replace("Var(X) = E(X²) - [E(X)]²", "La varianza de X es el valor esperado de X al cuadrado menos el valor esperado de X elevado al cuadrado");
}

function getReadableBookPageText(page, { t, translateObject, translateText }) {
  if (!page) return "";

  if (page.type === "cover") {
    return joinReadableParts([
      t("book.title"),
      t("book.subtitle"),
      t("book.coverPeriod"),
      `${t("book.authors")}: Alejandro Ojeda, Juan Figueroa, Josue Vele`,
    ]);
  }

  if (page.type === "prologue") {
    return joinReadableParts([
      t("book.before"),
      t("book.prologue"),
      `${t("book.prologueInitial")}${t("book.prologueText")}`,
      t("book.prologueDetail"),
      `${t("book.navigate")}${t("book.navigateText")}`,
      `${t("book.study")}${t("book.studyText")}`,
      `${t("book.practice")}${t("book.practiceText")}`,
      t("book.prologueQuote"),
    ]);
  }

  if (page.type === "index") {
    return joinReadableParts([
      t("book.chapterIndex"),
      bookIndexGroups.map((group) => {
        const pageTitles = group.pages
          .map((pageId) => bookPages.find((item) => item.id === pageId)?.title)
          .filter(Boolean)
          .map(translateText)
          .join(", ");
        return `${translateText(group.title)}: ${pageTitles}`;
      }),
    ]);
  }

  if (page.type?.startsWith("unit-")) {
    const chapter = translateObject(getChapter(page.unit));
    const unitHeading = translateText(unitDetails[page.unit]?.heading || page.title);

    if (!chapter) return translateText(page.title);

    if (page.type === "unit-intro") {
      return joinReadableParts([
        unitHeading,
        chapter.subtitle,
        t("book.introduction"),
        chapter.definition,
        t("book.simple"),
        chapter.explanation,
        t("book.purpose"),
        chapter.serves,
        chapter.applications?.join(", "),
      ]);
    }

    if (page.type === "unit-formulas") {
      return joinReadableParts([
        unitHeading,
        t("book.formulas"),
        chapter.formulas?.map((formula) => `${formula.label}: ${makeFormulaReadable(formula.expression)}. ${formula.note}`),
        t("book.symbols"),
        translateObject(unitDetails[page.unit]?.symbols || []).join(". "),
      ]);
    }

    if (page.type === "unit-video") {
      return joinReadableParts([
        unitHeading,
        t("book.video"),
        translateText(chapter.videoTitle),
        translateText(unitDetails[page.unit]?.videoPlaceholder),
        t("book.videoSpace"),
        t("book.videoNote"),
      ]);
    }

    if (page.type === "unit-exercise") {
      const example = chapter.example;
      return joinReadableParts([
        unitHeading,
        t("book.exercise"),
        example?.title,
        example?.description,
        example?.data ? `${t("book.data")}: ${example.data.join(", ")}` : null,
        example?.distribution?.map((item) => `${item.value}: ${item.probability}%`),
        t("book.showSolution"),
        t("book.startGame", { game: chapter.game }),
      ]);
    }
  }

  if (page.type === "results") {
    return joinReadableParts([t("common.results"), t("book.resultsText"), t("book.openResults")]);
  }

  if (page.type === "ranking") {
    return joinReadableParts([t("common.ranking"), t("book.rankingText"), t("book.openRanking")]);
  }

  if (page.type === "epilogue") {
    return joinReadableParts([t("book.epilogue"), t("book.epilogueText"), t("book.epilogueQuote")]);
  }

  return translateText(page.title || "");
}

function BookErrorState({ unavailable = false }) {
  const { t } = useLanguage();
  return <ErrorState title={t("book.errorTitle")} message={t(unavailable ? "book.unavailableText" : "book.errorText")} onRetry={() => window.location.reload()} />;
}

function getInitialPage(unitId, pageId) {
  if (pageId) return getBookPageIndex(pageId);
  return unitId ? getBookPageIndex(`u${unitId}-intro`) : 0;
}

class BookErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <BookErrorState />;
    }
    return this.props.children;
  }
}

function BookExperience() {
  const { language, t, translateObject, translateText } = useLanguage();
  const { bookFontScale } = useBookAccessibility();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const requestedPageId = searchParams.get("page");
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(() => getInitialPage(id, requestedPageId));
  const [turning, setTurning] = useState(false);
  const [direction, setDirection] = useState("next");
  const [singlePage, setSinglePage] = useState(() => window.matchMedia("(max-width: 900px)").matches);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const update = () => setSinglePage(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const targetIndex = getInitialPage(id, requestedPageId);
    if (targetIndex === currentIndex) return undefined;
    setDirection(targetIndex > currentIndex ? "next" : "previous");
    setTurning(true);
    const pageTimer = window.setTimeout(() => setCurrentIndex(targetIndex), 260);
    const finishTimer = window.setTimeout(() => setTurning(false), 650);
    return () => { window.clearTimeout(pageTimer); window.clearTimeout(finishTimer); };
  }, [id, requestedPageId]);

  const navigateToPage = (pageId) => {
    if (turning) return;
    navigate(`/book?page=${pageId}`);
  };
  const navigateToIndex = (targetIndex) => {
    const safeIndex = Math.max(0, Math.min(bookPages.length - 1, targetIndex));
    navigateToPage(bookPages[safeIndex].id);
  };
  const step = singlePage ? 1 : 2;
  const lastStart = singlePage ? bookPages.length - 1 : bookPages.length - 2;
  const goPrevious = () => navigateToIndex(currentIndex - step);
  const goNext = () => navigateToIndex(currentIndex + step);
  const readNextPage = () => navigateToIndex(currentIndex + 1);
  const currentPage = bookPages[currentIndex];
  const readAloudText = useMemo(
    () => getReadableBookPageText(currentPage, { t, translateObject, translateText }),
    [currentPage, t, translateObject, translateText],
  );
  const readAloudLang = language === "en" ? "en-US" : "es-MX";
  const readAloudKey = `${currentPage?.id || "blank"}-${requestedPageId || id || "book"}-${language}`;

  if (!Array.isArray(bookPages) || bookPages.length === 0) {
    return <BookErrorState unavailable />;
  }

  return (
    <div className="immersive-book-page page-enter">
      <OpenBook3D currentIndex={currentIndex} turning={turning} direction={direction} singlePage={singlePage} onNavigate={navigateToPage} onPrevious={goPrevious} onNext={goNext} canGoPrevious={currentIndex > 0} canGoNext={currentIndex < lastStart} readAloudText={readAloudText} readAloudLang={readAloudLang} readAloudKey={readAloudKey} onReadNextPage={readNextPage} canReadNextPage={currentIndex < bookPages.length - 1} bookFontScale={bookFontScale} />
      <BookNavigation
        current={currentIndex + 1}
        total={bookPages.length}
        isFirst={currentIndex === 0}
        isLast={currentIndex >= lastStart}
        turning={turning}
        onPrevious={goPrevious}
        onNext={goNext}
        onIndex={() => navigateToPage("index")}
        onResults={() => navigateToPage("results")}
        onClose={() => navigate("/")}
      />
    </div>
  );
}

export default function BookPage() {
  return <BookErrorBoundary><BookExperience /></BookErrorBoundary>;
}
