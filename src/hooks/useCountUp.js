import { useEffect, useRef, useState } from "react";

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Animated count-up that begins when the element scrolls into view.
 * Returns [value, ref] — attach ref to the element you observe.
 */
export function useCountUp(target, { duration = 1800, start = 0, easing = easeOutExpo } = {}) {
  const [value, setValue] = useState(start);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    done.current = false; // re-animate when the target changes (e.g. new route selected)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        io.disconnect();

        const t0 = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - t0) / duration);
          setValue(start + (target - start) * easing(t));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target, duration, start, easing]);

  return [value, ref];
}
