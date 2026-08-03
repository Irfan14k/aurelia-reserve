import { FOCUS_AREAS } from "../data/concept";
import SectionHeading from "./SectionHeading";

/**
 * About This Concept — the portfolio statement. Cinematic storytelling,
 * premium motion design and modern frontend engineering, presented as
 * an independent concept demo.
 */
export default function AboutConcept() {
  return (
    <section id="about" className="about">
      <div className="wrap">
        <SectionHeading
          eyebrow="Portfolio · Concept Demo"
          title={<>About this <em>concept</em>.</>}
          meta="Aurelia Reserve · 2026"
        />

        <div className="ab-statement" data-reveal>
          <p className="ab-statement__lead">
            Aurelia Reserve explores how cinematic storytelling, premium motion
            design and modern frontend engineering can elevate the digital
            experience of luxury real estate.
          </p>
          <p className="ab-statement__sub">
            This concept was created independently as a frontend portfolio
            project — designed, engineered and shipped with the craft of a
            full studio.
          </p>
        </div>

        <div className="ab-focus">
          {FOCUS_AREAS.map((f, i) => (
            <article
              key={f.n}
              className="ab-goal hairline-card"
              data-reveal
              style={{ "--d": `${i * 90}ms` }}
              data-cursor="view"
            >
              <span className="ab-goal__n">{f.n}</span>
              <h4 className="ab-goal__title">{f.title}</h4>
              <p className="ab-goal__body">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
