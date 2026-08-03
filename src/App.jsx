import { useEffect, useRef, useState } from "react";

import {
  useSmoothScroll,
  useReveal,
  useCursor,
  useScrollProgress,
  useActiveSection,
  useTimeOfDay,
} from "./hooks";

import Preloader from "./components/Preloader";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Story from "./components/Story";
import LiveStatus from "./components/LiveStatus";
import Residences from "./components/Residences";
import FloorPlan from "./components/FloorPlan";
import Amenities from "./components/Amenities";
import Gallery from "./components/Gallery";
import LocationMap from "./components/LocationMap";
import Contact from "./components/Contact";
import AboutConcept from "./components/AboutConcept";
import BehindExperience from "./components/BehindExperience";
import LegalDisclaimer from "./components/LegalDisclaimer";
import Footer from "./components/Footer";
import ScrollRail from "./components/ScrollRail";
import FloatDock from "./components/FloatDock";
import DustParticles from "./components/DustParticles";
import PortfolioBadge from "./components/PortfolioBadge";
import TechBadge from "./components/TechBadge";
import AmbientBackground from "./components/AmbientBackground";
import AsyncSection from "./components/AsyncSection";
import CaseStudyDeck from "./components/CaseStudyDeck";

import { SoundProvider } from "./context/SoundContext";
import { CaseStudyProvider, useCaseStudy } from "./context/CaseStudyContext";
import { setReady } from "./lib/ready";

const SECTION_IDS = [
  "hero",
  "story",
  "residences",
  "floorplan",
  "amenities",
  "gallery",
  "location",
  "contact",
  "about",
  "behind",
];

/**
 * Heavy below-fold sections are code-split and IO-triggered —
 * initial JS stays ≈ 77 KB gz while every experience remains intact.
 */
const AsyncGallery = () => (
  <AsyncSection id="gallery-slot" load={() => import("./components/Gallery")} minHeight={560} />
);
const AsyncLocation = () => (
  <AsyncSection id="location-slot" load={() => import("./components/LocationMap")} minHeight={560} />
);
const AsyncCaseStudy = () => (
  <AsyncSection id="casestudy-slot" load={() => import("./components/CaseStudyDeck")} minHeight={420} />
);

function Experience() {
  const [progress, setProgress] = useState(0);
  const [ready, setReadyState] = useState(false);

  const { dotRef, ringRef, labelRef } = useCursor();
  const scrollP = useScrollProgress();
  const active = useActiveSection(SECTION_IDS);
  const mainRef = useRef(null);
  const { mode, switching } = useCaseStudy();

  useSmoothScroll();
  useReveal();
  useTimeOfDay();

  // Simulated luxury preloader (asset warm-up)
  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + Math.random() * 14 + 6);
      setProgress(Math.floor(p));
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => setReadyState(true), 500);
      }
    }, 180);
    return () => clearInterval(id);
  }, []);

  // Signal to the rest of the app (Hero intro starts on this)
  useEffect(() => {
    if (ready) setReady(true);
  }, [ready]);

  return (
    <>
      <Preloader progress={progress} done={ready} />

      {/* Global overlays */}
      <AmbientBackground />
      <div className="grain-overlay" aria-hidden />

      {/* Custom cursor */}
      <div ref={ringRef} className="lux-cursor__ring" aria-hidden />
      <div ref={dotRef} className="lux-cursor" aria-hidden>
        <div className="lux-cursor__dot" />
      </div>
      <div ref={labelRef} className="lux-cursor__label" aria-hidden />

      {/* Top scroll progress */}
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${scrollP})` }}
        aria-hidden
      />

      <a href="#contact" className="skip-link">Skip to contact</a>

      <Navigation active={active} />

      {mode === "website" && <ScrollRail ids={SECTION_IDS} active={active} />}

      {mode === "case" ? (
        <AsyncCaseStudy />
      ) : (
        <main
          ref={mainRef}
          className="relative"
          style={{
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0) scale(1)" : "translateY(20px) scale(0.985)",
            filter: ready ? "blur(0)" : "blur(8px)",
            transition:
              "opacity 1.4s var(--ease-lux), transform 1.4s var(--ease-lux), filter 1.4s var(--ease-lux)",
          }}
        >
          <Hero />
          <LiveStatus />
          <Story />
          <Residences />
          <FloorPlan />
          <Amenities />
          <AsyncGallery />
          <AsyncLocation />
          <Contact />
          <AboutConcept />
          <BehindExperience />
          <LegalDisclaimer />
          <Footer />
        </main>
      )}

      {/* Mode-switch curtain */}
      <div className={`mode-curtain${switching ? " is-active" : ""}`} aria-hidden>
        <div className="mode-curtain__label">
          {mode === "case" ? "Entering the residence" : "Opening the case study"}
        </div>
      </div>

      {/* Global dust (rendered above main but under nav) */}
      <DustParticles density={1} region="global" />

      {mode === "website" && (
        <>
          <FloatDock progress={scrollP} visible={ready && scrollP > 0.08} />
          <PortfolioBadge />
          <TechBadge />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <SoundProvider>
      <CaseStudyProvider>
        <Experience />
      </CaseStudyProvider>
    </SoundProvider>
  );
}
