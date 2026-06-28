import { BarChart3, BookOpen, Gamepad2, List, ScrollText } from "lucide-react";

const tabs = [
  { id: "cover", label: "Portada", icon: BookOpen },
  { id: "index", label: "Índice", icon: List },
  { id: "u1-intro", label: "U1", icon: ScrollText },
  { id: "u2-intro", label: "U2", icon: ScrollText },
  { id: "u3-intro", label: "U3", icon: ScrollText },
  { id: "u1-exercise", label: "Juegos", icon: Gamepad2 },
  { id: "results", label: "Resultados", icon: BarChart3 },
];

export default function BookTabs({ currentId, onNavigate }) {
  const isActive = (id) => {
    if (id === "u1-exercise") return currentId?.endsWith("exercise");
    if (/^u\d-intro$/.test(id)) return currentId?.startsWith(id.slice(0, 2)) && !currentId.endsWith("exercise");
    return currentId === id;
  };
  return <nav className="book-side-tabs" aria-label="Marcadores del libro">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onNavigate(id)} className={isActive(id) ? "active" : ""} title={label}><Icon /><span>{label}</span></button>)}</nav>;
}
