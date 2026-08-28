import { useState } from "react";

type POI = { x: number; y: number; label: string; time: string; cat: string; icon: string };

const pois: POI[] = [
  { x: 50, y: 50, label: "Aurelia Reserve", time: "—", cat: "The Reserve", icon: "diamond" },
  { x: 30, y: 32, label: "Private Green District", time: "3 min", cat: "Nature", icon: "tree" },
  { x: 68, y: 28, label: "Waterfront Boulevard", time: "6 min", cat: "Leisure", icon: "wave" },
  { x: 74, y: 52, label: "Business District", time: "12 min", cat: "Commerce", icon: "tower" },
  { x: 22, y: 62, label: "International Airport", time: "24 min", cat: "Travel", icon: "plane" },
  { x: 42, y: 74, label: "Metro Connection", time: "4 min", cat: "Transit", icon: "metro" },
  { x: 60, y: 68, label: "Luxury Retail", time: "8 min", cat: "Shopping", icon: "bag" },
  { x: 34, y: 44, label: "International School", time: "9 min", cat: "Education", icon: "book" },
  { x: 66, y: 40, label: "Healthcare Campus", time: "11 min", cat: "Wellness", icon: "cross" },
];

function POIIcon({ name }: { name: string }) {
  const props = { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.4 } as const;
  switch (name) {
    case "diamond": return <svg {...props}><path d="M12 2 L22 12 L12 22 L2 12 Z"/></svg>;
    case "tree": return <svg {...props}><path d="M12 22V12M6 12l6-9 6 9M6 12l6-6 6 6"/></svg>;
    case "wave": return <svg {...props}><path d="M2 12c3-3 6-3 10 0s7 3 10 0M2 18c3-3 6-3 10 0s7 3 10 0"/></svg>;
    case "tower": return <svg {...props}><rect x="6" y="2" width="12" height="20"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="14" x2="18" y2="14"/></svg>;
    case "plane": return <svg {...props}><path d="M17.8 19.8 6 12l11.8-7.8L20 6l-7 6 7 6-2.2 1.8z"/></svg>;
    case "metro": return <svg {...props}><rect x="4" y="4" width="16" height="14" rx="2"/><path d="M4 12h16M8 22l2-4M14 18l2 4"/></svg>;
    case "bag": return <svg {...props}><path d="M6 8h12l-1 12H7L6 8zM9 8V6a3 3 0 016 0v2"/></svg>;
    case "book": return <svg {...props}><path d="M4 4h12a4 4 0 014 4v14H8a4 4 0 01-4-4V4z"/><path d="M4 4v14"/></svg>;
    case "cross": return <svg {...props}><path d="M12 6v12M6 12h12"/></svg>;
    default: return null;
  }
}

