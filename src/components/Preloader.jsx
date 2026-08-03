import { useEffect, useRef, useState } from "react";
import { setReady } from "../lib/ready";

/**
 * Luxury preloader — monogram draw, eased percentage, gold hairline,
 * then a curtain lift that hands the stage to the hero.
 */
export default function Preloader({ progress, done }) {
  const [visible, setVisible] = useState(true);
  const barRef = useRef(null);

  useEffect(() => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress / 100})`;
  }, [progress]);

  useEffect(() => {
    if (!done) return;
    // warm up hero media before the curtain lifts
    const links = [
      "/images/opt/poster-hero-1.jpg",
      "/images/opt/hero-1.mp4",
    ];
    links.forEach((src) => {
      const el = document.createElement("link");
      el.rel = "preload";
      el.as = src.endsWith(".mp4") ? "video" : "image";
      el.href = src;
      document.head.appendChild(el);
    });
    const t = setTimeout(() => setVisible(false), 1600);
    return () => clearTimeout(t);
  }, [done]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setReady(true), 950);
    return () => clearTimeout(t);
  }, [done]);

  if (!visible) return null;

  return (
    <div className={`preloader${done ? " is-done" : ""}`} aria-hidden={done}>
      <div className="preloader__inner">
        <svg className="preloader__mark" viewBox="0 0 64 64" fill="none">
          <rect x="1.5" y="1.5" width="61" height="61" rx="13" stroke="rgba(201,169,106,0.4)" strokeWidth="1.5" />
          <path d="M17 47 32 13l15 34" stroke="#C9A96A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M23.5 37h17" stroke="#C9A96A" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <div className="preloader__count">
          {progress}<em>%</em>
        </div>
        <div className="preloader__word">Composing the light</div>
        <div className="preloader__bar">
          <i ref={barRef} />
        </div>
      </div>
    </div>
  );
}
