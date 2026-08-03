import { useEffect, useState } from "react";

const getMode = (d) => {
  const h = d.getHours();
  if (h >= 5 && h < 8) return "dawn";
  if (h >= 8 && h < 17) return "day";
  if (h >= 17 && h < 20) return "dusk";
  return "night";
};

/**
 * Dynamic time-of-day lighting. Sets `data-timeofday` on <html>;
 * every tinted overlay in the design system responds.
 */
export function useTimeOfDay() {
  const [mode, setMode] = useState(() => getMode(new Date()));

  useEffect(() => {
    const id = setInterval(() => setMode(getMode(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.timeofday = mode;
  }, [mode]);

  return mode;
}
