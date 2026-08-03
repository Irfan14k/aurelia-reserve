import { useEffect, useRef } from "react";
import { splitText } from "../lib/splitText";

/**
 * Editorial section heading — eyebrow, masked serif title with word
 * stagger, optional meta. Every chapter speaks the same typographic voice.
 */
export default function SectionHeading({ eyebrow, title, meta, align = "left" }) {
  const titleRef = useRef(null);
  const revealRef = useRef(null);

  useEffect(() => {
    const t = titleRef.current;
    if (!t) return;
    splitText(t, { type: "words" });
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          t.classList.add("is-split");
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(t);
    return () => io.disconnect();
  }, [title]);

  return (
    <header
      className={`sec-head ${align === "center" ? "sec-head--center" : ""}`}
      ref={revealRef}
    >
      <div className="sec-head__row">
        <div>
          {eyebrow && (
            <p className="eyebrow" data-reveal>{eyebrow}</p>
          )}
          <h2
            ref={titleRef}
            className="sec-head__title"
            style={{ marginTop: eyebrow ? "22px" : 0 }}
          >
            {title}
          </h2>
        </div>
        {meta && <p className="sec-head__meta" data-reveal style={{ "--d": "180ms" }}>{meta}</p>}
      </div>
    </header>
  );
}
