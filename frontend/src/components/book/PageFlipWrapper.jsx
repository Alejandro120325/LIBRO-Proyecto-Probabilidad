import { useRef, useState } from "react";

const DRAG_THRESHOLD = 72;
const MAX_DRAG = 210;
const INTERACTIVE_SELECTOR = "a,button,input,select,textarea,label,[role='button'],details,summary";

export default function PageFlipWrapper({ turning, direction, canGoPrevious, canGoNext, onPrevious, onNext, children }) {
  const startX = useRef(null);
  const active = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

  const beginDrag = (clientX, target) => {
    if (turning || target.closest?.(INTERACTIVE_SELECTOR)) return;
    startX.current = clientX;
    active.current = true;
    setDragOffset(0);
  };

  const updateDrag = (clientX) => {
    if (!active.current || startX.current === null) return;
    const nextOffset = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, clientX - startX.current));
    setDragOffset(nextOffset);
  };

  const finishDrag = () => {
    if (!active.current) return;
    active.current = false;
    startX.current = null;
    const shouldGoNext = dragOffset <= -DRAG_THRESHOLD && canGoNext;
    const shouldGoPrevious = dragOffset >= DRAG_THRESHOLD && canGoPrevious;
    setDragOffset(0);
    if (shouldGoNext) onNext();
    else if (shouldGoPrevious) onPrevious();
  };

  const cancelDrag = () => {
    active.current = false;
    startX.current = null;
    setDragOffset(0);
  };

  const dragDirection = dragOffset < 0 ? "next" : "previous";
  const dragging = active.current && Math.abs(dragOffset) > 2;
  const dragProgress = Math.min(1, Math.abs(dragOffset) / MAX_DRAG);

  return (
    <div
      className={`page-flip-wrapper ${turning ? `page-flipping page-flipping-${direction}` : ""} ${dragging ? `page-dragging page-dragging-${dragDirection}` : ""}`}
      style={{ "--drag-offset": `${dragOffset}px`, "--drag-progress": dragProgress, "--drag-angle": `${(dragOffset < 0 ? -1 : 1) * dragProgress * 150}deg`, "--drag-shadow": `${(dragOffset < 0 ? -1 : 1) * dragProgress * 28}px`, "--drag-opacity": 0.2 + dragProgress * 0.78 }}
      onMouseDown={(event) => beginDrag(event.clientX, event.target)}
      onMouseMove={(event) => updateDrag(event.clientX)}
      onMouseUp={finishDrag}
      onMouseLeave={finishDrag}
      onTouchStart={(event) => beginDrag(event.touches[0].clientX, event.target)}
      onTouchMove={(event) => updateDrag(event.touches[0].clientX)}
      onTouchEnd={finishDrag}
      onTouchCancel={cancelDrag}
    >
      {children}
      <div className="dynamic-page-shadow" />
    </div>
  );
}
