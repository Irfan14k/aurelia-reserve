import { useEffect, useRef } from "react";
import { useMousePosition } from "./useMousePosition";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Luxury glass cursor.
 * — ring + dot with exponential lerp
 * — morphs: hover (links), view (media), press (click)
 * — context labels via [data-cursor-label] ("View / Open / Book / Download / Explore")
 * — zero cost on touch devices
 */
export function useCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const { x, y } = useMousePosition();

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let shown = false;
    let mode = "";

    const setMode = (m) => {
      if (mode === m) return;
      mode = m;
      ring.className = `lux-cursor__ring${m ? ` is-${m}` : ""}`;
    };

    const loop = () => {
      rx += (x.current - rx) * 0.16;
      ry += (y.current - ry) * 0.16;
      ring.style.transform = `translate3d(${rx - 20}px, ${ry - 20}px, 0)`;
      dot.style.transform = `translate3d(${x.current - 3}px, ${y.current - 3}px, 0)`;
      label.style.transform = `translate3d(${x.current + 16}px, ${y.current + 16}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const show = () => {
      if (shown) return;
      shown = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };
    const hide = () => {
      shown = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      label.classList.remove("is-visible");
    };

    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const cursorEl = t.closest("[data-cursor]");
      const labeled = t.closest("[data-cursor-label]");
      if (labeled) {
        label.textContent = labeled.dataset.cursorLabel;
        label.classList.add("is-visible");
      } else {
        label.classList.remove("is-visible");
      }
      setMode(cursorEl?.dataset.cursor || (labeled ? "view" : ""));
      show();
    };
    const onOut = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest("[data-cursor], [data-cursor-label]")) {
        setMode("");
        label.classList.remove("is-visible");
      }
    };
    const onDown = () => setMode("press");
    const onUp = () => setMode("");

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", hide);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", hide);
    };
  }, []);

  return { dotRef, ringRef, labelRef };
}
