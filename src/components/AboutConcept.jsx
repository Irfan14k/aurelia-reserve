import { useEffect, useRef, useState } from "react";
import { GOALS, PILLARS, TOKENS, MOTION_PRINCIPLES, TECH, METRICS, BUNDLE, TIMELINE } from "../data/concept";
import { useCountUp } from "../hooks";
import SectionHeading from "./SectionHeading";

function MetricBar({ metric, index }) {
  const [val, ref] = useCountUp(metric.value, { duration: 1700 + index * 150 });
  return (
    <div className="ab-metric" data-reveal style={{ "--d": `${index * 110}ms` }}>
      <div className="ab-metric__row">
        <span className="ab-metric__label">{metric.label}</span>
        <span className="ab-metric__value">
          <span ref={ref}>{Math.round(val)}</span>
        </span>
      </div>
      <div className="ab-metric__track" aria-hidden>
        <i style={{ transform: `scaleX(${val / 100})` }} />
      </div>
      <p className="ab-metric__note">{metric.note}</p>
    </div>
  );
}

function TimelineRow({ item, index, lineRef }) {
  const rowRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) io.disconnect();
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`ab-tl__row${active ? " is-active" : ""}`} ref={rowRef} data-reveal style={{ "--d": "80ms" }}>
      <span className="ab-tl__phase">{item.phase}</span>
      <div className="ab-tl__line" aria-hidden><i /></div>
      <div className="ab-tl__body">
        <h4>{item.title}</h4>
        <p className="ab-tl__when">{item.when}</p>
        <p className="ab-tl__text">{item.body}</p>
        <div className="ab-tl__tags">
          {item.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

/**
 * About this concept — the portfolio section: goals, direction,
 * the design system as live tokens, motion principles (with the
 * actual easing curve drawn), stack, performance and the build timeline.
 */
export default function AboutConcept() {
  const [scrollP, setScrollP] = useState(0);
  const tlRef = useRef(null);

  useEffect(() => {
    const el = tlRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, -r.top / total));
      setScrollP(p);
      raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) raf = requestAnimationFrame(update);
      else cancelAnimationFrame(raf);
    }, { rootMargin: "200px 0px" });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="about" className="about">
      <div className="wrap">
        <SectionHeading
          eyebrow="Portfolio · About This Concept"
          title={<>The website <em>explains itself</em>.</>}
          meta="Concept case study · 2026"
        />

        {/* ——— Goals ——— */}
        <div className="ab-block">
          <p className="ab-block__kicker" data-reveal>Project Goals</p>
          <div className="ab-goals">
            {GOALS.map((g, i) => (
              <article key={g.n} className="ab-goal hairline-card" data-reveal style={{ "--d": `${i * 110}ms` }} data-cursor="view">
                <span className="ab-goal__n">{g.n}</span>
                <h4 className="ab-goal__title">{g.title}</h4>
                <p className="ab-goal__body">{g.body}</p>
              </article>
            ))}
          </div>
        </div>

        {/* ——— Creative direction ——— */}
        <div className="ab-block">
          <p className="ab-block__kicker" data-reveal>Creative Direction</p>
          <div className="ab-pillars">
            {PILLARS.map((p, i) => (
              <div key={p.n} className="ab-pillar" data-reveal style={{ "--d": `${i * 100}ms` }}>
                <span className="ab-pillar__n">{p.n}</span>
                <h4>{p.title}</h4>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ——— Design system (live tokens) ——— */}
        <div className="ab-block">
          <p className="ab-block__kicker" data-reveal>Design System</p>
          <div className="ab-tokens" data-reveal style={{ "--d": "120ms" }}>
            {TOKENS.map((t) => (
              <div key={`${t.kind}-${t.name}`} className="ab-token glass glass-reflect">
                {t.kind === "color" && <span className="ab-token__swatch" style={{ background: t.swatch }} aria-hidden />}
                {t.kind === "type" && <span className="ab-token__sample ab-token__sample--serif">{t.sample}</span>}
                {t.kind === "motion" && t.sample === "curve" && (
                  <svg className="ab-token__curve" viewBox="0 0 64 40" fill="none" aria-hidden>
                    <path d="M2 38 C 8 38, 12 3, 62 2" stroke="#C9A96A" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="62" cy="2" r="2.5" fill="#E6CD94" />
                  </svg>
                )}
                {t.kind === "motion" && t.sample !== "curve" && <span className="ab-token__sample">{t.sample}</span>}
                {t.kind === "space" && (
                  <span className="ab-token__sample ab-token__sample--grid" aria-hidden>
                    {Array.from({ length: 6 }).map((_, i) => <i key={i} />)}
                  </span>
                )}
                {t.kind === "glass" && <span className="ab-token__sample ab-token__sample--glass">Aa</span>}
                {t.kind === "grain" && <span className="ab-token__sample ab-token__sample--grain" aria-hidden />}
                <p className="ab-token__name">{t.name}</p>
                <p className="ab-token__note">{t.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ——— Motion principles ——— */}
        <div className="ab-block">
          <p className="ab-block__kicker" data-reveal>Motion Principles</p>
          <div className="ab-motion">
            <div className="ab-curve glass hairline-card" data-reveal="mask">
              <svg viewBox="0 0 300 180" fill="none" aria-hidden>
                <rect x="0.5" y="0.5" width="299" height="179" stroke="rgba(244,241,234,0.08)" />
                <path d="M20 160 H280 M20 160 V20" stroke="rgba(244,241,234,0.2)" strokeWidth="1" strokeDasharray="3 5" />
                <path d="M20 160 C 20 160, 90 22, 280 22" stroke="#C9A96A" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M20 160 l -6 0 M280 22 l 0 -6" stroke="rgba(244,241,234,0.4)" strokeWidth="1" />
                <text x="30" y="176" fill="rgba(244,241,234,0.4)" fontSize="10" letterSpacing="2">0</text>
                <text x="262" y="176" fill="rgba(244,241,234,0.4)" fontSize="10" letterSpacing="2">1</text>
              </svg>
              <p className="ab-curve__label">The only curve in the house</p>
              <code className="ab-curve__code">cubic-bezier(0.16, 1, 0.3, 1)</code>
            </div>
            <div className="ab-motion__list">
              {MOTION_PRINCIPLES.map((m, i) => (
                <div key={m.title} className="ab-motion__item" data-reveal style={{ "--d": `${i * 100}ms` }}>
                  <h4>{m.title}</h4>
                  <p>{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ——— Technology ——— */}
        <div className="ab-block">
          <p className="ab-block__kicker" data-reveal>Technology Stack</p>
          <div className="ab-tech">
            {TECH.map((t, i) => (
              <div key={t.name} className="ab-tech__item glass" data-reveal style={{ "--d": `${i * 70}ms` }}>
                <p className="ab-tech__name">{t.name}</p>
                <p className="ab-tech__role">{t.role}</p>
                <p className="ab-tech__note">{t.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ——— Performance ——— */}
        <div className="ab-block">
          <p className="ab-block__kicker" data-reveal>Performance Metrics</p>
          <div className="ab-perf">
            <div className="ab-perf__metrics">
              {METRICS.map((m, i) => <MetricBar key={m.label} metric={m} index={i} />)}
            </div>
            <div className="ab-perf__bundle glass hairline-card" data-reveal style={{ "--d": "200ms" }}>
              <p className="ab-perf__bundle-title">Budget, not balloon</p>
              {BUNDLE.map((b) => (
                <div key={b.label} className="ab-perf__row">
                  <span>{b.label}</span>
                  <strong>{b.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ——— Development timeline ——— */}
        <div className="ab-block" ref={tlRef}>
          <p className="ab-block__kicker" data-reveal>Development Timeline</p>
          <div className="ab-tl">
            <div className="ab-tl__progress" aria-hidden>
              <i style={{ transform: `scaleY(${scrollP})` }} />
            </div>
            {TIMELINE.map((item, i) => (
              <TimelineRow key={item.phase} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
