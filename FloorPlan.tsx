import { useState } from "react";

type Hot = { x: number; y: number; label: string; area: string; note: string };

const plans = {
  atrium: {
    name: "The Atrium",
    reserve: "Reserve I",
    size: "1,250 sq ft",
    hotspots: [
      { x: 22, y: 40, label: "Living Chamber", area: "420 sq ft", note: "Double-height, north-lit, timber ceiling." },
      { x: 58, y: 30, label: "Kitchen", area: "180 sq ft", note: "Chef's island, honed travertine surfaces." },
      { x: 76, y: 62, label: "Primary Suite", area: "280 sq ft", note: "Private terrace, sculptural bath." },
      { x: 35, y: 72, label: "Atrium Garden", area: "140 sq ft", note: "Enclosed courtyard, living wall." },
      { x: 82, y: 24, label: "Balcony", area: "90 sq ft", note: "Cinematic vista, bronze railing." },
    ] as Hot[],
  },
  solene: {
    name: "The Solene",
    reserve: "Reserve II",
    size: "1,780 sq ft",
    hotspots: [
      { x: 18, y: 32, label: "Sunroom", area: "220 sq ft", note: "Central atrium of glass and shadow." },
      { x: 50, y: 25, label: "Great Room", area: "560 sq ft", note: "Cinematic proportions, framed vista." },
      { x: 78, y: 48, label: "Primary Wing", area: "440 sq ft", note: "His & hers walk-in dressing." },
      { x: 30, y: 70, label: "Guest Suite", area: "210 sq ft", note: "En-suite with private balcony." },
      { x: 68, y: 78, label: "Library", area: "180 sq ft", note: "Silence room, floor-to-ceiling shelving." },
      { x: 12, y: 60, label: "Cross Ventilation", area: "—", note: "East-west flow, engineered by prevailing wind." },
    ] as Hot[],
  },
  aureate: {
    name: "The Aureate Penthouse",
    reserve: "Reserve III",
    size: "2,650 sq ft",
    hotspots: [
      { x: 20, y: 30, label: "Grand Salon", area: "780 sq ft", note: "Panoramic gallery of the horizon." },
      { x: 55, y: 22, label: "Sky Kitchen", area: "260 sq ft", note: "Chef's kitchen with sommelier bar." },
      { x: 80, y: 40, label: "Private Pool Deck", area: "420 sq ft", note: "Infinity edge, cantilevered." },
      { x: 40, y: 65, label: "Owner's Suite", area: "560 sq ft", note: "Double dressing, marble spa bath." },
      { x: 70, y: 78, label: "Sky Garden", area: "310 sq ft", note: "Bronze pergola, botanical terrace." },
      { x: 12, y: 78, label: "Master Bedroom", area: "320 sq ft", note: "Floor-to-ceiling glazing, dawn-facing." },
    ] as Hot[],
  },
};

type Key = keyof typeof plans;

