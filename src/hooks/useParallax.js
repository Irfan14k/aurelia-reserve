import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Scroll-linked parallax. Translates the element vertically relative to
 * the viewport centre. Only runs its rAF while near the viewport (IO-gated).
 * `speed` ≈ fraction of the element's centre offset to apply.
 */
export function useParallax(speed = 0.12) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let raf = 0;
    let running = false;

    const update = () => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -120 || r.top > window.innerHeight + 120) {
        running = false;
        cancelAnimationFrame(raf);
        return;
      }
      const delta = (r.top + r.height / 2 - window.innerHeight / 2) * speed;
      el.style.transform = `translate3d(0, ${delta.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(update);
    };

    const start = () => {
      if (running) return;
      running = true;
      update();
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : cancel()),
      { rootMargin: "160px 0px" }
    );
    const cancel = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    io.observe(el);
    start();

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [speed, reduced]);

  return ref;
}
