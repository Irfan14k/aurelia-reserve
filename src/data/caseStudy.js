/**
 * Case-study deck content — the making-of told in the site's own voice.
 */
export const CASE_CHAPTERS = [
  {
    id: "overview",
    n: "01",
    title: "Overview",
    body: "AURELIA is a concept experience for a fictional luxury residence — built to prove that a real-estate microsite can feel like a brand film. One scroll, eight chapters, one toggle from website to case study.",
    stats: [
      { value: 98, suffix: "", label: "Lighthouse performance" },
      { value: 92, suffix: " KB", label: "Initial JS (gzip)" },
      { value: 0, suffix: "", label: "Third-party requests" },
      { value: 10, suffix: " days", label: "Concept to ship" },
    ],
  },
  {
    id: "research",
    n: "02",
    title: "Research",
    body: "Before a single pixel, five audits and twenty interviews. The brief that came out of it: a CEO should feel the building, not read about it — light, material, silence. Everything else is noise.",
    points: [
      "All five audited sites used template 'hero → features → gallery' flows with stock photography.",
      "Buyers' emotional memory centres on atmosphere (light, view, quiet) — not on specs.",
      "Decision-makers skim for three things: price, availability, and 'who answers the phone'.",
      "Motion was either absent (cheap) or gratuitous (cheaper). No one had a motion language.",
    ],
  },
  {
    id: "ux",
    n: "03",
    title: "UX & wireframes",
    body: "A single chapter flow — preloader, arrival, story, residences, plans, amenities, gallery, location, contact — with the case study folded in as a parallel layer, not a separate site.",
    frames: [
      { title: "Hero arrival", note: "Video · split serif · glass price" },
      { title: "Residences", note: "Tilt cards · compare mode" },
      { title: "Floor plan", note: "Zoom · rooms · ventilation" },
      { title: "Case study", note: "Deck · timeline · metrics" },
    ],
  },
  {
    id: "moodboard",
    n: "04",
    title: "Moodboard",
    body: "Three words pinned to the wall: Resort, Editorial, Archives. Warm stone and champagne light; keynote pacing; editorial typography. Everything on the site traces back to one of the three.",
    images: [
      { src: "/images/opt/hero-2.jpg", note: "Resort — water, stone, light" },
      { src: "/images/opt/amenity-wellness.jpg", note: "Warmth — travertine glow" },
      { src: "/images/opt/residence-3.jpg", note: "Archives — walnut and brass" },
      { src: "/images/opt/gallery-facade.jpg", note: "Night — the tower as lantern" },
    ],
  },
  {
    id: "system",
    n: "05",
    title: "Design system",
    body: "Twelve tokens run the entire experience — six colours, two typefaces, one easing curve, glass, grain, and rhythm. No component in the site may style itself; everything is inherited.",
    points: [
      "Colour: ink, surface, champagne, gold-light, ivory — and one rare ember for sunset.",
      "Type: Fraunces (variable, optical sizing) for chapters; Inter for the quiet utility.",
      "Motion: cubic-bezier(0.16, 1, 0.3, 1) everywhere. One curve, applied with restraint.",
      "Texture: film grain at 5%, glass at blur(18px), hairline borders over solid ones.",
    ],
  },
  {
    id: "development",
    n: "06",
    title: "Development & architecture",
    body: "React 18 on Vite, Lenis for scroll, and a hand-rolled motion engine — reveal, cursor, parallax, tilt, count-up — built on IntersectionObserver and requestAnimationFrame. No animation library. No CSS framework.",
    points: [
      "Token-first CSS custom properties; components are behaviour, not style.",
      "Below-fold sections are IO-triggered dynamic imports — the DOM stays light.",
      "A single global easing curve, GPU transforms only, IO-gated rAF loops.",
      "Dual-video hero at 700 kbps; every image ≤ 215 KB; zero third-party requests.",
    ],
  },
  {
    id: "performance",
    n: "07",
    title: "Performance",
    body: "Lighthouse is a feature. The experience targets 95+ on every category and ships a film-like first paint under 1.6 s on mid-range hardware.",
    metrics: [
      { label: "Performance", value: 98 },
      { label: "Accessibility", value: 100 },
      { label: "Best Practices", value: 100 },
      { label: "SEO", value: 100 },
    ],
    techniques: [
      "LCP: poster preload + 700 kbps hero film",
      "Code-split lazy sections via IntersectionObserver",
      "content-visibility for off-screen chapters",
      "Fonts: variable, display=swap, preconnected",
      "Canvas dust pauses when off-screen or tab-hidden",
      "prefers-reduced-motion: one quiet frame",
    ],
  },
  {
    id: "outcome",
    n: "08",
    title: "Final outcome",
    body: "A residence that feels like a film, a portfolio that explains itself, and a performance budget that survived every visual indulgence. This is what a luxury website looks like when the brief is the building.",
    stats: [
      { value: 19, suffix: "", label: "Components, all preserved" },
      { value: 12, suffix: "", label: "Motion tokens" },
      { value: 26, suffix: "", label: "Optimised assets" },
      { value: 1, suffix: "", label: "Easing curve" },
    ],
  },
];
