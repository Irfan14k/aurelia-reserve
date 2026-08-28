export default function Preloader({ progress, done }: { progress: number; done: boolean }) {
  const letters = "AURELIA RESERVE".split("");
  const circ = 2 * Math.PI * 54;
  const offset = circ - (progress / 100) * circ;

  return (
    <div className={`preloader ${done ? "done" : ""}`} aria-hidden={done}>
      <div className="preloader__stage">
        <div className="preloader__ring" aria-label={`Loading ${progress}%`}>
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(244,237,224,0.08)" strokeWidth="1" />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#loadg)"
              strokeWidth="1"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 250ms cubic-bezier(0.65,0.05,0.15,1)" }}
            />
            <defs>
              <linearGradient id="loadg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#e6c47f" />
                <stop offset="1" stopColor="#8a6d33" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="34" height="34" viewBox="0 0 40 40" className="text-gold">
              <path d="M20 3 L37 20 L20 37 L3 20 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <path d="M20 11 L29 20 L20 29 L11 20 Z" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
              <circle cx="20" cy="20" r="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div className="preloader__mark" aria-label="Aurelia Reserve">
          {letters.map((ch, i) => (
            <span key={i} style={{ animationDelay: `${i * 55 + 200}ms` }}>
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="preloader__pct">{String(progress).padStart(3, "0")}%</div>
          <div className="w-px h-4 bg-gold/30" />
          <div className="preloader__meta">Curating the experience</div>
        </div>
      </div>
    </div>
  );
}
