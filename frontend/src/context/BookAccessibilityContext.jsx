import { createContext, useCallback, useContext, useMemo, useState } from "react";

const BookAccessibilityContext = createContext(null);
const STORAGE_KEY = "bookFontScale";
const FONT_SCALES = [0.9, 1, 1.1, 1.2, 1.3];

function getStoredBookFontScale() {
  try {
    const storedValue = Number(localStorage.getItem(STORAGE_KEY));
    return FONT_SCALES.includes(storedValue) ? storedValue : 1;
  } catch {
    return 1;
  }
}

function persistBookFontScale(value) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // La preferencia sigue activa durante la sesión aunque localStorage esté bloqueado.
  }
}

function getScaleIndex(scale) {
  const index = FONT_SCALES.findIndex((value) => value === scale);
  return index >= 0 ? index : 1;
}

export function BookAccessibilityProvider({ children }) {
  const [bookFontScale, setBookFontScale] = useState(getStoredBookFontScale);
  const fontScaleIndex = getScaleIndex(bookFontScale);
  const canDecreaseFont = fontScaleIndex > 0;
  const canIncreaseFont = fontScaleIndex < FONT_SCALES.length - 1;

  const updateBookFontScale = useCallback((nextScale) => {
    setBookFontScale(nextScale);
    persistBookFontScale(nextScale);
  }, []);

  const decreaseBookFontSize = useCallback(() => {
    updateBookFontScale(FONT_SCALES[Math.max(0, getScaleIndex(bookFontScale) - 1)]);
  }, [bookFontScale, updateBookFontScale]);

  const increaseBookFontSize = useCallback(() => {
    updateBookFontScale(FONT_SCALES[Math.min(FONT_SCALES.length - 1, getScaleIndex(bookFontScale) + 1)]);
  }, [bookFontScale, updateBookFontScale]);

  const resetBookFontSize = useCallback(() => {
    updateBookFontScale(1);
  }, [updateBookFontScale]);

  const value = useMemo(() => ({
    bookFontScale,
    decreaseBookFontSize,
    increaseBookFontSize,
    resetBookFontSize,
    canDecreaseFont,
    canIncreaseFont,
  }), [bookFontScale, canDecreaseFont, canIncreaseFont, decreaseBookFontSize, increaseBookFontSize, resetBookFontSize]);

  return <BookAccessibilityContext.Provider value={value}>{children}</BookAccessibilityContext.Provider>;
}

export function useBookAccessibility() {
  const context = useContext(BookAccessibilityContext);
  if (!context) throw new Error("useBookAccessibility must be used inside BookAccessibilityProvider.");
  return context;
}
