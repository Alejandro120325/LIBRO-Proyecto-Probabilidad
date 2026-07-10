import { useLocation } from "react-router-dom";
import { useBookAccessibility } from "../context/BookAccessibilityContext.jsx";
import BookFontSizeControls from "./book/BookFontSizeControls.jsx";
import ColorModeToggle from "./ColorModeToggle.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

export default function HeaderPreferences() {
  const location = useLocation();
  const {
    bookFontScale,
    decreaseBookFontSize,
    increaseBookFontSize,
    resetBookFontSize,
    canDecreaseFont,
    canIncreaseFont,
  } = useBookAccessibility();
  const showBookFontControls = location.pathname.startsWith("/book");

  return (
    <div className="header-preferences">
      {showBookFontControls && (
        <BookFontSizeControls
          scale={bookFontScale}
          onDecrease={decreaseBookFontSize}
          onIncrease={increaseBookFontSize}
          onReset={resetBookFontSize}
          canDecrease={canDecreaseFont}
          canIncrease={canIncreaseFont}
          compact
        />
      )}
      <LanguageSwitcher />
      <ColorModeToggle />
    </div>
  );
}
