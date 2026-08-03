import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getLenis } from "../lib/lenis";

const CaseStudyContext = createContext({ mode: "website", setMode: () => {} });

/**
 * Website ⇄ Case Study. Switching triggers a cinematic curtain in App;
 * the deck and the marketing sections never mount at the same time
 * (keeps the DOM light).
 */
export function CaseStudyProvider({ children }) {
  const [mode, setMode] = useState("website");
  const [switching, setSwitching] = useState(false);

  const switchMode = useCallback((next) => {
    if (next === mode) return;
    setSwitching(true);
    const lenis = getLenis();
    lenis?.stop();
    setTimeout(() => {
      setMode(next);
      setSwitching(false);
      requestAnimationFrame(() => {
        lenis?.start();
        lenis?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
      });
    }, 900);
  }, [mode]);

  useEffect(() => {
    const lenis = getLenis();
    if (switching) lenis?.stop();
  }, [switching]);

  const value = useMemo(
    () => ({ mode, setMode: switchMode, switching }),
    [mode, switchMode, switching]
  );

  return <CaseStudyContext.Provider value={value}>{children}</CaseStudyContext.Provider>;
}

export const useCaseStudy = () => useContext(CaseStudyContext);
