import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY } from "../data/gallery";
import { stopScroll, startScroll } from "../lib/lenis";
import { useParallax, useReducedMotion } from "../hooks";
import SectionHeading from "./SectionHeading";

function Tile({ item, index, onOpen, parallax }) {
  const innerRef = useParallax(parallax);

  return (
    <figure
      className={`gal-tile gal-tile--${item.ratio}`}
      data-reveal
      style={{ "--d": `${(index % 3) * 110}ms` }}
      data-cursor="view"
      data-cursor-label="View"
      onClick={() => onOpen(index)}
    >
      <div className="gal-tile__wrap">
        <div className="gal-tile__img" ref={innerRef}>
          <img
            src={item.src}
            alt={item.caption}
            loading="lazy"
            decoding="async"
            width={1400}
            height={1750}
          />
        </div>
        <div className="gal-tile__shade" aria-hidden />
        <figcaption className="gal-tile__cap">
          <span className="gal-tile__idx">{String(index + 1).padStart(2, "0")}</span>
          <span className="gal-tile__txt">
            <em>{item.caption}</em>
            <small>{item.meta}</small>
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

/**
 * Gallery — luxury masonry with parallax depth, and a fullscreen
 * viewer with drag, swipe, keyboard, progress and preloading.
 */
export default function Gallery() {
  const [idx, setIdx] = useState(null);
  const [dragX, setDragX] = useState(0);
  const drag = useRef(null);
  const reduced = useReducedMotion();
  const lightboxRef = useRef(null);

  const open = useCallback((i) => {
    setIdx(i);
    setDragX(0);
    stopScroll();
  }, []);

  const close = useCallback(() => {
    setIdx(null);
    startScroll();
  }, []);

  const step = useCallback((dir) => {
    setIdx((i) => (i + dir + GALLERY.length) % GALLERY.length);
    setDragX(0);
  }, []);

  /* keyboard */
  useEffect(() => {
    if (idx === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, close, step]);

  /* preload next image */
  useEffect(() => {
    if (idx === null) return;
    [1, 2].forEach((off) => {
      const img = new Image();
      img.src = GALLERY[(idx + off) % GALLERY.length].src;
    });
  }, [idx]);

  /* drag / swipe */
  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, dx: 0 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    drag.current.dx = e.clientX - drag.current.x;
    setDragX(drag.current.dx);
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    if (drag.current.dx < -70) step(1);
    else if (drag.current.dx > 70) step(-1);
    else setDragX(0);
    drag.current = null;
  };

  const current = idx !== null ? GALLERY[idx] : null;

  return (
    <section id="gallery" className="gallery">
      <div className="wrap">
        <SectionHeading
          eyebrow="05 · Gallery"
          title={<>Light, held <em>in frames</em>.</>}
          meta={`${GALLERY.length} views`}
        />

        <div className="gal-masonry">
          {GALLERY.map((item, i) => (
            <Tile key={item.src} item={item} index={i} onOpen={open} parallax={i % 2 === 0 ? 0.06 : -0.05} />
          ))}
        </div>
      </div>

      {/* ——— Fullscreen viewer ——— */}
      {current && (
        <div
          ref={lightboxRef}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery viewer"
          data-cursor="view"
          data-cursor-label="Drag"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="lightbox__backdrop" onClick={close} aria-hidden />

          <button className="lightbox__close" onClick={close} aria-label="Close viewer">
            <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              <path d="m3 3 12 12M15 3 3 15" />
            </svg>
          </button>

          {/* progress */}
          <div className="lightbox__progress" aria-hidden>
            <i style={{ transform: `scaleX(${(idx + 1) / GALLERY.length})` }} />
          </div>

          <div className="lightbox__counter" aria-hidden>
            {String(idx + 1).padStart(2, "0")} <span>/</span> {String(GALLERY.length).padStart(2, "0")}
          </div>

          <button className="lightbox__arrow lightbox__arrow--prev" onClick={() => step(-1)} aria-label="Previous image" data-cursor-label="Prev">
            <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M13 3 6 10l7 7" />
            </svg>
          </button>
          <button className="lightbox__arrow lightbox__arrow--next" onClick={() => step(1)} aria-label="Next image" data-cursor-label="Next">
            <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m7 3 7 7-7 7" />
            </svg>
          </button>

          <div className="lightbox__stage">
            <img
              key={current.src}
              src={current.src}
              alt={current.caption}
              style={{ transform: `translateX(${dragX}px) ${reduced ? "" : "scale(1.02)"}` }}
              draggable={false}
            />
          </div>

          <div className="lightbox__cap">
            <p className="lightbox__cap-title">{current.caption}</p>
            <p className="lightbox__cap-meta">{current.meta}</p>
          </div>
        </div>
      )}
    </section>
  );
}
