import { useEffect, useRef, useState } from "react";
import { useResidences } from "../hooks/useResidences";
import type { Residence } from "../types/domain";

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1200px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(1200px) rotateY(0) rotateX(0)";
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transition: "transform 0.5s cubic-bezier(0.2,0.7,0.15,1)", transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

export default function Residences() {
  const { residences, loading, error, source, refetch } = useResidences();
  const [active, setActive] = useState(1);
  const [compare, setCompare] = useState(false);

  // Keep the selection in range when the dataset changes length
  useEffect(() => {
    if (residences.length && active > residences.length - 1) {
      setActive(residences.length - 1);
    }
  }, [residences.length, active]);

  const safeActive = residences.length ? Math.min(active, residences.length - 1) : 0;
  const r: Residence | undefined = residences[safeActive];

  return (
    <section id="residences" className="relative py-32 md:py-44 px-6 md:px-14 bg-onyx overflow-hidden">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <div className="mono text-[0.62rem] tracking-[0.5em] uppercase text-gold mb-6 flex items-center gap-3" data-reveal>
              <span className="w-10 h-px bg-gold" />
              <span>02 · Residences</span>
            </div>
            <h2 className="display text-5xl md:text-7xl leading-[0.92] text-bone" data-reveal>
              Three canonical<br />
              <em className="text-gold-grad">ways to arrive home.</em>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="max-w-sm text-parchment/60 leading-relaxed" data-reveal>
              Each residence is a self-contained proposition — a distinct answer to the question of how one might live, quietly, at the summit.
            </p>
            <div className="flex items-center gap-5">
              {source === "demo" && (
                <span className="mono text-[0.55rem] tracking-[0.32em] uppercase text-gold/60 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                  Demo data · Supabase not configured
                </span>
              )}
              <button
                data-cursor={compare ? "Close" : "Compare"}
                onClick={() => setCompare(!compare)}
                disabled={loading || residences.length === 0}
                className="mono text-[0.65rem] tracking-[0.32em] uppercase text-parchment/70 hover:text-gold transition-colors lux-link disabled:opacity-40 disabled:pointer-events-none"
              >
                {compare ? "Close Comparison" : "Compare All Units →"}
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------- Loading ------------------------------- */}
        {loading && (
          <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-stretch" aria-busy="true" aria-live="polite">
            <div className="md:col-span-7 aspect-[4/3] md:aspect-auto md:min-h-[600px] bg-ash/60 animate-pulse" />
            <div className="md:col-span-5 glass-strong p-8 md:p-10 flex flex-col gap-6">
              <div className="h-3 w-32 bg-ash/70 animate-pulse" />
              <div className="h-10 w-3/4 bg-ash/70 animate-pulse" />
              <div className="h-3 w-full bg-ash/60 animate-pulse" />
              <div className="h-3 w-5/6 bg-ash/60 animate-pulse" />
              <div className="mt-auto space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-8 border-b border-parchment/10 bg-ash/40 animate-pulse" />
                ))}
              </div>
            </div>
            <span className="sr-only">Loading residences…</span>
          </div>
        )}

        {/* -------------------------------- Error -------------------------------- */}
        {!loading && error && (
          <div className="glass-strong p-10 md:p-14 flex flex-col items-start gap-6" role="alert">
            <div className="mono text-[0.6rem] tracking-[0.4em] uppercase text-red-400/80">
              Unable to load
            </div>
            <p className="serif italic text-2xl text-bone max-w-lg">
              We could not retrieve the residences.
            </p>
            <p className="mono text-[0.62rem] tracking-[0.2em] text-parchment/50 max-w-xl break-words">
              {error}
            </p>
            <button data-cursor="Retry" onClick={refetch} className="btn-ghost text-[0.62rem] px-6 py-3">
              Try Again
            </button>
          </div>
        )}

        {/* -------------------------------- Empty -------------------------------- */}
        {!loading && !error && residences.length === 0 && (
          <div className="glass-strong p-10 md:p-14 flex flex-col items-start gap-6">
            <div className="mono text-[0.6rem] tracking-[0.4em] uppercase text-gold">
              Nothing published
            </div>
            <p className="serif italic text-2xl text-bone max-w-lg">
              No residences are available at this time.
            </p>
            <p className="text-parchment/60 text-sm max-w-md">
              Publish at least one row in <span className="mono text-gold/80">public.residences</span> with{" "}
              <span className="mono text-gold/80">is_published = true</span>, or run{" "}
              <span className="mono text-gold/80">supabase/seed.sql</span>.
            </p>
            <button data-cursor="Retry" onClick={refetch} className="btn-ghost text-[0.62rem] px-6 py-3">
              Refresh
            </button>
          </div>
        )}

        {/* -------------------------------- Loaded ------------------------------- */}
        {!loading && !error && residences.length > 0 && r && (
          <>
            {compare ? (
              <ComparisonTable residences={residences} />
            ) : (
              <>
                {/* Selector */}
                <div className="grid grid-cols-3 gap-4 md:gap-8 mb-14" data-reveal>
                  {residences.map((res, i) => (
                    <button
                      key={res.id}
                      data-cursor="Select"
                      onClick={() => setActive(i)}
                      className={`text-left border-t pt-6 pb-4 px-1 transition-all duration-700 group ${
                        safeActive === i
                          ? "border-gold text-bone"
                          : "border-parchment/15 text-parchment/50 hover:text-parchment/80 hover:border-parchment/40"
                      }`}
                    >
                      <div className="display text-4xl md:text-5xl mb-2 flex items-baseline gap-3">
                        <span className={safeActive === i ? "text-gold" : ""}>{res.n}</span>
                        <span className="mono text-[0.62rem] tracking-[0.3em] uppercase text-parchment/40">
                          Reserve
                        </span>
                      </div>
                      <div className="mono text-[0.66rem] tracking-[0.25em] uppercase">
                        {res.name}
                      </div>
                      <div className={`mt-2 h-px bg-gold transition-all duration-700 ${safeActive === i ? "w-full" : "w-0 group-hover:w-1/3"}`} />
                    </button>
                  ))}
                </div>

                {/* Active card */}
                <TiltCard>
                  <div key={r.id} className="grid md:grid-cols-12 gap-6 md:gap-10 items-stretch">
                    <div className="md:col-span-7 relative overflow-hidden gallery-item aspect-[4/3] md:aspect-auto md:min-h-[600px] glass-reflect">
                      <div
                        className="gimg absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${r.img})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-obsidian/40 via-transparent to-transparent" />

                      <div className="absolute top-6 left-6 mono text-[0.58rem] tracking-[0.4em] uppercase text-bone/80 glass px-4 py-2">
                        {r.collection}
                      </div>

                      <div className="absolute top-6 right-6 glass px-4 py-2 flex items-center gap-3">
                        <span className="live-dot" />
                        <span className="mono text-[0.58rem] tracking-[0.3em] uppercase text-parchment/80">
                          {r.availability} of {r.total} Available
                        </span>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-bone">
                        <div>
                          <div className="display text-3xl md:text-5xl leading-[0.95]">{r.name}</div>
                          <div className="mono text-[0.62rem] tracking-[0.35em] uppercase text-parchment/60 mt-2">
                            Reserve · {r.n}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="display text-3xl md:text-4xl text-gold-grad">
                            {r.size.toLocaleString()}
                          </div>
                          <div className="mono text-[0.58rem] tracking-[0.35em] uppercase text-parchment/60 mt-1">
                            sq ft · interior
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-5 glass-strong glass-reflect p-8 md:p-10 flex flex-col justify-between">
                      <div>
                        <div className="mono text-[0.6rem] tracking-[0.4em] uppercase text-gold mb-4">Specification</div>
                        <div className="display text-4xl text-bone leading-[0.95] mb-6">{r.beds}</div>
                        <p className="text-parchment/70 leading-relaxed mb-8 italic serif">{r.desc}</p>

                        <div className="space-y-2 mb-8">
                          {r.features.map((f, i) => (
                            <div
                              key={f}
                              className="flex items-center gap-4 py-2 border-b border-parchment/10 group"
                              data-reveal
                              style={{ ["--reveal-delay" as any]: `${i * 80}ms` }}
                            >
                              <span className="text-gold text-xs">◆</span>
                              <span className="text-sm tracking-wide text-parchment/80 flex-1">{f}</span>
                              <span className="mono text-[0.55rem] tracking-[0.3em] uppercase text-parchment/40 group-hover:text-gold transition-colors">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gold/20 pt-6">
                        <div className="mb-6">
                          <div className="mono text-[0.6rem] tracking-[0.4em] uppercase text-parchment/50 mb-2">Investment</div>
                          <div className="display text-2xl text-gold-grad italic">Price Available Upon Request</div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button data-cursor="Book" className="btn-gold text-[0.62rem] px-5 py-3">
                            Book Visit
                          </button>
                          <button data-cursor="Download" className="btn-ghost text-[0.62rem] px-5 py-3">
                            Download Brochure
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function ComparisonTable({ residences }: { residences: Residence[] }) {
  const rows = [
    { l: "Configuration", vals: residences.map((r) => r.beds) },
    { l: "Interior · sq ft", vals: residences.map((r) => r.size.toLocaleString()) },
    { l: "Collection", vals: residences.map((r) => r.collection) },
    { l: "Availability", vals: residences.map((r) => `${r.availability} / ${r.total}`) },
    { l: "Investment", vals: residences.map(() => "Upon Request") },
  ];

  return (
    <div className="glass-strong overflow-x-auto" data-reveal>
      <div className="min-w-[720px]">
        <div
          className="grid border-b border-gold/20"
          style={{ gridTemplateColumns: `220px repeat(${residences.length}, minmax(160px, 1fr))` }}
        >
          <div className="p-5 mono text-[0.6rem] tracking-[0.3em] uppercase text-parchment/50">
            Specification
          </div>
          {residences.map((r) => (
            <div key={r.id} className="p-5 border-l border-gold/10">
              <div className="display text-2xl text-gold">{r.n}</div>
              <div className="mono text-[0.6rem] tracking-[0.3em] uppercase text-bone mt-1">{r.name}</div>
            </div>
          ))}
        </div>

        {rows.map((row) => (
          <div
            key={row.l}
            className="grid border-b border-parchment/5 hover:bg-gold/5 transition-colors"
            style={{ gridTemplateColumns: `220px repeat(${residences.length}, minmax(160px, 1fr))` }}
          >
            <div className="p-5 mono text-[0.62rem] tracking-[0.28em] uppercase text-parchment/60">
              {row.l}
            </div>
            {row.vals.map((v, i) => (
              <div key={i} className="p-5 border-l border-parchment/5 serif text-bone italic text-sm md:text-base">
                {v}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
