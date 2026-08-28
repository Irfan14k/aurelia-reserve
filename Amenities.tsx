import { useEffect, useRef, useState } from "react";
import { useCountUp } from "../hooks";

const amenities = [
  {
    n: "01",
    name: "The Twilight Pool",
    desc: "A cantilevered infinity edge suspended above a private forest, illuminated at dusk by warm underwater light.",
    video: "https://videos.pexels.com/video-files/36867544/15619026_3840_2160_30fps.mp4",
    icon: "pool",
    stat: { n: 40, s: "M", l: "Cantilever" },
  },
  {
    n: "02",
    name: "The Private Baths",
    desc: "A subterranean spa carved from warm stone, lit only by candlelight. Rituals of water, salt and silence.",
    video: "https://videos.pexels.com/video-files/38675645/16428603_3840_2160_30fps.mp4",
    icon: "spa",
    stat: { n: 12, s: "", l: "Suites" },
  },
  {
    n: "03",
    name: "The Sky Lounge",
    desc: "Members-only observatory. A curated library, a bar tended by a resident sommelier, a view worth sitting for.",
    video: "https://videos.pexels.com/video-files/38675651/16428653_3840_2160_30fps.mp4",
    icon: "lounge",
    stat: { n: 360, s: "°", l: "Panorama" },
  },
  {
    n: "04",
    name: "The Reading Garden",
    desc: "An enclosed botanical courtyard designed for the ritual of stillness. Curated by a landscape atelier.",
    video: "https://videos.pexels.com/video-files/29095944/12571464_3840_2160_60fps.mp4",
    icon: "garden",
    stat: { n: 2, s: "K", l: "Sq Ft" },
  },
];

function Icon({ name }: { name: string }) {
  const p = "stroke-[1.2]";
  switch (name) {
    case "pool":
      return (
        <svg viewBox="0 0 40 40" className={p} fill="none" stroke="currentColor">
          <path d="M4 24 Q10 20 16 24 T28 24 T40 24" />
          <path d="M4 30 Q10 26 16 30 T28 30 T40 30" opacity="0.6" />
          <circle cx="14" cy="12" r="4" />
          <circle cx="26" cy="12" r="4" />
        </svg>
      );
    case "spa":
      return (
        <svg viewBox="0 0 40 40" className={p} fill="none" stroke="currentColor">
          <path d="M20 6 C24 12 24 18 20 22 C16 18 16 12 20 6z" />
          <path d="M12 20 C16 22 18 26 20 32 C22 26 24 22 28 20" />
          <line x1="20" y1="22" x2="20" y2="32" />
        </svg>
      );
    case "lounge":
      return (
        <svg viewBox="0 0 40 40" className={p} fill="none" stroke="currentColor">
          <path d="M6 26 L34 26 L32 34 L8 34 Z" />
          <path d="M10 26 L10 14 L30 14 L30 26" />
          <line x1="14" y1="20" x2="26" y2="20" opacity="0.6" />
        </svg>
      );
    case "garden":
      return (
        <svg viewBox="0 0 40 40" className={p} fill="none" stroke="currentColor">
          <path d="M20 34 L20 18" />
          <path d="M20 22 C14 22 12 18 12 14 C16 14 20 16 20 22z" />
          <path d="M20 20 C26 20 28 16 28 12 C24 12 20 14 20 20z" />
          <path d="M12 34 L28 34" />
        </svg>
      );
    default: return null;
  }
}

function StatNum({ target, suffix }: { target: number; suffix: string }) {
  const { n, ref } = useCountUp(target);
  return <span ref={ref}>{n}{suffix}</span>;
}

