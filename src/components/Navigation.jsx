import { useEffect, useRef, useState } from "react";
import { SITE } from "../data/site";
import { scrollToSection, stopScroll, startScroll } from "../lib/lenis";
import { useAmbientSound } from "../context/SoundContext";
import { useCaseStudy } from "../context/CaseStudyContext";

/**
 * Fixed glass navigation — hides on scroll down, reveals on scroll up,
 * tracks the active chapter, hosts the ambience toggle.
 */
export default function Navigation({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const { playing, toggle } = useAmbientSound();
  const { mode } = useCaseStudy();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 4) {
        setHidden(delta > 0 && y > 500 && !open);
        lastY.current = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (open) {
      stopScroll();
      document.documentElement.style.overflow = "hidden";
    } else {
      startScroll();
      document.documentElement.style.overflow = "";
    }
    return () => {
      startScroll();
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const go = (e, id) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToSection(`#${id}`, -10), open ? 350 : 0);
  };

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}${hidden ? " is-hidden" : ""}`}>
      <div className="nav__bar">
        <a href="#hero" className="nav__logo" onClick={(e) => go(e, "hero")} aria-label="AURELIA — home">
          <svg viewBox="0 0 64 64" fill="none" aria-hidden>
            <rect x="1.5" y="1.5" width="61" height="61" rx="13" stroke="rgba(201,169,106,0.5)" strokeWidth="1.5" />
            <path d="M17 47 32 13l15 34" stroke="#C9A96A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M23.5 37h17" stroke="#C9A96A" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="nav__logo-text">
            {SITE.brand}
            <small>{SITE.descriptor}</small>
          </span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {SITE.nav.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`nav__link${active === l.id ? " is-active" : ""}`}
              onClick={(e) => go(e, l.id)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            className="nav__sound"
            onClick={toggle}
            aria-label={playing ? "Mute ambient sound" : "Play ambient sound"}
            aria-pressed={playing}
            title="Ambience"
          >
            <span className={`dock__sound-bars${playing ? "" : " is-paused"}`} aria-hidden>
              <i /><i /><i /><i />
            </span>
          </button>
          <a href="#contact" className="nav__cta" onClick={(e) => go(e, "contact")}>
            Enquire
          </a>
          <button
            className={`nav__burger${open ? " is-open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`nav__menu${open ? " is-open" : ""}`} aria-hidden={!open}>
        {SITE.nav.map((l, i) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className="nav__menu-link"
            style={{ "--d": `${120 + i * 70}ms` }}
            onClick={(e) => go(e, l.id)}
          >
            <small>{String(i + 1).padStart(2, "0")}</small>
            {l.label}
          </a>
        ))}
        <div className="nav__menu-foot">
          <span>{SITE.location}</span>
          <span>{SITE.hours}</span>
        </div>
      </div>
    </header>
  );
}
