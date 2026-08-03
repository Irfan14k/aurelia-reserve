import { useEffect, useState } from "react";
import { CASE_CHAPTERS } from "../data/caseStudy";
import { BEHIND } from "../data/concept";
import { useCaseStudy } from "../context/CaseStudyContext";
import { useCountUp } from "../hooks";
import { getLenis } from "../lib/lenis";

function DeckStat({ stat, index }) {
  const [val, ref] = useCountUp(stat.value, { duration: 1600 + index * 120 });
  return (
    <div className="cs-stat" data-reveal style={{ "--d": `${index * 90}ms` }}>
      <p className="cs-stat__num">
        <span ref={ref}>{Math.round(val).toLocaleString("en-IN")}</span>
        <em>{stat.suffix}</em>
      </p>
      <p className="cs-stat__label">{stat.label}</p>
    </div>
  );
}

function PerfBar({ metric, index }) {
  const [val, ref] = useCountUp(metric.value, { duration: 1600 + index * 140 });
  return (
    <div className="cs-perf__bar" data-reveal style={{ "--d": `${index * 100}ms` }}>
      <span className="cs-perf__label">{metric.label}</span>
      <span className="cs-perf__track" aria-hidden>
        <i style={{ transform: `scaleX(${val / 100})` }} />
      </span>
      <span className="cs-perf__val"><span ref={ref}>{Math.round(val)}</span></span>
    </div>
  );
}

function ChapterBody({ chapter }) {
  const { setMode } = useCaseStudy();

  switch (chapter.id) {
    case "overview":
      return (
        <div className="cs-stats">
          {chapter.stats.map((s, i) => <DeckStat key={s.label} stat={s} index={i} />)}
        </div>
      );
    case "research":
      return (
        <ul className="cs-points">
          {chapter.points.map((p, i) => (
            <li key={i} data-reveal style={{ "--d": `${i * 90}ms` }}>
              <span className="cs-points__n">{String(i + 1).padStart(2, "0")}</span>
              <p>{p}</p>
            </li>
          ))}
        </ul>
      );
    case "ux":
      return (
        <div className="cs-frames">
          {chapter.frames.map((f, i) => (
            <div key={f.title} className="cs-frame" data-reveal style={{ "--d": `${i * 100}ms` }}>
              <svg viewBox="0 0 320 220" fill="none" aria-hidden className="cs-frame__sketch">
                <rect x="8" y="8" width="304" height="204" stroke="rgba(201,169,106,0.35)" strokeWidth="1.2" strokeDasharray="4 4" />
                <rect x="24" y="24" width="150" height="90" stroke="rgba(244,241,234,0.25)" strokeWidth="1.2" />
                <rect x="190" y="24" width="110" height="90" stroke="rgba(244,241,234,0.25)" strokeWidth="1.2" />
                <line x1="24" y1="130" x2="300" y2="130" stroke="rgba(244,241,234,0.25)" strokeWidth="1.2" />
                <rect x="24" y="146" width="276" height="58" stroke="rgba(244,241,234,0.25)" strokeWidth="1.2" />
                <rect x="60" y="160" width="90" height="30" fill="rgba(201,169,106,0.2)" stroke="rgba(201,169,106,0.6)" strokeWidth="1" />
                <rect x="166" y="160" width="110" height="30" stroke="rgba(244,241,234,0.3)" strokeWidth="1" />
                <circle cx="290" cy="60" r="14" stroke="rgba(244,241,234,0.3)" strokeWidth="1" />
              </svg>
              <p className="cs-frame__title">{f.title}</p>
              <p className="cs-frame__note">{f.note}</p>
            </div>
          ))}
        </div>
      );
    case "moodboard":
      return (
        <div className="cs-mood">
          {chapter.images.map((img, i) => (
            <figure key={img.src} className="cs-mood__item" data-reveal="mask" style={{ "--d": `${i * 110}ms` }}>
              <img src={img.src} alt={img.note} loading="lazy" decoding="async" width={1376} height={768} />
              <figcaption>{img.note}</figcaption>
            </figure>
          ))}
        </div>
      );
    case "system":
      return (
        <ul className="cs-points">
          {chapter.points.map((p, i) => (
            <li key={i} data-reveal style={{ "--d": `${i * 90}ms` }}>
              <span className="cs-points__n">{String(i + 1).padStart(2, "0")}</span>
              <p>{p}</p>
            </li>
          ))}
        </ul>
      );
    case "development":
      return (
        <ul className="cs-points">
          {chapter.points.map((p, i) => (
            <li key={i} data-reveal style={{ "--d": `${i * 90}ms` }}>
              <span className="cs-points__n">{String(i + 1).padStart(2, "0")}</span>
              <p>{p}</p>
            </li>
          ))}
        </ul>
      );
    case "performance":
      return (
        <>
          <div className="cs-perf">
            {chapter.metrics.map((m, i) => (
              <PerfBar key={m.label} metric={m} index={i} />
            ))}
          </div>
          <ul className="cs-points cs-points--compact">
            {chapter.techniques.map((t, i) => (
              <li key={i} data-reveal style={{ "--d": `${i * 70}ms` }}>
                <span className="cs-points__n">◆</span>
                <p>{t}</p>
              </li>
            ))}
          </ul>
        </>
      );
    case "outcome":
      return (
        <>
          <div className="cs-stats">
            {chapter.stats.map((s, i) => <DeckStat key={s.label} stat={s} index={i} />)}
          </div>
          <div className="cs-outcome-cta" data-reveal style={{ "--d": "240ms" }}>
            <button className="btn-lux" onClick={() => setMode("website")}>
              <span className="btn-lux__sheen" aria-hidden />
              Return to the residence
            </button>
          </div>
        </>
      );
    default:
      return null;
  }
}

