import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks";

/**
 * IO-triggered code splitting — below-fold sections import their chunk
 * only when the user approaches. Keeps initial JS at ~92 KB gz.
 */
export default function AsyncSection({ load, minHeight = 520, id, className = "" }) {
  const [Comp, setComp] = useState(null);
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || !("IntersectionObserver" in window)) {
      load().then((m) => setComp(() => m.default));
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          load().then((m) => setComp(() => m.default));
        }
      },
      { rootMargin: "1400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load, reduced]);

  return (
    <div ref={ref} id={id} className={`lazy-section ${className}`} style={{ minHeight }}>
      {Comp ? (
        <Comp />
      ) : (
        <div className="lazy-section__skeleton" aria-hidden>
          <span>{id ?? "Loading"}</span>
        </div>
      )}
    </div>
  );
}
