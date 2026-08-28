import { smoothScrollTo } from "../hooks";

export default function AboutConcept() {
  const pillars = [
    { n: "01", t: "Cinematic Storytelling", d: "Video-first hero, dual-crossfade playback, and layered ambient depth compose a brand film in the browser." },
    { n: "02", t: "Motion Design System", d: "Every reveal, cursor, easing curve and micro-interaction is orchestrated on a single luxury motion language." },
    { n: "03", t: "Premium UI", d: "Glassmorphism, gold gradients, film grain and typographic restraint articulate quiet, high-end atmosphere." },
    { n: "04", t: "Frontend Engineering", d: "Type-safe React with custom smooth-scroll, intersection reveals, magnetic cursor and video choreography." },
  ];

  return (
    <section id="about-concept" className="relative py-32 md:py-44 px-6 md:px-14 bg-obsidian overflow-hidden">
      <div className="absolute -top-40 left-1/3 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl pointer-events-none" aria-hidden />

      <div className="max-w-[1500px] mx-auto relative">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start mb-20">
          <div className="md:col-span-5">
            <div className="mono text-[0.62rem] tracking-[0.5em] uppercase text-gold mb-6 flex items-center gap-3" data-reveal>
              <span className="w-10 h-px bg-gold" />
              <span>08 · About This Experience</span>
            </div>
            <h2 className="display text-5xl md:text-6xl leading-[0.92] text-bone" data-reveal>
              <span className="block">A study in</span>
              <em className="text-gold-grad block">luxury digital craft.</em>
            </h2>
          </div>

          <div className="md:col-span-6 md:col-start-7 space-y-6">
            <p className="serif italic text-xl md:text-2xl leading-[1.5] text-bone/90" data-reveal>
              This concept explores how cinematic storytelling, motion design, premium UI and modern frontend engineering can elevate luxury real estate marketing.
            </p>
            <p className="text-parchment/60 leading-[1.9] max-w-lg" data-reveal style={{ ["--reveal-delay" as any]: "150ms" }}>
              It serves as a portfolio demonstration of design thinking, frontend development and digital brand experience — a deliberate exercise in how far restraint, atmosphere and precision can be taken on the web.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 md:gap-6">
          {pillars.map((p, i) => (
            <div
              key={p.n}
              data-reveal
              style={{ ["--reveal-delay" as any]: `${i * 100}ms` }}
              className="glass glass-reflect p-6 md:p-7 border border-gold/10 relative group hover:border-gold/30 transition-colors duration-700"
            >
              <div className="mono text-[0.55rem] tracking-[0.4em] uppercase text-gold mb-8">
                {p.n}
              </div>
              <h3 className="display text-2xl text-bone mb-3 leading-tight">{p.t}</h3>
              <p className="text-sm text-parchment/60 leading-relaxed">{p.d}</p>
              <div className="absolute bottom-0 left-0 h-px bg-gold w-0 group-hover:w-full transition-all duration-1000" />
            </div>
          ))}
        </div>

        {/* Author card */}
        <div className="mt-20 grid md:grid-cols-12 gap-10 items-center" data-reveal>
          <div className="md:col-span-7 glass-strong p-8 md:p-10">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-deep flex items-center justify-center flex-shrink-0">
                <span className="display text-2xl text-obsidian">IK</span>
              </div>
              <div>
                <div className="mono text-[0.58rem] tracking-[0.4em] uppercase text-gold mb-2">
                  Independent Design Concept
                </div>
                <div className="display text-3xl text-bone mb-1">Created by Irfan Khan</div>
                <div className="mono text-[0.62rem] tracking-[0.28em] uppercase text-parchment/50">
                  UI/UX · Motion Design · Frontend Development
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-5 flex md:justify-end">
            <a
              href="#contact"
              data-cursor="Contact"
              className="btn-gold"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo("contact");
              }}
            >
              <span>Let's Collaborate</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
