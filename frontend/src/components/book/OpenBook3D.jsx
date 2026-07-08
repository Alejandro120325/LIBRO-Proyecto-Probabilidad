import { bookPages } from "../../data/bookPages.js";
import BookPageRenderer from "./BookPageRenderer.jsx";
import BookTabs from "./BookTabs.jsx";
import PageFlipWrapper from "./PageFlipWrapper.jsx";
import { Hand } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function OpenBook3D({ currentIndex, turning, direction, singlePage, onNavigate, onPrevious, onNext, canGoPrevious, canGoNext }) {
  const { t, translateText } = useLanguage();
  const visiblePages = singlePage ? [bookPages[currentIndex]] : [bookPages[currentIndex], bookPages[currentIndex + 1]];
  const currentPage = bookPages[currentIndex];
  const sectionKey = currentPage?.type?.startsWith("unit-") ? `book.unit${currentPage.unit}` : `book.section.${currentPage?.type || "cover"}`;
  return (
    <div className={`storybook-shell ${singlePage ? "storybook-single" : ""}`}>
      <div className="book-context-bar">
        <div><span>{t(sectionKey)}</span><strong>{translateText(currentPage?.title || t("book.cover"))}</strong></div>
        <div className="book-drag-help"><Hand />{t("book.dragHelp")}</div>
        <span className="book-page-indicator">{t("book.pageOf", { current: currentIndex + 1, total: bookPages.length })}</span>
      </div>
      <BookTabs currentId={bookPages[currentIndex]?.id} onNavigate={onNavigate} />
      <div className="storybook-page-edges storybook-edges-top" />
      <PageFlipWrapper turning={turning} direction={direction} canGoPrevious={canGoPrevious} canGoNext={canGoNext} onPrevious={onPrevious} onNext={onNext}>
        <div className="storybook-open">
          {visiblePages.map((page, index) => (
            <article key={page?.id || `blank-${index}`} className={`storybook-paper ${index === 0 ? "storybook-left" : "storybook-right"}`}>
              <span className="storybook-folio">{page ? bookPages.indexOf(page) + 1 : ""}</span>
              <BookPageRenderer page={page} onNavigate={onNavigate} />
            </article>
          ))}
          {!singlePage && <div className="storybook-gutter" />}
        </div>
      </PageFlipWrapper>
      <div className="storybook-page-edges storybook-edges-bottom" />
    </div>
  );
}