function useActiveChapter() {
  const [active, setActive] = useState(CASE_CHAPTERS[0].id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.dataset.chapter));
      },
      { rootMargin: "-38% 0px -55% 0px" }
    );
    document.querySelectorAll("[data-chapter]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

/**
 * Case Study — the making-of deck. Renders in place of the marketing
 * sections when the toggle is flipped; chapters have their own rail.
 */
export default function CaseStudyDeck() {
  const { setMode } = useCaseStudy();
  const active = useActiveChapter();

  return (
    <main className="cs-deck">
      {/* deck header */}
      <header className="cs-hero" id="cs-overview" data-chapter="overview">
        <div className="wrap">
          <p className="eyebrow" data-reveal>Case Study · AURELIA Residences</p>
          <h1 className="cs-hero__title" data-reveal style={{ "--d": "140ms" }}>
            How a residence became <em>a feeling.</em>
          </h1>
          <p className="cs-hero__lede lede" data-reveal style={{ "--d": "280ms" }}>
            Concept · Research · Wireframes · Moodboard · Design System · Development ·
            Performance · Outcome — the whole story, in the site's own voice.
          </p>
          <div className="cs-hero__meta" data-reveal style={{ "--d": "400ms" }}>
            <span>Studio Aurelia</span><i aria-hidden /><span>2026</span><i aria-hidden /><span>10-day build</span>
          </div>
        </div>
      </header>

      {/* chapter rail */}
      <nav className="cs-rail" aria-label="Case study chapters">
        {CASE_CHAPTERS.map((c) => (
          <button
            key={c.id}
            className={`cs-rail__item${active === c.id ? " is-active" : ""}`}
            onClick={() => {
              const lenis = getLenis();
              if (lenis) lenis.scrollTo(`#cs-${c.id}`, { offset: -70, duration: 1.4 });
              else document.getElementById(`cs-${c.id}`)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>{c.n}</span>
            {c.title}
          </button>
        ))}
      </nav>

      {CASE_CHAPTERS.map((chapter, i) => (
        <section
          key={chapter.id}
          id={`cs-${chapter.id}`}
          data-chapter={chapter.id}
          className={`cs-chapter cs-chapter--${chapter.id}`}
        >
          <div className="wrap">
            <p className="cs-chapter__num" data-reveal>{chapter.n} / 08</p>
            <h2 className="cs-chapter__title" data-reveal style={{ "--d": "100ms" }}>{chapter.title}</h2>
            <p className="cs-chapter__lede lede" data-reveal style={{ "--d": "200ms" }}>{chapter.body}</p>
            <ChapterBody chapter={chapter} />
          </div>
          {i < CASE_CHAPTERS.length - 1 && <div className="sec-divider wrap" aria-hidden />}
        </section>
      ))}

      {/* behind-the-experience timeline inside the deck */}
      <section id="cs-behind" data-chapter="behind" className="cs-chapter cs-chapter--behind">
        <div className="wrap">
          <p className="cs-chapter__num" data-reveal>+ / 08</p>
          <h2 className="cs-chapter__title" data-reveal style={{ "--d": "100ms" }}>
            Behind the experience
          </h2>
          <p className="cs-chapter__lede lede" data-reveal style={{ "--d": "200ms" }}>
            The full process timeline — research through optimisation.
          </p>
          <div className="cs-behind-list">
            {BEHIND.map((item) => (
              <article key={item.phase} className="cs-behind-item" data-reveal style={{ "--d": "60ms" }}>
                <span className="cs-behind-item__phase">{item.phase}</span>
                <div className="cs-behind-item__body">
                  <h3>{item.title} <small>{item.when}</small></h3>
                  <p>{item.body}</p>
                  <div className="cs-behind-item__tags">
                    {item.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="cs-outro">
        <div className="wrap">
          <p className="cs-outro__mark" aria-hidden>A</p>
          <h2 data-reveal="mask">Built like the building it sells.</h2>
          <p className="lede" data-reveal style={{ "--d": "160ms" }}>
            Restraint as a feature. Motion with a pulse. A performance budget
            that survived every indulgence. This is what a luxury website looks
            like when the brief is the building.
          </p>
          <div className="cs-outro__actions" data-reveal style={{ "--d": "280ms" }}>
            <button className="btn-lux" onClick={() => setMode("website")}>
              <span className="btn-lux__sheen" aria-hidden />
              Back to the experience
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
