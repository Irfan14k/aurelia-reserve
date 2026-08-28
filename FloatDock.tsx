import { smoothScrollTo } from "../hooks";
import { site, telHref, waHref } from "../config/site";

export default function FloatDock({ progress, visible }: { progress: number; visible: boolean }) {
  const circ = 2 * Math.PI * 20;
  const offset = circ - progress * circ;

  const call = telHref(site.contact.phone);
  const wa = waHref(site.contact.whatsapp, "Hello — I'd like to know more about Aurelia Reserve.");

  return (
    <div className={`float-dock ${visible ? "visible" : ""}`} aria-hidden={!visible}>
      <a
        href={call ?? "#contact"}
        data-cursor="Call"
        onClick={(e) => { if (!call) { e.preventDefault(); smoothScrollTo("contact"); } }}
        className="dock-btn"
        aria-label={call ? "Call us" : "Scroll to enquiry form"}
      >
        <span className="dock-btn__tip">{call ? "Call" : "Enquire"}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>
        </svg>
      </a>

      <a
        href={wa ?? "#contact"}
        target={wa ? "_blank" : undefined}
        rel={wa ? "noopener noreferrer" : undefined}
        data-cursor="Chat"
        onClick={(e) => { if (!wa) { e.preventDefault(); smoothScrollTo("contact"); } }}
        className="dock-btn"
        aria-label={wa ? "Chat on WhatsApp" : "Scroll to enquiry form"}
      >
        <span className="dock-btn__tip">{wa ? "WhatsApp" : "Enquire"}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M21 12a9 9 0 0 1-13.5 7.79L3 21l1.27-4.5A9 9 0 1 1 21 12z"/>
        </svg>
      </a>

      <a href="#contact" data-cursor="Download" onClick={(e) => { e.preventDefault(); smoothScrollTo("contact"); }} className="dock-btn">
        <span className="dock-btn__tip">Brochure</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </a>

      <a href="#contact" data-cursor="Book" onClick={(e) => { e.preventDefault(); smoothScrollTo("contact"); }} className="dock-btn">
        <span className="dock-btn__tip">Book Visit</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </a>

      <button data-cursor="Top" onClick={() => smoothScrollTo("hero")} className="dock-btn dock-progress" aria-label="Back to top">
        <svg viewBox="0 0 46 46">
          <circle cx="23" cy="23" r="20" fill="none" stroke="rgba(244,237,224,0.1)" strokeWidth="1" />
          <circle
            cx="23" cy="23" r="20" fill="none"
            stroke="#c9a35a" strokeWidth="1" strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 150ms linear" }}
          />
        </svg>
        <svg className="absolute inset-0 m-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </div>
  );
}