export default function FloorPlan() {
  const [plan, setPlan] = useState<Key>("solene");
  const [active, setActive] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rot, setRot] = useState(0);
  const [full, setFull] = useState(false);
  const cur = plans[plan];

  return (
    <section id="floorplan" className="relative py-32 md:py-44 px-6 md:px-14 bg-onyx overflow-hidden">
      <div className="max-w-[1500px] mx-auto">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="mono text-[0.62rem] tracking-[0.5em] uppercase text-gold mb-6 flex items-center gap-3" data-reveal>
              <span className="w-10 h-px bg-gold" />
              <span>03 · Floor Plans</span>
            </div>
            <h2 className="display text-5xl md:text-6xl leading-[0.92] text-bone mb-8" data-reveal>
              Interactive<br />
              <em className="text-gold-grad">geometries.</em>
            </h2>
            <p className="text-parchment/60 leading-relaxed mb-10" data-reveal>
              Trace the light. Hover the marks to reveal the choreography of each residence — a study in flow, proportion and quiet consequence.
            </p>

            <div className="space-y-3" data-reveal>
              {(Object.keys(plans) as Key[]).map((k) => (
                <button
                  key={k}
                  data-cursor="Open"
                  onClick={() => { setPlan(k); setActive(null); setZoom(1); setRot(0); }}
                  className={`w-full text-left p-4 border transition-all duration-500 group ${
                    plan === k
                      ? "border-gold bg-gold/5 text-bone"
                      : "border-parchment/15 text-parchment/60 hover:border-parchment/40"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="display text-xl">{plans[k].name}</div>
                    <div className="mono text-[0.55rem] tracking-[0.3em] uppercase text-gold">{plans[k].reserve}</div>
                  </div>
                  <div className="mono text-[0.62rem] tracking-[0.3em] uppercase text-parchment/50">
                    {plans[k].size} · {plans[k].hotspots.length} POI
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3" data-reveal>
              <button data-cursor="Download" className="btn-ghost text-[0.6rem] px-4 py-2.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download PDF
              </button>
            </div>
          </div>

          <div className="md:col-span-8 relative" data-reveal>
            <div className={`relative glass-strong overflow-hidden ${full ? "fixed inset-4 z-[70] aspect-auto" : "aspect-[4/3]"}`}>
              {/* Toolbar */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1 glass rounded-full px-2 py-1">
                <button data-cursor="Zoom -" onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))} className="w-8 h-8 text-parchment/70 hover:text-gold transition-colors" aria-label="Zoom out">–</button>
                <div className="mono text-[0.55rem] text-parchment/50 tracking-widest">{Math.round(zoom * 100)}%</div>
                <button data-cursor="Zoom +" onClick={() => setZoom((z) => Math.min(2, z + 0.2))} className="w-8 h-8 text-parchment/70 hover:text-gold transition-colors" aria-label="Zoom in">+</button>
                <span className="w-px h-4 bg-parchment/20 mx-1" />
                <button data-cursor="Rotate" onClick={() => setRot((r) => r + 90)} className="w-8 h-8 text-parchment/70 hover:text-gold transition-colors" aria-label="Rotate">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="mx-auto">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                </button>
                <span className="w-px h-4 bg-parchment/20 mx-1" />
                <button data-cursor={full ? "Close" : "Fullscreen"} onClick={() => setFull(!full)} className="w-8 h-8 text-parchment/70 hover:text-gold transition-colors" aria-label="Fullscreen">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="mx-auto">
                    {full ? (<><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></>) :
                     (<><path d="M3 7V3h4"/><path d="M17 3h4v4"/><path d="M21 17v4h-4"/><path d="M7 21H3v-4"/></>)}
                  </svg>
                </button>
              </div>

              {/* Plan */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `scale(${zoom}) rotate(${rot}deg)`,
                  transition: "transform 0.8s cubic-bezier(0.65,0.05,0.15,1)",
                }}
              >
                <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden>
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c9a35a" strokeWidth="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full">
                  <rect x="60" y="60" width="680" height="480" fill="none" stroke="#c9a35a" strokeWidth="2" opacity="0.7" />
                  <rect x="60" y="60" width="680" height="480" fill="rgba(201,163,90,0.03)" />

                  <g stroke="#c9a35a" strokeWidth="1.2" opacity="0.5" fill="none">
                    {plan === "atrium" && (<>
                      <line x1="60" y1="300" x2="440" y2="300" />
                      <line x1="440" y1="60" x2="440" y2="540" />
                      <line x1="440" y1="380" x2="740" y2="380" />
                      <circle cx="280" cy="430" r="70" strokeDasharray="4 4" />
                    </>)}
                    {plan === "solene" && (<>
                      <line x1="60" y1="240" x2="500" y2="240" />
                      <line x1="500" y1="60" x2="500" y2="360" />
                      <line x1="60" y1="420" x2="740" y2="420" />
                      <line x1="380" y1="420" x2="380" y2="540" />
                      <rect x="200" y="120" width="180" height="90" strokeDasharray="4 4" />
                    </>)}
                    {plan === "aureate" && (<>
                      <line x1="60" y1="220" x2="480" y2="220" />
                      <line x1="480" y1="60" x2="480" y2="300" />
                      <line x1="480" y1="300" x2="740" y2="300" />
                      <line x1="60" y1="400" x2="740" y2="400" />
                      <line x1="360" y1="400" x2="360" y2="540" />
                      <circle cx="620" cy="200" r="60" strokeDasharray="6 4" />
                    </>)}
                  </g>

                  {/* Compass */}
                  <g transform="translate(700, 100)" opacity="0.6">
                    <circle r="22" fill="none" stroke="#c9a35a" strokeWidth="0.5" />
                    <path d="M 0 -18 L 4 4 L 0 0 L -4 4 Z" fill="#c9a35a" />
                    <text y="-26" textAnchor="middle" fill="#c9a35a" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="2">N</text>
                  </g>

                  {/* Scale */}
                  <g transform="translate(90, 560)" opacity="0.5">
                    <line x1="0" y1="0" x2="80" y2="0" stroke="#c9a35a" strokeWidth="1" />
                    <line x1="0" y1="-4" x2="0" y2="4" stroke="#c9a35a" />
                    <line x1="80" y1="-4" x2="80" y2="4" stroke="#c9a35a" />
                    <text x="40" y="18" textAnchor="middle" fill="#c9a35a" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="1">5 M</text>
                  </g>
                </svg>

                {cur.hotspots.map((h, i) => (
                  <button
                    key={i}
                    data-cursor="View"
                    className="hotspot"
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onClick={() => setActive(i)}
                    aria-label={h.label}
                  />
                ))}
              </div>

              {/* Tooltip */}
              {active !== null && (
                <div
                  className="absolute glass-strong px-5 py-4 max-w-[240px] pointer-events-none z-30"
                  style={{
                    left: `${cur.hotspots[active].x}%`,
                    top: `${cur.hotspots[active].y}%`,
                    transform: "translate(20px, -50%)",
                  }}
                >
                  <div className="mono text-[0.56rem] tracking-[0.35em] uppercase text-gold mb-1">
                    Point of Interest
                  </div>
                  <div className="display text-xl text-bone mb-1">{cur.hotspots[active].label}</div>
                  <div className="mono text-[0.55rem] tracking-[0.3em] uppercase text-parchment/50 mb-2">
                    {cur.hotspots[active].area}
                  </div>
                  <div className="text-xs text-parchment/70 leading-relaxed italic serif">
                    {cur.hotspots[active].note}
                  </div>
                </div>
              )}

              <div className="absolute top-3 left-3 mono text-[0.58rem] tracking-[0.35em] uppercase text-parchment/50">
                Schematic · Not to Scale
              </div>
              <div className="absolute bottom-4 right-4 text-right">
                <div className="display text-xl text-bone">{cur.name}</div>
                <div className="mono text-[0.58rem] tracking-[0.35em] uppercase text-gold mt-1">
                  {cur.size} · {cur.hotspots.length} POI
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                {[
                  { c: "#c9a35a", l: "Living" },
                  { c: "#8a6d33", l: "Private" },
                  { c: "#e6c47f", l: "Outdoor" },
                ].map((l) => (
                  <div key={l.l} className="flex items-center gap-2">
                    <span className="w-3 h-3" style={{ background: l.c, opacity: 0.7 }} />
                    <span className="mono text-[0.55rem] tracking-[0.3em] uppercase text-parchment/50">{l.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {full && (
              <button
                onClick={() => setFull(false)}
                className="fixed inset-0 z-[65] bg-obsidian/60 backdrop-blur-md"
                aria-label="Close fullscreen"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
