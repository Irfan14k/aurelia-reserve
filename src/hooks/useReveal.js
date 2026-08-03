import { useEffect } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Global reveal engine. Observes every [data-reveal] element —
 * including ones mounted later (lazy sections, case-study deck).
 * Variants: base rise, mask, scale, line. Stagger via --d custom property.
 */
export function useReveal() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            if (entry.target.dataset.revealOnce !== "false") io.unobserve(entry.target);
          } else if (entry.target.dataset.revealOnce === "false") {
            entry.target.classList.remove("is-revealed");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );

    const scan = () => {
      document
        .querySelectorAll("[data-reveal]:not(.is-revealed)")
        .forEach((el) => io.observe(el));
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [reduced]);
}
