import { useMemo } from "react";

export default function DustParticles() {
  const dust = useMemo(() =>
    Array.from({ length: 22 }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * -20,
      dur: 14 + Math.random() * 18,
      drift: (Math.random() - 0.5) * 200,
      size: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.5,
    })), []);

  return (
    <div className="dust fixed inset-0 z-[3] pointer-events-none" aria-hidden>
      {dust.map((d, i) => (
        <span
          key={i}
          style={{
            left: `${d.left}%`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.dur}s`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            ["--drift" as any]: `${d.drift}px`,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
}