export default function Amenities() {
  const [active, setActive] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const a = amenities[active];

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.src = a.video;
    v.load();
    v.play().catch(() => {});
  }, [active, a.video]);

  return (
    <section id="amenities" className="relative overflow-hidden bg-obsidian">
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          autoPlay
          className="absolute inset-0 w-full h-full object-cover scale-[1.06]"
          style={{ transition: "opacity 900ms cubic-bezier(0.65,0.05,0.15,1)" }}
        />
        <div className="absolute inset-0 bg-obsidian/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-obsidian" />
        <div className="light-rays" aria-hidden />
      </div>

      <div className="relative py-32 md:py-44 px-6 md:px-14">
        <div className="max-w-[1500px] mx-auto">
          <div className="mb-20">
            <div className="mono text-[0.62rem] tracking-[0.5em] uppercase text-gold mb-6 flex items-center gap-3" data-reveal>
              <span className="w-10 h-px bg-gold" />
              <span>04 · Amenities</span>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-end">
              <h2 className="display text-5xl md:text-7xl leading-[0.92] text-bone" data-reveal>
                Rituals,<br />
                <em className="text-gold-grad">rehearsed in private.</em>
              </h2>
              <p className="text-parchment/70 leading-relaxed max-w-md" data-reveal>
                Seven signature amenities, each choreographed to a specific hour of the day. Wellness as ceremony. Leisure as architecture.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-5" data-reveal>
              <div className="space-y-1">
                {amenities.map((am, i) => (
                  <button
                    key={am.n}
                    data-cursor="View"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`w-full text-left group relative border-t border-parchment/10 py-6 transition-all duration-700 ${
                      active === i ? "" : ""
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`mono text-[0.6rem] tracking-[0.32em] uppercase transition-colors duration-500 ${
                        active === i ? "text-gold" : "text-parchment/40"
                      }`}>
                        {am.n}
                      </div>
                      <div className={`w-10 h-10 flex items-center justify-center transition-all duration-500 ${
                        active === i ? "text-gold scale-110" : "text-parchment/50"
                      }`}>
                        <Icon name={am.icon} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`display text-2xl md:text-3xl transition-colors duration-500 ${
                          active === i ? "text-bone" : "text-parchment/60 group-hover:text-parchment/90"
                        }`}>
                          {am.name}
                        </h3>
                      </div>
                      <div className={`transition-all duration-500 ${
                        active === i ? "opacity-100 translate-x-0 text-gold" : "opacity-0 -translate-x-2 text-parchment/40"
                      }`}>
                        →
                      </div>
                    </div>
                    <div className={`h-px bg-gold transition-all duration-1000 ${
                      active === i ? "w-full" : "w-0"
                    }`} />
                  </button>
                ))}
                <div className="border-t border-parchment/10" />
              </div>
            </div>

            {/* Detail card */}
            <div className="md:col-span-7 md:col-start-6" data-reveal>
              <div key={active} className="glass-strong glass-reflect p-8 md:p-12">
                <div className="mono text-[0.6rem] tracking-[0.4em] uppercase text-gold mb-6">
                  Amenity · {a.n}
                </div>
                <h3 className="display text-4xl md:text-5xl text-bone leading-[0.95] mb-6">
                  {a.name}
                </h3>
                <p className="serif italic text-lg text-parchment/80 leading-relaxed mb-10 max-w-md">
                  {a.desc}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gold/20">
                  <div>
                    <div className="display text-4xl text-gold-grad">
                      <StatNum target={a.stat.n} suffix={a.stat.s} />
                    </div>
                    <div className="mono text-[0.58rem] tracking-[0.35em] uppercase text-parchment/50 mt-2">{a.stat.l}</div>
                  </div>
                  <div>
                    <div className="display text-4xl text-gold-grad">24</div>
                    <div className="mono text-[0.58rem] tracking-[0.35em] uppercase text-parchment/50 mt-2">Hours · Access</div>
                  </div>
                  <div>
                    <div className="display text-4xl text-gold-grad">V</div>
                    <div className="mono text-[0.58rem] tracking-[0.35em] uppercase text-parchment/50 mt-2">Concierge Tier</div>
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  <button data-cursor="Book" className="btn-gold text-[0.62rem] px-5 py-3">
                    Reserve Time
                  </button>
                  <button data-cursor="Explore" className="btn-ghost text-[0.62rem] px-5 py-3">
                    All Amenities
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
