import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { bookIndexGroups, bookPages } from "../../data/bookPages.js";

export default function BookIndex() {
  return (
    <div className="full-book-index">
      <p className="book-label">Navegación directa</p>
      <h1>Índice de capítulos</h1>
      <div className="index-groups">
        {bookIndexGroups.map((group) => (
          <section key={group.title}>
            <h2>{group.title}</h2>
            <div>{group.pages.map((pageId) => { const page = bookPages.find((item) => item.id === pageId); return <Link key={pageId} to={`/book?page=${pageId}`}><span>{page.title}</span><ArrowUpRight /></Link>; })}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
