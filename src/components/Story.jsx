import { useRef, useEffect } from "react";
import { SITE } from "../data/site";
import { splitText } from "../lib/splitText";
import { useParallax } from "../hooks";
import SectionHeading from "./SectionHeading";

/**
 * The Story — sticky masked image with parallax on one side,
 * masked editorial typography on the other, then a slow marquee.
 */
export default function Story() {
  const statementRef = useRef(null);
  const imageWrapRef = useRef(null);
  const imageRef = useParallax(0.1);

  useEffect(() => {
    const el = statementRef.current;
    if (!el) return;
    splitText(el, { type: "words" });
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-split");
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="story" className="story">
      <div className="wrap">
        <SectionHeading
          eyebrow="01 · The Story"
          title={<>A quieter kind of <em>luxury</em>.</>}
          meta="Concept · 2026"
        />

        <div className="story__grid">
          <div className="story__media" data-reveal="mask" style={{ "--d": "120ms" }}>
            <div className="story__frame" ref={imageWrapRef} aria-hidden />
            <div className="story__image" ref={imageRef}>
              <img
                src="/images/opt/story.jpg"
                alt="The sky lobby lounge at dusk, warm light over the sea"
                width={1228}
                height={768}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="story__caption" data-reveal style={{ "--d": "480ms" }}>
              <span>Sky lobby · Level 61</span>
              <span>—</span>
              <span>Dusk</span>
            </div>
          </div>

          <div className="story__text">
            <p className="story__statement" ref={statementRef}>
              Most towers compete for the skyline. AURELIA was designed
              to disappear into it — <em>warm stone, dark glass, and the sea
              doing the talking.</em>
            </p>

            <div className="story__prose" data-reveal style={{ "--d": "200ms" }}>
              <p>
                Thirty-eight residences, no two alike. Every home is placed by
                hand to read the light — the morning on the living room, the
                evening on the terrace, the monsoon rolling in from the west
                like a curtain.
              </p>
              <p>
                Materials were chosen the way a tailor chooses cloth: travertine
                from a single quarry, walnut from managed forests, brass that
                will outlive the people who polished it. Nothing is laminated.
                Nothing is pretending.
              </p>
            </div>

            <div className="story__facts" data-reveal style={{ "--d": "320ms" }}>
              <div className="story__fact">
                <span className="story__fact-num">100%</span>
                <span className="story__fact-label">Sea-facing living rooms</span>
              </div>
              <div className="story__fact">
                <span className="story__fact-num">2</span>
                <span className="story__fact-label">Sky lobbies above 60</span>
              </div>
              <div className="story__fact">
                <span className="story__fact-num">0</span>
                <span className="story__fact-label">Identical homes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ——— Slow marquee ——— */}
      <div className="story__marquee marquee" aria-hidden>
        <div className="marquee__track">
          {[...SITE.marquee, ...SITE.marquee].map((m, i) => (
            <span className="marquee__item" key={i}>{m}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
