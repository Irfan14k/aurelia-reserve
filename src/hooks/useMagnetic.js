import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Magnetic pull — the element leans toward the pointer and springs back
 * on leave with the house easing. Attach the returned ref to a button/card.
 */
export function useMagnetic(strength = 0.32) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0, hovering = false;

    const loop = () => {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      if (hovering || Math.abs(cx) > 0.1 || Math.abs(cy) > 0.1) {
        raf = requestAnimationFrame(loop);
      }
    };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left - r.width / 2) * strength;
      ty = (e.clientY - r.top - r.height / 2) * strength;
      if (!hovering) {
        hovering = true;
        raf = requestAnimationFrame(loop);
      }
    };

    const onLeave = () => {
      hovering = false;
      tx = 0;
      ty = 0;
      raf = requestAnimationFrame(loop);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength, reduced]);

  return ref;
}
