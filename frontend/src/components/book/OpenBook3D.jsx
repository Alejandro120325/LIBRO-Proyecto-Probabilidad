import { bookPages } from "../../data/bookPages.js";
import BookPageRenderer from "./BookPageRenderer.jsx";
import BookTabs from "./BookTabs.jsx";
import PageFlipWrapper from "./PageFlipWrapper.jsx";

export default function OpenBook3D({ currentIndex, turning, direction, singlePage, onNavigate }) {
  const visiblePages = singlePage ? [bookPages[currentIndex]] : [bookPages[currentIndex], bookPages[currentIndex + 1]];
  return (
    <div className={`storybook-shell ${singlePage ? "storybook-single" : ""}`}>
      <BookTabs currentId={bookPages[currentIndex]?.id} onNavigate={onNavigate} />
      <div className="storybook-page-edges storybook-edges-top" />
      <PageFlipWrapper turning={turning} direction={direction}>
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
