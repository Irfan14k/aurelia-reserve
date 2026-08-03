import { useEffect, useRef, useState } from "react";
import { BEHIND } from "../data/concept";
import SectionHeading from "./SectionHeading";

function BehindRow({ item, index }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) io.disconnect();
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article className={`bh-row${active ? " is-active" : ""}`} ref={ref} data-reveal style={{ "--d": "60ms" }}>
      <div className="bh-row__rail">
        <span className="bh-row__phase">{item.phase}</span>
        <span className="bh-row__node" aria-hidden />
        <span className="bh-row__line" aria-hidden />
      </div>
      <div className="bh-row__body">
        <div className="bh-row__head">
          <h3>{item.title}</h3>
          <span className="bh-row__when">{item.when}</span>
        </div>
        <p className="bh-row__text">{item.body}</p>
        <div className="bh-row__tags">
          {item.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
    </article>
  );
}

/**
 * Behind the Experience — the making-of as a timeline chapter:
 * research, UX, animation system, stack, architecture, performance.
 */
export default function BehindExperience() {
  return (
    <section id="behind" className="behind">
      <div className="wrap">
        <SectionHeading
          eyebrow="08 · Behind the Experience"
          title={<>How the feeling <em>was built</em>.</>}
          meta="Six phases · ten weeks"
        />

        <div className="bh-note" data-reveal style={{ "--d": "150ms" }}>
          <p>
            Every luxury site claims craft. This one keeps the receipts —
            the process that produced the page you're scrolling, told in the
            same voice as the site itself.
          </p>
        </div>

        <div className="bh-list">
          {BEHIND.map((item, i) => (
            <BehindRow key={item.phase} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
