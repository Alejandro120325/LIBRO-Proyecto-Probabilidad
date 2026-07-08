import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { bookIndexGroups, bookPages } from "../../data/bookPages.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function BookIndex() {
  const { t, translateText } = useLanguage();
  return (
    <div className="full-book-index">
      <p className="book-label">{t("book.direct")}</p>
      <h1>{t("book.chapterIndex")}</h1>
      <div className="index-groups">
        {bookIndexGroups.map((group) => (
          <section key={group.title}>
            <h2>{translateText(group.title)}</h2>
            <div>{group.pages.map((pageId) => { const page = bookPages.find((item) => item.id === pageId); return <Link key={pageId} to={`/book?page=${pageId}`}><span>{translateText(page.title)}</span><ArrowUpRight /></Link>; })}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
