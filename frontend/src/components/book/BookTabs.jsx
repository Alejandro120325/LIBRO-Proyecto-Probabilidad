import { BarChart3, BookOpen, Gamepad2, List, ScrollText } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";

const tabs = [
  { id: "cover", labelKey: "book.cover", icon: BookOpen },
  { id: "index", labelKey: "common.index", icon: List },
  { id: "u1-intro", label: "U1", icon: ScrollText },
  { id: "u2-intro", label: "U2", icon: ScrollText },
  { id: "u3-intro", label: "U3", icon: ScrollText },
  { id: "u1-exercise", labelKey: "book.games", icon: Gamepad2 },
  { id: "results", labelKey: "common.results", icon: BarChart3 },
];

export default function BookTabs({ currentId, onNavigate }) {
  const { t } = useLanguage();
  const isActive = (id) => {
    if (id === "u1-exercise") return currentId?.endsWith("exercise");
    if (/^u\d-intro$/.test(id)) return currentId?.startsWith(id.slice(0, 2)) && !currentId.endsWith("exercise");
    return currentId === id;
  };
  return <nav className="book-side-tabs" aria-label={t("book.bookmarks")}>{tabs.map(({ id, label, labelKey, icon: Icon }) => { const text = labelKey ? t(labelKey) : label; return <button key={id} onClick={() => onNavigate(id)} className={isActive(id) ? "active" : ""} title={text}><Icon /><span>{text}</span></button>; })}</nav>;
}
