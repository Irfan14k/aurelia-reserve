import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { setLenis } from "../lib/lenis";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Buttery smooth scroll (Lenis) with a luxurious deceleration curve.
 * Original API preserved: call once at app root.
 * Respects prefers-reduced-motion (native scroll).
 */
export function useSmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.18,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      wheelMultiplier: 0.95,
    });

    setLenis(lenis);

    let raf = 0;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);
}
