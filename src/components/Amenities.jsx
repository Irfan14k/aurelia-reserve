import { useEffect, useRef, useState } from "react";
import { AMENITIES } from "../data/amenities";
import { useCountUp } from "../hooks";
import SectionHeading from "./SectionHeading";

const ICONS = {
  wellness: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M24 42c0-12 6-20 18-20 0 12-6 20-18 20Z" />
      <path d="M24 42C24 26 16 16 4 16c0 14 8 24 20 26Z" opacity="0.7" />
      <path d="M24 8v6M18 12l2 5M30 12l-2 5" opacity="0.9" />
    </svg>
  ),
  culinary: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 6v14a6 6 0 0 0 12 0V6M20 6v36" />
      <path d="M36 6c-3 8-4 14-2 20l2 16M36 6c3 8 4 14 2 20" opacity="0.85" />
    </svg>
  ),
  leisure: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
      <path d="M6 18c4-3 8-3 12 0s8 3 12 0 8-3 12 0M6 28c4-3 8-3 12 0s8 3 12 0 8-3 12 0" />
      <path d="M6 38c4-3 8-3 12 0s8 3 12 0 8-3 12 0" opacity="0.6" />
    </svg>
  ),
  concierge: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 20a16 16 0 0 1 32 0v4H8v-4Z" />
      <path d="M8 24v6h32v-6M20 34c0 3 2 4 4 4s4-1 4-4" opacity="0.85" />
      <path d="M18 30h12" opacity="0.5" />
    </svg>
  ),
};

function FeatureCount({ feature, index }) {
  const [val, ref] = useCountUp(feature.value, { duration: 1400 + index * 150 });
  return (
    <div className="amen__count">
      <p className="amen__count-num">
        <span ref={ref}>{val.toLocaleString("en-IN")}</span>
        <em>{feature.suffix}</em>
      </p>
      <p className="amen__count-label">{feature.label}</p>
    </div>
  );
}

function CountRow({ features, index }) {
  return (
    <div className="amen__counts">
      {features.map((f, i) => (
        <FeatureCount key={f.label} feature={f} index={index + i} />
      ))}
    </div>
  );
}

/**
 * Amenities — each category changes the environment: the background
 * film crossfades with a clip reveal, icons float, counters count up.
 */
export default function Amenities() {
  const [activeId, setActiveId] = useState(AMENITIES[0].id);
  const active = AMENITIES.find((a) => a.id === activeId);
  const lastRef = useRef(null);

  useEffect(() => {
    // re-trigger reveal of inner content on category change
    const el = lastRef.current;
    if (!el) return;
    el.querySelectorAll("[data-reveal]").forEach((node) => {
      node.classList.remove("is-revealed");
      requestAnimationFrame(() => node.classList.add("is-revealed"));
    });
  }, [activeId]);

  return (
    <section id="amenities" className="amenities">
      <div className="wrap">
        <SectionHeading
          eyebrow="04 · Amenities"
          title={<>Four worlds, <em>one tower</em>.</>}
          meta="Levels 58 – 62"
        />
      </div>

      <div className="amen__stage" key={active.id}>
        {/* environment background */}
        <div className="amen__bg" aria-hidden>
          <img src={active.image} alt="" loading="lazy" decoding="async" width={1376} height={768} />
          <div className="amen__bg-shade" />
        </div>

        <div className="wrap">
          <div className="amen__tabs" role="tablist" aria-label="Amenity worlds" data-reveal>
            {AMENITIES.map((a, i) => (
              <button
                key={a.id}
                role="tab"
                aria-selected={activeId === a.id}
                className={`amen__tab${activeId === a.id ? " is-active" : ""}`}
                style={{ "--d": `${i * 90}ms` }}
                onClick={() => setActiveId(a.id)}
                data-cursor-label="Open"
              >
                <span className={`amen__tab-icon float-soft`} style={{ animationDelay: `${i * 0.7}s` }}>
                  {ICONS[a.id]}
                </span>
                <span>{a.category}</span>
              </button>
            ))}
          </div>

          <div className="amen__content" ref={lastRef}>
            <h3 className="amen__name" data-reveal="mask" style={{ "--d": "120ms" }}>
              {active.name}
            </h3>
            <p className="amen__lede lede" data-reveal style={{ "--d": "240ms" }}>
              {active.lede}
            </p>

            <div data-reveal style={{ "--d": "360ms" }}>
              <CountRow features={active.features} index={AMENITIES.indexOf(active)} />
            </div>

            <ul className="amen__notes" data-reveal style={{ "--d": "460ms" }}>
              {active.notes.map((n) => (
                <li key={n}><span aria-hidden>◆</span> {n}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
