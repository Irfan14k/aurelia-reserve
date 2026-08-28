import { useEffect, useRef, useState } from "react";
import { useSmoothScroll, useReveal, useCursor, useScrollProgress, useActiveSection } from "./hooks";
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
import LegalDisclaimer from "./components/LegalDisclaimer";
import Footer from "./components/Footer";
import ScrollRail from "./components/ScrollRail";
import FloatDock from "./components/FloatDock";
import DustParticles from "./components/DustParticles";
import PortfolioBadge from "./components/PortfolioBadge";
import TechBadge from "./components/TechBadge";
import { AuthProvider } from "./context/AuthProvider";

const SECTION_IDS = ["hero", "story", "residences", "floorplan", "amenities", "gallery", "location", "contact"];

export default function App() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const { dotRef, ringRef, labelRef } = useCursor();
  const scrollP = useScrollProgress();
  const active = useActiveSection(SECTION_IDS);
  const mainRef = useRef<HTMLDivElement>(null);

  useSmoothScroll();
  useReveal();

  // Simulated luxury preloader (asset warm-up)
  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + Math.random() * 14 + 6);
      setProgress(Math.floor(p));
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => setReady(true), 500);
      }
    }, 180);
    return () => clearInterval(id);
  }, []);

  return (
    <AuthProvider>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <Preloader progress={progress} done={ready} />

      {/* Global overlays */}
      <div className="ambient-glow" aria-hidden />
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

      <Navigation active={active} />
      <ScrollRail ids={SECTION_IDS} active={active} />
      <FloatDock progress={scrollP} visible={ready && scrollP > 0.08} />
      <PortfolioBadge />
      <TechBadge />

      <main
        id="main-content"
        ref={mainRef}
        className="relative"
        style={{
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0) scale(1)" : "translateY(20px) scale(0.985)",
          filter: ready ? "blur(0)" : "blur(8px)",
          transition: "opacity 1.4s var(--ease-lux), transform 1.4s var(--ease-lux), filter 1.4s var(--ease-lux)",
        }}
      >
        <Hero />
        <LiveStatus />
        <Story />
        <Residences />
        <FloorPlan />
        <Amenities />
        <Gallery />
        <LocationMap />
        <Contact />
        <AboutConcept />
        <LegalDisclaimer />
        <Footer />
      </main>

      {/* Global dust (rendered above main but under nav) */}
      <DustParticles />
    </AuthProvider>
  );
}
