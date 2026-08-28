import { useEffect, useState } from "react";

export default function PortfolioBadge() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed bottom-4 left-4 z-[55] pointer-events-none md:bottom-auto md:left-auto md:top-6 md:right-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-12px)",
        transition: "opacity 900ms cubic-bezier(0.65,0.05,0.15,1), transform 900ms cubic-bezier(0.65,0.05,0.15,1)",
      }}
      aria-hidden
    >
      <div className="glass-strong px-3 py-2 rounded-full flex items-center gap-2.5 border-gold/30">
        <span className="relative flex items-center justify-center w-4 h-4">
          <span className="absolute inset-0 rounded-full bg-gold/40 animate-ping" />
          <span className="relative w-1.5 h-1.5 rounded-full bg-gold" />
        </span>
        <div className="flex flex-col leading-none gap-0.5 pr-1">
          <span className="mono text-[0.55rem] tracking-[0.35em] uppercase text-bone">Concept Demo</span>
          <span className="mono text-[0.5rem] tracking-[0.32em] uppercase text-gold/70">Portfolio Project</span>
        </div>
      </div>
    </div>
  );
}
