import { SITE } from "../data/site";
import { scrollToSection } from "../lib/lenis";

/**
 * Footer — brand, nav, contact placeholders, concept-demo disclaimer,
 * and a parallax watermark that slowly rises with the scroll.
 */
export default function Footer() {
  const go = (e, id) => {
    e.preventDefault();
    scrollToSection(`#${id}`, -10);
  };

  return (
    <footer className="footer">
      <div className="footer__inner wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <svg viewBox="0 0 64 64" fill="none" aria-hidden>
              <rect x="1.5" y="1.5" width="61" height="61" rx="13" stroke="rgba(201,169,106,0.5)" strokeWidth="1.5" />
              <path d="M17 47 32 13l15 34" stroke="#C9A96A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M23.5 37h17" stroke="#C9A96A" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div>
              <p className="footer__name">{SITE.brand}</p>
              <p className="footer__desc">{SITE.descriptor}</p>
            </div>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            {SITE.nav.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={(e) => go(e, l.id)}>{l.label}</a>
            ))}
          </nav>

          <div className="footer__contact">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a>
            <p>{SITE.address}</p>
          </div>
        </div>

        <div className="footer__social">
          {SITE.social.map((s) => (
            <a key={s.label} href={s.href} className="footer__social-link" data-cursor-label="Open">
              {s.label}
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                <path d="M3 9 9 3M4 3h5v5" />
              </svg>
            </a>
          ))}
        </div>

        <div className="footer__disclaimer" data-reveal>
          <p className="footer__disclaimer-title">Concept Demo</p>
          <p>
            This website is an independent portfolio project created by Irfan Khan.
            It is intended exclusively for demonstration purposes.
            It is not connected with any real developer, real estate project or
            commercial property.
          </p>
          <p className="footer__disclaimer-credit">Designed and Developed by Irfan Khan.</p>
        </div>

        <div className="footer__legal">
          <span>© 2026 Irfan Khan · Concept Demo</span>
          <span>
            {SITE.descriptor} · <a href="#about" onClick={(e) => go(e, "about")}>About this concept</a>
          </span>
        </div>
      </div>

      <p className="watermark" aria-hidden>
        AURELIA
        <span>RESERVE</span>
      </p>
    </footer>
  );
}
