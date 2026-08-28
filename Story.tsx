export default function Story() {
  return (
    <section id="story" className="relative py-32 md:py-52 px-6 md:px-14 bg-obsidian overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl pointer-events-none" aria-hidden />
      <div className="light-rays" aria-hidden />

      <div className="max-w-[1500px] mx-auto relative">
        <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-start">
          <div className="md:col-span-4">
            <div className="sticky top-32">
              <div className="mono text-[0.62rem] tracking-[0.5em] uppercase text-gold mb-8 flex items-center gap-3" data-reveal>
                <span className="w-10 h-px bg-gold" />
                <span>01 · Chapter One</span>
              </div>
              <h2 className="display text-[3.2rem] md:text-[4.5rem] leading-[0.9] text-bone">
                <span className="line-mask block"><span data-reveal>A world</span></span>
                <span className="line-mask block"><span data-reveal style={{ ["--reveal-delay" as any]: "150ms" }}>composed</span></span>
                <span className="line-mask block italic text-gold-grad"><span data-reveal style={{ ["--reveal-delay" as any]: "300ms" }}>in whispers.</span></span>
              </h2>
              <div className="mt-8 mono text-[0.62rem] tracking-[0.35em] uppercase text-parchment/40" data-reveal style={{ ["--reveal-delay" as any]: "500ms" }}>
                MMXXVI · Portfolio Concept
              </div>
            </div>
          </div>

          <div className="md:col-span-7 md:col-start-6 space-y-10">
            <p className="serif text-2xl md:text-[1.9rem] leading-[1.4] text-bone/90 font-light italic" data-reveal>
              Aurelia Reserve is a fictional luxury residential concept — a study in how architecture, atmosphere and digital storytelling converge into a single, immersive act.
            </p>
            <p className="text-parchment/60 leading-[1.95] max-w-lg" data-reveal style={{ ["--reveal-delay" as any]: "150ms" }}>
              Every arch, every corridor of light, every measured pause between rooms — designed to communicate calm, elegance and timeless luxury. Here, the currency is not scale. It is silence, considered.
            </p>
            <p className="text-parchment/60 leading-[1.95] max-w-lg" data-reveal style={{ ["--reveal-delay" as any]: "300ms" }}>
              This portfolio project reimagines the language of premium real estate — motion as material, texture as narrative, restraint as the loudest statement possible.
            </p>

            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8" data-reveal style={{ ["--reveal-delay" as any]: "500ms" }}>
              {[
                { n: "12", l: "Curated Residences" },
                { n: "34", l: "Acres of Reserve" },
                { n: "07", l: "Signature Amenities" },
                { n: "∞", l: "Moments of Stillness" },
              ].map((s) => (
                <div key={s.l} className="border-l border-gold/30 pl-4">
                  <div className="display text-4xl text-gold-grad">{s.n}</div>
                  <div className="mono text-[0.58rem] tracking-[0.32em] uppercase text-parchment/50 mt-3">{s.l}</div>
                </div>
              ))}
            </div>

            <div className="pt-6" data-reveal style={{ ["--reveal-delay" as any]: "700ms" }}>
              <blockquote className="serif italic text-lg text-parchment/70 border-l-2 border-gold/40 pl-6 max-w-md">
                "We were not designing rooms. We were designing hours of a life."
                <footer className="mono not-italic text-[0.62rem] tracking-[0.35em] uppercase text-gold/70 mt-3">— The Atelier, Concept Notes</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="mt-32 border-t border-b border-gold/10 py-8 overflow-hidden">
        <div className="marquee whitespace-nowrap display text-3xl md:text-5xl text-bone/40 italic">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-16 items-center flex-shrink-0">
              <span>Silence</span><span className="text-gold">✦</span>
              <span>Opulence</span><span className="text-gold">✦</span>
              <span>Light</span><span className="text-gold">✦</span>
              <span>Stillness</span><span className="text-gold">✦</span>
              <span>Reserve</span><span className="text-gold">✦</span>
              <span>Sanctuary</span><span className="text-gold">✦</span>
              <span>Atelier</span><span className="text-gold">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
