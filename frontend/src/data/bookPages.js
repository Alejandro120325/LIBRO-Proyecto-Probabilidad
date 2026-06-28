export const bookPages = [
  { id: "cover", type: "cover", title: "Probabilidad y Estadística" },
  { id: "prologue", type: "prologue", title: "Prólogo" },
  { id: "index", type: "index", title: "Índice de capítulos" },
  { id: "u1-intro", type: "unit-intro", unit: 1, section: "intro", title: "Unidad 1 · Introducción" },
  { id: "u1-formulas", type: "unit-formulas", unit: 1, section: "formulas", title: "Unidad 1 · Fórmulas" },
  { id: "u1-video", type: "unit-video", unit: 1, section: "video", title: "Unidad 1 · Video" },
  { id: "u1-exercise", type: "unit-exercise", unit: 1, section: "exercise", title: "Unidad 1 · Ejercicio" },
  { id: "u2-intro", type: "unit-intro", unit: 2, section: "intro", title: "Unidad 2 · Introducción" },
  { id: "u2-formulas", type: "unit-formulas", unit: 2, section: "formulas", title: "Unidad 2 · Fórmulas" },
  { id: "u2-video", type: "unit-video", unit: 2, section: "video", title: "Unidad 2 · Video" },
  { id: "u2-exercise", type: "unit-exercise", unit: 2, section: "exercise", title: "Unidad 2 · Ejercicio" },
  { id: "u3-intro", type: "unit-intro", unit: 3, section: "intro", title: "Unidad 3 · Introducción" },
  { id: "u3-formulas", type: "unit-formulas", unit: 3, section: "formulas", title: "Unidad 3 · Fórmulas" },
  { id: "u3-video", type: "unit-video", unit: 3, section: "video", title: "Unidad 3 · Video" },
  { id: "u3-exercise", type: "unit-exercise", unit: 3, section: "exercise", title: "Unidad 3 · Ejercicio" },
  { id: "results", type: "results", title: "Mis resultados" },
  { id: "ranking", type: "ranking", title: "Ranking" },
  { id: "epilogue", type: "epilogue", title: "Epílogo" },
];

export const unitDetails = {
  1: {
    heading: "Unidad 1 · Regla de Bayes",
    videoPlaceholder: "Aquí se colocará el video explicativo de Regla de Bayes.",
    gamePath: "/game/bayes",
    symbols: ["A: hipótesis o causa que queremos evaluar.", "B: evidencia que ya observamos.", "P(A): probabilidad inicial o previa.", "P(B|A): probabilidad de la evidencia si A ocurre.", "P(A|B): probabilidad actualizada después de observar B."],
  },
  2: {
    heading: "Unidad 2 · Estadística Básica",
    videoPlaceholder: "Aquí se colocará el video explicativo de media, mediana y moda.",
    gamePath: "/game/statistics",
    symbols: ["x̄: media aritmética del conjunto.", "xᵢ: cada valor observado.", "n: cantidad total de datos.", "Me: valor central después de ordenar.", "Mo: dato con mayor frecuencia."],
  },
  3: {
    heading: "Unidad 3 · Variables Aleatorias",
    videoPlaceholder: "Aquí se colocará el video explicativo de variables aleatorias.",
    gamePath: "/game/random-variables",
    symbols: ["X: variable aleatoria.", "x: uno de sus valores posibles.", "P(x): probabilidad asociada al valor x.", "E(X): valor esperado o promedio teórico.", "Var(X): dispersión respecto al valor esperado."],
  },
};

export const bookIndexGroups = [
  { title: "Apertura", pages: ["cover", "prologue"] },
  { title: "Unidad 1 · Regla de Bayes", pages: ["u1-intro", "u1-formulas", "u1-video", "u1-exercise"] },
  { title: "Unidad 2 · Media, mediana y moda", pages: ["u2-intro", "u2-formulas", "u2-video", "u2-exercise"] },
  { title: "Unidad 3 · Variables aleatorias", pages: ["u3-intro", "u3-formulas", "u3-video", "u3-exercise"] },
  { title: "Progreso", pages: ["results", "ranking", "epilogue"] },
];

export function getBookPageIndex(pageId) {
  const index = bookPages.findIndex((page) => page.id === pageId);
  return index < 0 ? 0 : index;
}
