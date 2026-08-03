import { useEffect, useState } from "react";
import { useCountUp } from "../hooks";

const STATS = [
  { value: 38, suffix: "", label: "Private residences", note: "Above the 30th floor", spark: [18, 8, 22, 14, 20, 10, 16, 12] },
  { value: 72, suffix: "%", label: "Reserved", note: "Updated moments ago", spark: [14, 6, 18, 10, 16, 8, 14, 6] },
  { value: 62, suffix: "", label: "Floors above the sea", note: "Two sky lobbies", spark: [20, 12, 16, 8, 22, 14, 10, 6] },
  { value: 2028, suffix: "", label: "Handover", note: "On schedule", spark: [16, 10, 20, 12, 8, 18, 14, 10] },
];

function StatCard({ stat, index }) {
  const [val, ref] = useCountUp(stat.value, { duration: 1600 + index * 220 });

  return (
    <div className="live__card glass glass-reflect" data-reveal style={{ "--d": `${index * 110}ms` }}>
      <p className="live__value">
        <span ref={ref}>{val.toLocaleString("en-IN")}</span>
        <em>{stat.suffix}</em>
      </p>
      <p className="live__label">{stat.label}</p>
      <p className="live__note">{stat.note}</p>
      <span className="live__spark" aria-hidden>
        <svg viewBox="0 0 120 28" preserveAspectRatio="none">
          <path
            d={stat.spark
              .map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (stat.spark.length - 1)) * 120} ${26 - v}`)
              .join(" ")}
            fill="none"
            stroke="rgba(201,169,106,0.75)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>
  );
}

/**
 * Live status — glass stat cards, count-up, live pulse and a ticking
 * "updated N seconds ago" counter that makes the page feel inhabited.
 */
export default function LiveStatus() {
  const [tick, setTick] = useState(14);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t > 120 ? 3 : t + 1)), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="live" aria-label="Project status">
      <div className="wrap">
        <div className="live__grid">
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} index={i} />
          ))}
        </div>

        <div className="live__ticker" data-reveal style={{ "--d": "300ms" }}>
          <span className="live-chip">
            <span className="live-dot" aria-hidden /> Live
          </span>
          <p>
            Inventory &amp; pricing are current as of today · refreshed{" "}
            <span className="live__tick-num">{tick}s</span> ago
          </p>
        </div>
      </div>
    </section>
  );
}
