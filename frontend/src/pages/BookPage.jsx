import { Component, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import BookNavigation from "../components/book/BookNavigation.jsx";
import OpenBook3D from "../components/book/OpenBook3D.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { bookPages, getBookPageIndex } from "../data/bookPages.js";
import { useLanguage } from "../context/LanguageContext.jsx";

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

  if (!Array.isArray(bookPages) || bookPages.length === 0) {
    return <BookErrorState unavailable />;
  }

  return (
    <div className="immersive-book-page page-enter">
      <OpenBook3D currentIndex={currentIndex} turning={turning} direction={direction} singlePage={singlePage} onNavigate={navigateToPage} onPrevious={goPrevious} onNext={goNext} canGoPrevious={currentIndex > 0} canGoNext={currentIndex < lastStart} />
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
