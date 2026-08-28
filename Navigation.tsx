import { useEffect, useState } from "react";
import { smoothScrollTo, useNavVisibility } from "../hooks";
import AccountMenu from "./AccountMenu";

const links = [
  { id: "story", label: "Story" },
  { id: "residences", label: "Residences" },
  { id: "floorplan", label: "Floor Plans" },
  { id: "amenities", label: "Amenities" },
  { id: "gallery", label: "Gallery" },
  { id: "location", label: "Location" },
];

export default function Navigation({ active }: { active: string }) {
  const { visible, scrolled } = useNavVisibility();
  const [open, setOpen] = useState(false);

  // Close on Escape and lock page scroll while the drawer is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("is-locked");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
    };
  }, [open]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
        style={{
          transform: visible ? "translateY(0)" : "translateY(-120%)",
          transitionTimingFunction: "cubic-bezier(0.65,0.05,0.15,1)",
        }}
      >
        <div className={`mx-auto flex items-center justify-between transition-all duration-700 ${
          scrolled ? "max-w-6xl mt-4 px-6 py-3 rounded-full glass" : "max-w-[1600px] mt-6 px-8 md:px-12 py-4"
        }`}>
          <button
            data-cursor="Home"
            onClick={() => smoothScrollTo("hero")}
            className="flex items-center gap-3 group"
            aria-label="Aurelia Reserve — home"
          >
            <svg width="22" height="22" viewBox="0 0 40 40" className="text-gold group-hover:rotate-[135deg] transition-transform duration-1000">
              <path d="M20 3 L37 20 L20 37 L3 20 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M20 11 L29 20 L20 29 L11 20 Z" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
              <circle cx="20" cy="20" r="1.6" fill="currentColor" />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="display text-lg tracking-[0.25em] text-bone">AURELIA</span>
              <span className="mono text-[0.55rem] tracking-[0.42em] text-gold/70 mt-0.5">RESERVE</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => {
              const isActive = active === l.id;
              return (
                <button
                  key={l.id}
                  data-cursor="Explore"
                  onClick={() => smoothScrollTo(l.id)}
                  className={`mono text-[0.68rem] tracking-[0.32em] uppercase transition-colors duration-500 lux-link ${
                    isActive ? "text-gold" : "text-parchment/60 hover:text-bone"
                  }`}
                >
                  {l.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <AccountMenu />
            <button
              data-cursor="Book"
              onClick={() => smoothScrollTo("contact")}
              className="inline-flex items-center gap-2 mono text-[0.66rem] tracking-[0.3em] uppercase text-bone border-b border-gold/40 pb-1 hover:border-gold hover:text-gold transition-all"
            >
              Book Discovery
              <span className="text-gold">→</span>
            </button>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="lg:hidden flex flex-col gap-1.5 p-1 -mr-1"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className="w-6 h-px bg-bone" />
            <span className="w-4 h-px bg-bone ml-auto" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] transition-all duration-700 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-3xl" onClick={() => setOpen(false)} />
        <div className={`relative h-full flex flex-col justify-center items-center gap-6 transition-all duration-700 ${
          open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-parchment text-3xl"
            aria-label="Close menu"
          >
            ×
          </button>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => { setOpen(false); setTimeout(() => smoothScrollTo(l.id), 100); }}
              className="display text-5xl text-bone hover:text-gold transition-colors"
            >
              {l.label}
            </button>
          ))}
          <AccountMenu variant="drawer" />
        </div>
      </div>
    </>
  );
}