export default function LocationMap() {
  const [active, setActive] = useState<number>(0);
  const p = pois[active];

  return (
    <section id="location" className="relative py-32 md:py-44 px-6 md:px-14 bg-onyx overflow-hidden">
      <div className="max-w-[1500px] mx-auto">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="mono text-[0.62rem] tracking-[0.5em] uppercase text-gold mb-6 flex items-center gap-3" data-reveal>
              <span className="w-10 h-px bg-gold" />
              <span>06 · Location</span>
            </div>
            <h2 className="display text-5xl md:text-6xl leading-[0.92] text-bone mb-8" data-reveal>
              A geography<br /><em className="text-gold-grad">of quiet.</em>
            </h2>
            <p className="text-parchment/60 leading-relaxed mb-10" data-reveal>
              Positioned between an untouched green district and the pulse of the wider metropolis — Aurelia Reserve sits at a fictional address of consequence.
            </p>

            <div className="space-y-0.5" data-reveal>
              {pois.map((poi, i) => (
                <button
                  key={i}
                  data-cursor="View"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`w-full flex items-center justify-between py-3 border-b border-parchment/10 transition-all duration-500 group ${
                    active === i ? "text-bone" : "text-parchment/50 hover:text-parchment/80"
                  }`}
                >
                  <span className="flex items-center gap-3 text-sm">
                    <span className={`w-6 h-6 flex items-center justify-center transition-all ${active === i ? "text-gold" : "text-parchment/40"}`}>
                      <POIIcon name={poi.icon} />
                    </span>
                    <span className="tracking-wide">{poi.label}</span>
                  </span>
                  <span className={`mono text-[0.6rem] tracking-[0.3em] uppercase ${active === i ? "text-gold" : "text-parchment/40"}`}>
                    {poi.time}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-8 relative" data-reveal>
            <div className="relative aspect-square md:aspect-[16/13] glass-strong overflow-hidden">
              <svg viewBox="0 0 800 650" className="absolute inset-0 w-full h-full">
                <defs>
                  <radialGradient id="mapglow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#c9a35a" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#c9a35a" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="routegrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#e6c47f" />
                    <stop offset="1" stopColor="#8a6d33" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                <rect width="800" height="650" fill="url(#mapglow)" />

                <g opacity="0.08" stroke="#c9a35a" strokeWidth="0.5">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <line key={"h" + i} x1="0" y1={i * 40} x2="800" y2={i * 40} />
                  ))}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <line key={"v" + i} x1={i * 40} y1="0" x2={i * 40} y2="650" />
                  ))}
                </g>

                <path d="M 0 420 Q 200 380 400 400 T 800 380" stroke="#c9a35a" strokeWidth="1" fill="none" opacity="0.4" />
                <path d="M 120 0 Q 180 200 220 320 T 280 650" stroke="#c9a35a" strokeWidth="0.8" fill="none" opacity="0.3" strokeDasharray="4 6" />
                <path d="M 550 0 Q 500 220 480 350 T 500 650" stroke="#c9a35a" strokeWidth="0.8" fill="none" opacity="0.3" strokeDasharray="4 6" />

                <ellipse cx="220" cy="220" rx="140" ry="90" fill="#c9a35a" opacity="0.05" />
                <ellipse cx="220" cy="220" rx="100" ry="60" fill="none" stroke="#c9a35a" opacity="0.15" strokeDasharray="2 4" />

                {/* Animated routes */}
                {pois.slice(1).map((poi, i) => {
                  const isActive = active === i + 1;
                  const x1 = pois[0].x * 8;
                  const y1 = pois[0].y * 6.5;
                  const x2 = poi.x * 8;
                  const y2 = poi.y * 6.5;
                  const len = Math.hypot(x2 - x1, y2 - y1);
                  return (
                    <g key={i}>
                      <line
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="url(#routegrad)"
                        strokeWidth={isActive ? 1.2 : 0.4}
                        opacity={isActive ? 0.9 : 0.15}
                        strokeDasharray={isActive ? undefined : "3 4"}
                        className="transition-all duration-700"
                      />
                      {isActive && (
                        <circle r="3" fill="#e6c47f">
                          <animateMotion dur="2.5s" repeatCount="indefinite"
                            path={`M ${x1} ${y1} L ${x2} ${y2}`} />
                        </circle>
                      )}
                      {isActive && (
                        <text
                          x={(x1 + x2) / 2}
                          y={(y1 + y2) / 2 - 8}
                          textAnchor="middle"
                          fill="#e6c47f"
                          fontSize="10"
                          fontFamily="JetBrains Mono"
                          letterSpacing="2"
                        >
                          {poi.time.toUpperCase()} · {Math.round(len / 20)} KM
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* POI dots */}
              {pois.map((poi, i) => (
                <button
                  key={i}
                  data-cursor="View"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
                  aria-label={poi.label}
                >
                  {i === 0 ? (
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-gold shadow-[0_0_20px_rgba(201,163,90,0.9)]" />
                      <div className="absolute inset-0 rounded-full bg-gold animate-ping opacity-40" />
                    </div>
                  ) : (
                    <div className={`map-dot w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      active === i ? "bg-gold scale-[1.8]" : "bg-parchment/50 group-hover:bg-gold"
                    }`} />
                  )}
                </button>
              ))}

              {/* Info card */}
              <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-xs glass-strong p-5">
                <div className="mono text-[0.58rem] tracking-[0.4em] uppercase text-gold mb-1 flex items-center gap-2">
                  <POIIcon name={p.icon} />
                  <span>{p.cat}</span>
                </div>
                <div className="display text-2xl text-bone mb-1">{p.label}</div>
                <div className="mono text-[0.65rem] tracking-[0.28em] uppercase text-parchment/60">
                  {p.time === "—" ? "You are here" : `${p.time} · Chauffeured`}
                </div>
              </div>

              <div className="absolute top-4 right-4 text-right mono text-[0.58rem] tracking-[0.35em] uppercase text-parchment/50">
                <div>Schematic Cartography</div>
                <div className="text-gold/70 mt-1">Fictional Locations</div>
              </div>

              <div className="absolute top-4 left-4 flex items-center gap-2 mono text-[0.58rem] tracking-[0.3em] uppercase text-parchment/50">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="#c9a35a" strokeWidth="0.5" opacity="0.6" />
                  <path d="M 12 4 L 14 12 L 12 10 L 10 12 Z" fill="#c9a35a" />
                </svg>
                <span>N</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
