import { useMemo } from "react";
import { useCaseStudy } from "../context/CaseStudyContext";
import { useAmbientSound } from "../context/SoundContext";
import { scrollToSection } from "../lib/lenis";
import { useMagnetic } from "../hooks";

const IconTop = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 19V6" /><path d="m5.5 11.5 6.5-6 6.5 6" /><path d="M4 4.5h16" opacity="0.5" />
  </svg>
);
const IconCase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M4 10h16" /><path d="M12 10v10" opacity="0.6" />
  </svg>
);
const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v15H7.5A2.5 2.5 0 0 0 5 20.5z" />
    <path d="M5 20.5A2.5 2.5 0 0 1 7.5 18H20" />
    <path d="M9 7.5h6" opacity="0.6" />
  </svg>
);

/**
 * Floating dock — glass, expanding on hover, active-tool indicator,
 * ambience + case-study toggles + book visit.
 */
export default function FloatDock({ progress, visible }) {
  const { mode, setMode } = useCaseStudy();
  const { playing, toggle } = useAmbientSound();
  const caseRef = useMagnetic(0.18);
  const bookRef = useMagnetic(0.18);

  const items = useMemo(
    () => [
      { id: "top", label: "Top", action: () => scrollToSection(0), icon: <IconTop /> },
      { id: "sound", label: playing ? "Silence" : "Ambience", action: toggle, active: playing, icon: (
          <span className={`dock__sound-bars${playing ? "" : " is-paused"}`} aria-hidden><i /><i /><i /><i /></span>
        ) },
      { id: "case", label: mode === "case" ? "Website" : "Case Study", action: () => setMode(mode === "case" ? "website" : "case"), active: mode === "case", icon: <IconCase />, ref: caseRef },
      { id: "book", label: "Book Visit", action: () => scrollToSection("#contact"), icon: <IconBook />, ref: bookRef },
    ],
    [playing, toggle, mode, setMode]
  );

  return (
    <div
      className={`dock${visible && progress > 0.06 ? " is-visible" : ""}`}
      role="toolbar"
      aria-label="Quick actions"
    >
      {items.map((item) => {
        const el = (
          <button
            key={item.id}
            className={`dock__item${item.active ? " is-active" : ""}`}
            onClick={item.action}
            aria-label={item.label}
            aria-pressed={item.active}
          >
            {item.icon}
            <span className="dock__tip">{item.label}</span>
          </button>
        );
        return item.ref ? <span key={item.id} ref={item.ref}>{el}</span> : el;
      })}
    </div>
  );
}
