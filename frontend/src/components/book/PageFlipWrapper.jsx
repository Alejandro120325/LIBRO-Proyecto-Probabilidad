export default function PageFlipWrapper({ turning, direction, children }) {
  return <div className={`page-flip-wrapper ${turning ? `page-flipping page-flipping-${direction}` : ""}`}>{children}<div className="dynamic-page-shadow" /></div>;
}
