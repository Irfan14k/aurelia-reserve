import { useEffect, useRef } from "react";
import { stopScroll, startScroll } from "../lib/lenis";

/**
 * Shared luxury modal — backdrop blur, scale/blur entrance,
 * Esc + backdrop close, scroll lock.
 */
export default function LuxModal({ open, onClose, children, labelledBy, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    stopScroll();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      startScroll();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="lux-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      ref={ref}
    >
      <div className="lux-modal__backdrop" onClick={onClose} aria-hidden />
      <div className={`lux-modal__panel glass-strong ${className}`}>{children}</div>
    </div>
  );
}
