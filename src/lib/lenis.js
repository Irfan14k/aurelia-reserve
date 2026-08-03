let lenisInstance = null;

export const setLenis = (l) => {
  lenisInstance = l;
  // convenience global for components that predate the lib (kept in sync)
  if (typeof window !== "undefined") window.__lenis = l;
};
export const getLenis = () => lenisInstance;

/** Smooth-scroll to a target (selector, element or px) — used by nav, rail, dock. */
export const scrollToSection = (target, offset = 0) => {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.6 });
  } else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export const stopScroll = () => getLenis()?.stop();
export const startScroll = () => getLenis()?.start();
