import { useEffect, useRef } from "react";

/**
 * Shared pointer position — one passive listener for the whole app.
 * `x` / `y` are refs (no re-renders); read them inside rAF loops.
 */
export function useMousePosition() {
  const x = useRef(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const y = useRef(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  useEffect(() => {
    const onMove = (e) => {
      x.current = e.clientX;
      y.current = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return { x, y };
}
