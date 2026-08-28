import { useState } from "react";
import { site } from "../config/site";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo only — wire to a provider in src/lib/leads when a backend exists
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="relative bg-obsidian border-t border-gold/10 pt-20 pb-10 px-6 md:px-14 overflow-hidden">
      <div className="max-w-[1500px] mx-auto">
        <div className="mb-16 overflow-hidden" data-reveal="mask">
          <div className="display text-[19vw] md:text-[14vw] leading-[0.85] text-bone/90 tracking-[-0.02em] whitespace-nowrap">
            AURELIA<span className="italic text-gold-grad"> Reserve.</span>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <svg width="22" height="22" viewBox="0 0 40 40" className="text-gold">
                <path d="M20 3 L37 20 L20 37 L3 20 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="20" cy="20" r="2" fill="currentColor" />
              </svg>
              <div className="mono text-[0.62rem] tracking-[0.4em] uppercase text-parchment/70">
                Where Silence Meets Opulence
              </div>
            </div>
            <p className="text-parchment/50 text-sm leading-relaxed max-w-sm serif italic">
              A luxury real estate experience — imagined, designed and engineered as a demonstration of premium digital craft.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="mono text-[0.58rem] tracking-[0.4em] uppercase text-gold mb-4">Explore</div>
            <ul className="space-y-2 text-sm text-parchment/60">
              <li><a href="#story" data-cursor="Open" className="lux-link hover:text-gold transition-colors">The Story</a></li>
              <li><a href="#residences" data-cursor="Open" className="lux-link hover:text-gold transition-colors">Residences</a></li>
              <li><a href="#gallery" data-cursor="Open" className="lux-link hover:text-gold transition-colors">Gallery</a></li>
              <li><a href="#floorplan" data-cursor="Open" className="lux-link hover:text-gold transition-colors">Floor Plans</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="mono text-[0.58rem] tracking-[0.4em] uppercase text-gold mb-4">Reserve</div>
            <ul className="space-y-2 text-sm text-parchment/60">
              <li><a href="#amenities" data-cursor="Open" className="lux-link hover:text-gold transition-colors">Amenities</a></li>
              <li><a href="#location" data-cursor="Open" className="lux-link hover:text-gold transition-colors">Location</a></li>
              <li><a href="#contact" data-cursor="Book" className="lux-link hover:text-gold transition-colors">Enquire</a></li>
              <li><a href="#contact" data-cursor="Book" className="lux-link hover:text-gold transition-colors">Discovery Call</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="mono text-[0.58rem] tracking-[0.4em] uppercase text-gold mb-4">The Signal</div>
            <p className="text-sm text-parchment/60 mb-4 serif italic">
              A quarterly dispatch. Craft, atmosphere, quiet news.
            </p>
            {submitted ? (
              <div className="mono text-[0.6rem] tracking-[0.3em] uppercase text-gold py-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                You're on the list · Demo only
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border-b border-parchment/20 focus-within:border-gold transition-colors">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Email address"
                  className="flex-1 bg-transparent py-3 text-bone placeholder-parchment/30 outline-none text-sm"
                />
                <button
                  type="submit"
                  data-cursor="Subscribe"
                  className="mono text-gold text-[0.6rem] tracking-[0.3em] uppercase px-3 hover:text-gold-bright transition-colors"
                >
                  Subscribe →
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-parchment/10 pt-8">
          <div className="grid md:grid-cols-3 gap-8 items-start mb-10">
            <div>
              <div className="display text-xl text-bone">© 2026 Aurelia Reserve</div>
              <div className="mono text-parchment/50 text-[0.62rem] tracking-[0.28em] uppercase mt-1">
                Luxury Real Estate Experience
              </div>
              <div className="mono text-gold/70 text-[0.62rem] tracking-[0.28em] uppercase mt-1">
                Concept Demo
              </div>
            </div>

            <div>
              <div className="mono text-[0.58rem] tracking-[0.35em] uppercase text-parchment/40 mb-2">
                Designed &amp; Developed by
              </div>
              <div className="display text-2xl text-bone">Irfan Khan</div>
              <div className="mono text-[0.6rem] tracking-[0.28em] uppercase text-gold/70 mt-1">
                Portfolio Website
              </div>
            </div>

            <div className="flex md:justify-end flex-wrap gap-x-6 gap-y-2 mono text-[0.6rem] tracking-[0.3em] uppercase text-parchment/40 md:pt-2">
              {[
                { l: "Instagram", h: site.social.instagram },
                { l: "Behance", h: site.social.behance },
                { l: "Dribbble", h: site.social.dribbble },
                { l: "LinkedIn", h: site.social.linkedin },
              ].map((s) =>
                s.h ? (
                  <a
                    key={s.l}
                    href={s.h}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="Open"
                    className="lux-link hover:text-gold transition-colors"
                  >
                    {s.l}
                  </a>
                ) : (
                  <span key={s.l} title="Configure in src/config/site.ts" className="cursor-not-allowed">
                    {s.l}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="mono text-[0.62rem] leading-[1.9] text-parchment/40 max-w-4xl italic border-l-2 border-gold/30 pl-4">
            This website is an independent design and development concept by Irfan Khan, created for portfolio demonstration purposes. It is not affiliated with, endorsed by or associated with any real estate developer or project. All names, locations, imagery and property information shown are fictional.
          </div>
        </div>
      </div>
    </footer>
  );
}
