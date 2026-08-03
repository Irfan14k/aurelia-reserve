import { useMemo, useRef, useState } from "react";
import { RESIDENCES, COMPARE_META, COMPARE_DATA } from "../data/residences";
import { fmtCrore, fmtArea } from "../lib/format";
import { useCountUp, useMagnetic } from "../hooks";
import { scrollToSection } from "../lib/lenis";
import SectionHeading from "./SectionHeading";
import LuxModal from "./LuxModal";

/**
 * Residence cards — 3D tilt with a light-glare that follows the pointer,
 * hover expand, price count-up, availability chip, floor-plan jump,
 * and a two-up compare mode with a glass modal.
 */

function TiltCard({ res, index, onCompare, compared }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [expanded, setExpanded] = useState(false);
  const [price, priceRef] = useCountUp(res.price, { duration: 1500, start: 0 });
  const bookRef = useMagnetic(0.2);

  const onMove = (e) => {
    const r = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - py) * 7, ry: (px - 0.5) * 9 });
    if (glareRef.current)
      glareRef.current.style.background = `radial-gradient(560px circle at ${px * 100}% ${py * 100}%, rgba(230,205,148,0.14), transparent 45%)`;
  };

  const onLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    if (glareRef.current) glareRef.current.style.background = "transparent";
  };

  return (
    <article
      ref={cardRef}
      className={`res-card${expanded ? " is-expanded" : ""}${compared ? " is-compared" : ""}`}
      style={{ transform: `perspective(1200px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg)`, "--d": `${index * 130}ms` }}
      data-reveal
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="view"
    >
      <div className="res-card__glare" ref={glareRef} aria-hidden />

      <div className="res-card__media" onClick={() => setExpanded(!expanded)}>
        <img
          src={res.image}
          alt={`${res.name} — ${res.beds}, ${fmtArea(res.area)}`}
          width={1376}
          height={768}
          loading="lazy"
          decoding="async"
        />
        <div className="res-card__shade" aria-hidden />
        <span className={`res-card__avail ${res.remaining <= 3 ? "is-low" : ""}`}>
          {res.remaining} {res.remaining === 1 ? "home" : "homes"} left
        </span>
        <span className="res-card__tag">{res.tag}</span>
      </div>

      <div className="res-card__body">
        <div className="res-card__head">
          <h3 className="res-card__name">{res.name}</h3>
          <button
            className={`res-card__compare${compared ? " is-on" : ""}`}
            onClick={() => onCompare(res.id)}
            aria-pressed={compared}
            aria-label={`Compare ${res.name}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
              {compared ? <path d="m5 13 4 4L19 7" /> : <path d="M12 5v14M5 12h14" />}
            </svg>
          </button>
        </div>

        <div className="res-card__specs">
          <span>{res.beds}</span>
          <i aria-hidden />
          <span>{fmtArea(res.area)}</span>
          <i aria-hidden />
          <span>Sea-facing</span>
        </div>

        <div className="res-card__price">
          <span className="res-card__price-label">Indicative from</span>
          <p className="res-card__price-num">
            <span ref={priceRef}>₹ {price.toFixed(1)}</span> Cr
          </p>
        </div>

        <div className={`res-card__expand${expanded ? " is-open" : ""}`}>
          <p>{res.blurb}</p>
          <ul className="res-card__features">
            {res.features.map((f) => (
              <li key={f}>
                <span aria-hidden>◆</span> {f}
              </li>
            ))}
          </ul>
          <div className="res-card__actions">
            <button
              ref={bookRef}
              className="btn-lux"
              data-cursor-label="Book"
              onClick={() => scrollToSection("#contact", -10)}
            >
              <span className="btn-lux__sheen" aria-hidden />
              Enquire
            </button>
            <button className="btn-ghost" data-cursor-label="View" onClick={() => scrollToSection("#floorplan", -10)}>
              View floor plan
            </button>
          </div>
        </div>

        <button className="res-card__toggle" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
          {expanded ? "Close" : "Explore residence"}
          <span className={`res-card__toggle-arrow${expanded ? " is-flip" : ""}`} aria-hidden>↓</span>
        </button>
      </div>
    </article>
  );
}

export default function Residences() {
  const [compare, setCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggleCompare = (id) => {
    setCompare((c) => {
      if (c.includes(id)) return c.filter((x) => x !== id);
      if (c.length >= 2) return [c[1], id];
      return [...c, id];
    });
  };

  const compareRes = useMemo(
    () => RESIDENCES.filter((r) => compare.includes(r.id)),
    [compare]
  );

  return (
    <section id="residences" className="residences">
      <div className="wrap">
        <SectionHeading
          eyebrow="02 · Residences"
          title={<>Three ways to live <em>above the sea</em>.</>}
          meta="38 homes · 3 collections"
        />

        <div className="residences__grid">
          {RESIDENCES.map((res, i) => (
            <TiltCard key={res.id} res={res} index={i} onCompare={toggleCompare} compared={compare.includes(res.id)} />
          ))}
        </div>

        <p className="residences__hint" data-reveal style={{ "--d": "200ms" }}>
          <span aria-hidden>◇</span> Select up to two residences to compare — hover a card to tilt it into the light.
        </p>
      </div>

      {/* ——— Sticky compare bar ——— */}
      <div className={`compare-bar glass-strong${compare.length ? " is-visible" : ""}`} role="region" aria-label="Compare residences">
        <div className="compare-bar__chips">
          {compareRes.map((r) => (
            <span key={r.id} className="compare-bar__chip">
              {r.name}
              <button onClick={() => toggleCompare(r.id)} aria-label={`Remove ${r.name}`}>×</button>
            </span>
          ))}
          {compare.length === 0 && <span className="compare-bar__empty">Pick two residences to compare</span>}
        </div>
        <button
          className="compare-bar__btn"
          disabled={compare.length < 2}
          onClick={() => compare.length === 2 && setShowCompare(true)}
        >
          Compare {compare.length}/2
        </button>
      </div>

      {/* ——— Compare modal ——— */}
      <LuxModal open={showCompare} onClose={() => setShowCompare(false)} labelledBy="compare-title">
        <div className="compare">
          <button className="lux-modal__close" onClick={() => setShowCompare(false)} aria-label="Close comparison">
            <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              <path d="m3 3 10 10M13 3 3 13" />
            </svg>
          </button>
          <h3 id="compare-title" className="compare__title">Side by side</h3>
          <p className="compare__sub">The same light, three interpretations.</p>

          <div className="compare__grid">
            {compareRes.map((r) => (
              <div key={r.id} className="compare__col">
                <img src={r.image} alt={r.name} width={1376} height={768} loading="lazy" decoding="async" />
                <p className="compare__name">{r.name}</p>
                <table className="compare__table">
                  <tbody>
                    {COMPARE_META.map((m) => {
                      const a = COMPARE_DATA[compareRes[0].id];
                      const b = COMPARE_DATA[r.id];
                      const va = m.kind === "area" ? fmtArea(a[m.key]) : m.kind === "price" ? fmtCrore(a[m.key]) : a[m.key];
                      const vb = m.kind === "area" ? fmtArea(b[m.key]) : m.kind === "price" ? fmtCrore(b[m.key]) : b[m.key];
                      const diff = va !== vb;
                      return (
                        <tr key={m.key} className={diff ? "is-diff" : ""}>
                          <th>{m.label}</th>
                          <td>{vb}{diff && <span className="compare__diff" title="Differs from the other selection">◆</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div className="compare__foot">
            <button className="btn-lux" onClick={() => { setShowCompare(false); scrollToSection("#contact", -10); }}>
              <span className="btn-lux__sheen" aria-hidden />
              Book a viewing
            </button>
          </div>
        </div>
      </LuxModal>
    </section>
  );
}
