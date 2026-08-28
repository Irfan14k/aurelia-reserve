import { useEffect, useState } from "react";

const stack = [
  "React 19",
  "TypeScript",
  "Vite",
  "Tailwind CSS v4",
  "Supabase",
  "CSS Motion System",
  "Intersection Observer",
];

export default function TechBadge() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed left-4 bottom-4 md:left-6 md:bottom-6 z-[55] hidden md:block"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 900ms cubic-bezier(0.65,0.05,0.15,1), transform 900ms cubic-bezier(0.65,0.05,0.15,1)",
      }}
    >
      <button
        data-cursor={open ? "Close" : "Stack"}
        onClick={() => setOpen((o) => !o)}
        className="glass-strong border-gold/20 rounded-full pl-3 pr-4 py-2 flex items-center gap-2.5 hover:border-gold/50 transition-colors group"
        aria-expanded={open}
        aria-label="Toggle tech stack"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-gold">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        <span className="mono text-[0.55rem] tracking-[0.35em] uppercase text-bone">Built With</span>
        <span
          className="text-gold text-[0.6rem] transition-transform duration-500"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>

      <div
        className="mt-3 origin-bottom-left"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(8px) scale(0.96)",
          filter: open ? "blur(0)" : "blur(4px)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 500ms cubic-bezier(0.65,0.05,0.15,1), transform 500ms cubic-bezier(0.65,0.05,0.15,1), filter 500ms",
        }}
      >
        <div className="glass-strong border-gold/20 rounded-2xl p-4 min-w-[220px]">
          <div className="mono text-[0.55rem] tracking-[0.35em] uppercase text-gold/70 mb-3 pb-3 border-b border-gold/10">
            Technology Stack
          </div>
          <ul className="flex flex-col gap-1.5">
            {stack.map((t, i) => (
              <li
                key={t}
                className="flex items-center gap-3 mono text-[0.65rem] tracking-[0.18em] uppercase text-parchment/70"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(-6px)",
                  transition: `opacity 400ms ${80 * i + 100}ms cubic-bezier(0.65,0.05,0.15,1), transform 400ms ${80 * i + 100}ms cubic-bezier(0.65,0.05,0.15,1)`,
                }}
              >
                <span className="w-1 h-1 rounded-full bg-gold" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-gold/10 mono text-[0.5rem] tracking-[0.35em] uppercase text-parchment/40">
            Concept · Irfan Khan
          </div>
        </div>
      </div>
    </div>
  );
}
