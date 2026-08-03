import { useEffect, useRef, useState } from "react";

/**
 * Page scroll progress 0 → 1. Throttled to visible changes so the
 * app doesn't re-render 60×/s.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const last = useRef(-1);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (Math.abs(p - last.current) > 0.0008) {
        last.current = p;
        setProgress(p);
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return progress;
}
