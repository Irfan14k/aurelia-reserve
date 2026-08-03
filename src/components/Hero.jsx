import { useEffect, useRef, useState } from "react";
import { SITE } from "../data/site";
import { splitText, splitAndReveal } from "../lib/splitText";
import { onReady } from "../lib/ready";
import { scrollToSection } from "../lib/lenis";
import { useMousePosition, useMagnetic, useReducedMotion, useCountUp } from "../hooks";
import { useAmbientSound } from "../context/SoundContext";
import { fmtCrore } from "../lib/format";
import DustParticles from "./DustParticles";

const VIDEOS = [
  { src: "/media/hero-1.mp4", poster: "/images/opt/poster-hero-1.jpg" },
  { src: "/media/hero-2.mp4", poster: "/images/opt/poster-hero-2.jpg" },
];

/**
 * The arrival. Dual-video crossfade, volumetric light, drifting fog,
 * mouse parallax across six depth layers, split-serif headline,
 * glass price badge and a procedural ambience toggle.
 */
export default function Hero() {
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [price, priceRef] = useCountUp(SITE.hero.price, { duration: 2200 });

  const mediaRef = useRef(null);
  const contentRef = useRef(null);
  const fogARef = useRef(null);
  const fogBRef = useRef(null);
  const raysRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);

  const { x, y } = useMousePosition();
  const ctaRef = useMagnetic(0.28);
  const ghostRef = useMagnetic(0.22);
  const reduced = useReducedMotion();
  const { playing, toggle } = useAmbientSound();

  /* ——— Cinematic intro: split type begins after the preloader ——— */
  useEffect(() => {
    const off = onReady(() => {
      setTimeout(() => {
        if (titleRef.current) splitAndReveal(titleRef.current, { type: "words", delay: 120 });
        if (contentRef.current) contentRef.current.classList.add("is-split");
        setEntered(true);
      }, 250);
    });
    return off;
  }, []);

  /* ——— Dual video crossfade ——— */
  useEffect(() => {
    if (reduced || videoFailed) return;
    const id = setInterval(() => setActive((i) => (i + 1) % VIDEOS.length), 9000);
    return () => clearInterval(id);
  }, [reduced, videoFailed]);

  /* ——— Mouse parallax across depth layers ——— */
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const loop = () => {
      const nx = (x.current / window.innerWidth - 0.5) * 2;
      const ny = (y.current / window.innerHeight - 0.5) * 2;
      if (mediaRef.current)
        mediaRef.current.style.transform = `translate3d(${(nx * -12).toFixed(2)}px, ${(ny * -8).toFixed(2)}px, 0) scale(1.04)`;
      if (fogARef.current)
        fogARef.current.style.transform = `translate3d(${(nx * -26).toFixed(2)}px, ${(ny * -18).toFixed(2)}px, 0)`;
      if (fogBRef.current)
        fogBRef.current.style.transform = `translate3d(${(nx * 34).toFixed(2)}px, ${(ny * 22).toFixed(2)}px, 0)`;
      if (raysRef.current)
        raysRef.current.style.transform = `translate3d(${(nx * -18).toFixed(2)}px, ${(ny * -12).toFixed(2)}px, 0)`;
      if (badgeRef.current)
        badgeRef.current.style.transform = `translate3d(${(nx * 10).toFixed(2)}px, ${(ny * 8).toFixed(2)}px, 0)`;
      if (contentRef.current)
        contentRef.current.style.transform = `translate3d(${(nx * 6).toFixed(2)}px, ${(ny * 4).toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const go = (e, target) => {
    e.preventDefault();
    scrollToSection(target, -10);
  };

  return (
    <section id="hero" className="hero" aria-label={SITE.tagline}>
      {/* ——— Media: dual crossfading film ——— */}
      <div className="hero__media" ref={mediaRef} aria-hidden>
        {!reduced && !videoFailed && VIDEOS.map((v, i) => (
          <video
            key={v.src}
            className={`hero__video${i === active ? " is-active" : ""}`}
            src={v.src}
            poster={v.poster}
            muted
            loop
            playsInline
            autoPlay={i === 0}
            preload={i === 0 ? "auto" : "metadata"}
            onError={() => setVideoFailed(true)}
            tabIndex={-1}
          />
        ))}
        <div
          className="hero__fallback"
          style={{
            backgroundImage: `url(${VIDEOS[active].poster})`,
            opacity: reduced || videoFailed ? 1 : 0,
          }}
          aria-hidden
        />
        {/* time-of-day grade */}
        <div className="hero__grade" aria-hidden />
        {/* volumetric light */}
        <div className="hero__volumetric" aria-hidden />
        {/* animated light rays */}
        <div className="hero__rays" ref={raysRef} aria-hidden />
        {/* drifting fog */}
        <div className="hero__fog hero__fog--a" ref={fogARef} aria-hidden />
        <div className="hero__fog hero__fog--b" ref={fogBRef} aria-hidden />
        <DustParticles density={2.4} region="hero" className="hero__dust" />
      </div>

      {/* ——— Content ——— */}
      <div className="hero__content" ref={contentRef}>
        <p className="hero__eyebrow" data-reveal style={{ "--d": "150ms" }}>
          {SITE.hero.eyebrow}
        </p>

        <h1 className="hero__title" ref={titleRef}>
          {SITE.hero.lines.map((line, i) => (
            <span className="hero__line" key={i}>
              {line}
              {i < SITE.hero.lines.length - 1 && <br />}
            </span>
          ))}
        </h1>

        <p className="hero__lede" data-reveal style={{ "--d": "520ms" }}>
          {SITE.hero.lede}
        </p>

        <div className="hero__cta-row" data-reveal style={{ "--d": "700ms" }}>
          <button ref={ctaRef} className="btn-lux" data-cursor-label="Book" onClick={(e) => go(e, "#contact")}>
            <span className="btn-lux__sheen" aria-hidden />
            {SITE.hero.ctaPrimary}
            <svg className="btn-lux__arrow" width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden>
              <path d="M1 6h12M9 1.5 13.5 6 9 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button ref={ghostRef} className="btn-ghost" data-cursor-label="Explore" onClick={(e) => go(e, "#story")}>
            {SITE.hero.ctaSecondary}
          </button>
        </div>
      </div>

      {/* ——— Glass price badge ——— */}
      <div
        ref={badgeRef}
        className={`hero__badge glass glass-reflect${entered ? " is-visible" : ""}`}
        data-cursor-label="Open"
        role="group"
        aria-label={SITE.hero.priceLabel}
      >
        <div className="hero__badge-top">
          <span className="hero__badge-live live-chip">
            <span className="live-dot" aria-hidden /> Concept
          </span>
          <span className="hero__badge-key">Indicative</span>
        </div>
        <p className="hero__badge-price">
          <span ref={priceRef}>₹ {price.toFixed(1)}</span> Cr
        </p>
        <p className="hero__badge-note">{SITE.hero.priceNote}</p>
        <span className="hero__badge-cta">View pricing →</span>
      </div>

      {/* ——— Scroll cue ——— */}
      <div className="hero__cue" aria-hidden>
        <span className="hero__cue-line"><i /></span>
        <span className="hero__cue-text">Scroll</span>
      </div>

      {/* ——— Ambience toggle (hero corner) ——— */}
      <button
        className="hero__sound"
        onClick={toggle}
        aria-label={playing ? "Mute ambience" : "Play ambience"}
        aria-pressed={playing}
      >
        <span className={`dock__sound-bars${playing ? "" : " is-paused"}`} aria-hidden>
          <i /><i /><i /><i />
        </span>
        <span>{playing ? "Ambience on" : "Ambience"}</span>
      </button>

      {/* ——— Hero bottom fade into the page ——— */}
      <div className="hero__fade" aria-hidden />
    </section>
  );
}
