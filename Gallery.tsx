import { useEffect, useRef, useState } from "react";

const items = [
  { src: "/images/interior-1.jpg", label: "The Living Chamber", cat: "Interior", depth: 1.0, tall: true },
  { src: "/images/amenity-pool.jpg", label: "Twilight Water", cat: "Amenity", depth: 0.7 },
  { src: "/images/exterior-detail.jpg", label: "Bronze Facade", cat: "Architecture", depth: 0.4 },
  { src: "/images/interior-2.jpg", label: "The Bedchamber", cat: "Interior", depth: 1.0, tall: true },
  { src: "/images/amenity-spa.jpg", label: "Private Baths", cat: "Wellness", depth: 0.7 },
  { src: "/images/hero.jpg", label: "Golden Hour", cat: "Architecture", depth: 0.4 },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Parallax by depth
  useEffect(() => {
    const onScroll = () => {
      const s = sectionRef.current;
      if (!s) return;
      const rect = s.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = 1 - (rect.top + rect.height / 2) / vh; // -1..1 roughly
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const depth = items[i].depth;
        // Foreground (depth 1.0) moves 0; Background (0.4) moves most negative
        const shift = (1 - depth) * -60 * progress;
        el.style.transform = `translateY(${shift}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard nav in lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowLeft") setLightbox((prev) => prev === null ? null : (prev - 1 + items.length) % items.length);
      else if (e.key === "ArrowRight") setLightbox((prev) => prev === null ? null : (prev + 1) % items.length);
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(2.5, z + 0.2));
      else if (e.key === "-") setZoom((z) => Math.max(1, z - 0.2));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  useEffect(() => { setZoom(1); }, [lightbox]);

  // Lock page scroll while the lightbox dialog is open
  useEffect(() => {
    if (lightbox === null) return;
    document.body.classList.add("is-locked");
    return () => document.body.classList.remove("is-locked");
  }, [lightbox]);

  return (
    <section id="gallery" ref={sectionRef} className="relative py-32 md:py-44 px-6 md:px-14 bg-obsidian overflow-hidden">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <div className="mono text-[0.62rem] tracking-[0.5em] uppercase text-gold mb-6 flex items-center gap-3" data-reveal>
              <span className="w-10 h-px bg-gold" />
              <span>05 · Gallery</span>
            </div>
            <h2 className="display text-5xl md:text-7xl leading-[0.92] text-bone" data-reveal>
              A visual <em className="text-gold-grad">reserve.</em>
            </h2>
          </div>
          <div className="flex flex-col md:items-end gap-3">
            <p className="max-w-sm text-parchment/60 leading-relaxed" data-reveal>
              An intimate portfolio — moments of an architecture that behaves like weather.
            </p>
            <div className="mono text-[0.58rem] tracking-[0.32em] uppercase text-parchment/40" data-reveal>
              Parallax · Multi-Depth · Lightbox
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[280px] gap-4 md:gap-6">
          {items.map((it, i) => {
            const span = it.tall ? "row-span-2" : "";
            return (
              <div
                key={i}
                ref={(el) => { itemRefs.current[i] = el; }}
                className={`${span} will-change-transform`}
                style={{ transition: "transform 0.15s linear" }}
                data-reveal="scale"
              >
                <button
                  data-cursor="Open"
                  onClick={() => setLightbox(i)}
                  className="gallery-item group relative w-full h-full bg-onyx glass-reflect"
                >
                  <div
                    className="gimg absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${it.src})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700" />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex justify-between items-end text-bone">
                    <div>
                      <div className="mono text-[0.55rem] tracking-[0.35em] uppercase text-gold/80 mb-1">
                        {it.cat}
                      </div>
                      <div className="display text-lg md:text-xl">{it.label}</div>
                    </div>
                    <div className="w-9 h-9 rounded-full border border-parchment/40 flex items-center justify-center text-parchment/70 group-hover:border-gold group-hover:text-gold group-hover:scale-110 transition-all duration-500">
                      +
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 mono text-[0.54rem] tracking-[0.3em] uppercase text-parchment/40">
                    {String(i + 1).padStart(2, "0")} · Depth {Math.round(it.depth * 100)}%
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          data-lock-scroll
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery image ${lightbox + 1} of ${items.length}: ${items[lightbox].label}`}
          className="fixed inset-0 z-[95] bg-obsidian/95 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            data-cursor="Close"
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            className="absolute top-6 right-6 text-parchment text-3xl hover:text-gold transition-colors z-10"
            aria-label="Close"
          >
            ×
          </button>
          <button
            data-cursor="Prev"
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-parchment/20 rounded-full flex items-center justify-center text-parchment/60 hover:text-gold hover:border-gold transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + items.length) % items.length); }}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            data-cursor="Next"
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-parchment/20 rounded-full flex items-center justify-center text-parchment/60 hover:text-gold hover:border-gold transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % items.length); }}
            aria-label="Next"
          >
            ›
          </button>

          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="overflow-hidden" style={{ maxHeight: "80vh" }}>
              <img
                src={items[lightbox].src}
                alt={items[lightbox].label}
                decoding="async"
                className="w-full max-h-[80vh] object-contain transition-transform duration-500"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
            <div className="mt-4 flex justify-between items-end text-bone">
              <div>
                <div className="mono text-[0.58rem] tracking-[0.4em] uppercase text-gold mb-1">{items[lightbox].cat}</div>
                <div className="display text-2xl">{items[lightbox].label}</div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  data-cursor="Zoom -"
                  onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(1, z - 0.2)); }}
                  className="mono text-parchment/60 hover:text-gold transition-colors w-8 h-8"
                >–</button>
                <div className="mono text-[0.58rem] tracking-[0.35em] uppercase text-parchment/50">
                  {String(lightbox + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")} · {Math.round(zoom * 100)}%
                </div>
                <button
                  data-cursor="Zoom +"
                  onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(2.5, z + 0.2)); }}
                  className="mono text-parchment/60 hover:text-gold transition-colors w-8 h-8"
                >+</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
