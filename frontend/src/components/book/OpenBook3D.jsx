import { bookPages } from "../../data/bookPages.js";
import ReadAloudControls from "../ReadAloudControls.jsx";
import BookPageRenderer from "./BookPageRenderer.jsx";
import BookTabs from "./BookTabs.jsx";
import PageFlipWrapper from "./PageFlipWrapper.jsx";
import { Hand } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function OpenBook3D({
  currentIndex,
  turning,
  direction,
  singlePage,
  onNavigate,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  readAloudText,
  readAloudLang,
  readAloudKey,
  onReadNextPage,
  canReadNextPage,
  bookFontScale,
}) {
  const { t, translateText } = useLanguage();
  const visiblePages = singlePage ? [bookPages[currentIndex]] : [bookPages[currentIndex], bookPages[currentIndex + 1]];
  const currentPage = bookPages[currentIndex];
  const sectionKey = currentPage?.type?.startsWith("unit-") ? `book.unit${currentPage.unit}` : `book.section.${currentPage?.type || "cover"}`;
  return (
    <div className={`book-workspace ${singlePage ? "book-workspace-single" : ""}`}>
      <aside className="book-audio-panel" aria-label={t("readAloud.title")}>
        <ReadAloudControls text={readAloudText} lang={readAloudLang} readKey={readAloudKey} onReadNextPage={onReadNextPage} canReadNext={canReadNextPage} />
      </aside>

      <div className={`storybook-shell ${singlePage ? "storybook-single" : ""}`}>
        <div className="book-context-bar">
          <div className="book-page-summary"><span>{t(sectionKey)}</span><strong>{translateText(currentPage?.title || t("book.cover"))}</strong></div>
          <div className="book-drag-help"><Hand />{t("book.dragHelp")}</div>
          <span className="book-page-indicator">{t("book.pageOf", { current: currentIndex + 1, total: bookPages.length })}</span>
        </div>
        <div className="storybook-page-edges storybook-edges-top" />
        <PageFlipWrapper turning={turning} direction={direction} canGoPrevious={canGoPrevious} canGoNext={canGoNext} onPrevious={onPrevious} onNext={onNext}>
          <div className="storybook-open">
            {visiblePages.map((page, index) => (
              <article key={page?.id || `blank-${index}`} className={`storybook-paper ${index === 0 ? "storybook-left" : "storybook-right"}`}>
                <span className="storybook-folio">{page ? bookPages.indexOf(page) + 1 : ""}</span>
                <BookPageRenderer page={page} onNavigate={onNavigate} bookFontScale={bookFontScale} />
              </article>
            ))}
            {!singlePage && <div className="storybook-gutter" />}
          </div>
        </PageFlipWrapper>
        <div className="storybook-page-edges storybook-edges-bottom" />
      </div>

      <BookTabs currentId={currentPage?.id} onNavigate={onNavigate} />
    </div>
  );
}
