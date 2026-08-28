export default function LegalDisclaimer() {
  return (
    <section id="legal" className="relative py-20 md:py-28 px-6 md:px-14 bg-onyx overflow-hidden">
      <div className="max-w-[1500px] mx-auto">
        <div className="grid md:grid-cols-12 gap-8 md:gap-14 items-start">
          <div className="md:col-span-4">
            <div className="mono text-[0.62rem] tracking-[0.5em] uppercase text-gold mb-6 flex items-center gap-3" data-reveal>
              <span className="w-10 h-px bg-gold" />
              <span>Independent Concept</span>
            </div>
            <h2 className="display text-4xl md:text-5xl leading-[0.95] text-bone" data-reveal>
              <span className="block">A concept,</span>
              <em className="text-gold-grad block">not a project.</em>
            </h2>
            <div className="mt-6 flex items-center gap-3 mono text-[0.58rem] tracking-[0.35em] uppercase text-parchment/40" data-reveal style={{ ["--reveal-delay" as any]: "150ms" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-gold">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Fictional · Portfolio Only</span>
            </div>
          </div>

          <div className="md:col-span-7 md:col-start-6 space-y-5 border-l-2 border-gold/30 pl-6 md:pl-8">
            <p className="serif italic text-lg md:text-xl leading-[1.6] text-bone/90" data-reveal>
              This website is an independent design and development concept created solely for portfolio and demonstration purposes.
            </p>
            <p className="text-parchment/60 leading-[1.9]" data-reveal style={{ ["--reveal-delay" as any]: "120ms" }}>
              It is not affiliated with, endorsed by, sponsored by or associated with any real estate developer, project, company or trademark.
            </p>
            <p className="text-parchment/60 leading-[1.9]" data-reveal style={{ ["--reveal-delay" as any]: "240ms" }}>
              All names, branding, locations, pricing, specifications and property information presented throughout this experience are fictional and created exclusively for demonstration purposes.
            </p>

            <div className="pt-6 flex flex-wrap gap-x-8 gap-y-2 mono text-[0.58rem] tracking-[0.32em] uppercase text-parchment/40" data-reveal style={{ ["--reveal-delay" as any]: "360ms" }}>
              <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gold" /> No Real Developer</span>
              <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gold" /> No Real Locations</span>
              <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gold" /> No Real Pricing</span>
              <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gold" /> Fictional Brand</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
