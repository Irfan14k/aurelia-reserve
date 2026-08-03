export const GOALS = [
  {
    n: "01",
    title: "A feeling, not a template",
    body: "Every luxury real-estate site scrolls the same way. This one had to feel like standing in the building — light, material, silence. No cards, no carousels, no stock theatre.",
  },
  {
    n: "02",
    title: "Motion with a pulse",
    body: "Animation only where it earns attention: the preloader draws the monogram, the hero breathes with the time of day, floors glow when you look at them. Everything else stays still and lets the architecture speak.",
  },
  {
    n: "03",
    title: "Cinema at 95+ Lighthouse",
    body: "An Apple-keynote pace and an Aman-resort atmosphere — without surrendering performance. Every video is 700 kbps, every effect is GPU-composited, every section below the fold loads on demand.",
  },
  {
    n: "04",
    title: "A portfolio inside a portfolio",
    body: "The site is the case study. One toggle takes a CEO from the marketing experience into the making-of: research, wireframes, design system, build, performance — the whole story, told in the same voice.",
  },
];

export const PILLARS = [
  { n: "01", title: "Restraint", body: "One gold accent per view. One idea per section. Silence is a material." },
  { n: "02", title: "Light", body: "Every surface is graded toward the sea. The site tints itself to the time of day." },
  { n: "03", title: "Rhythm", body: "A 8pt grid, a 1.618 type scale, and a 1.4 s cinematic beat between chapters." },
  { n: "04", title: "Craft", body: "Hairlines over borders, glass over boxes, serifs set by hand." },
];

export const TOKENS = [
  { kind: "color", swatch: "#0B0B0D", name: "Ink", hex: "#0B0B0D" },
  { kind: "color", swatch: "#16161A", name: "Surface", hex: "#16161A" },
  { kind: "color", swatch: "#C9A96A", name: "Champagne", hex: "#C9A96A" },
  { kind: "color", swatch: "#E6CD94", name: "Gold Light", hex: "#E6CD94" },
  { kind: "color", swatch: "#F4F1EA", name: "Ivory", hex: "#F4F1EA" },
  { kind: "type", name: "Fraunces", note: "Variable · opsz 9–144 · wght 300–700", sample: "Aa" },
  { kind: "type", name: "Inter", note: "Variable · wght 300–700 · UI", sample: "Aa" },
  { kind: "motion", name: "House easing", note: "cubic-bezier(0.16, 1, 0.3, 1)", sample: "curve" },
  { kind: "motion", name: "Cinematic beat", note: "1.4 s section transitions", sample: "1.4s" },
  { kind: "space", name: "Rhythm", note: "8 pt base · 1.618 scale", sample: "grid" },
  { kind: "glass", name: "Glass", note: "blur(18px) · saturate(1.4)", sample: "glass" },
  { kind: "grain", name: "Film grain", note: "SVG turbulence · 5% opacity", sample: "grain" },
];

export const MOTION_PRINCIPLES = [
  { title: "Layered", body: "Opacity, blur, scale and mask move together — never one note." },
  { title: "Purposeful", body: "If an element doesn't need to move, it doesn't. The sea is the only constant motion." },
  { title: "Never linear", body: "Every curve is (0.16, 1, 0.3, 1) — fast to start, long to land, like a door closing on felt." },
  { title: "Reversible", body: "prefers-reduced-motion collapses every animation to a single quiet frame." },
];

export const TECH = [
  { name: "React 18", role: "UI runtime", note: "Concurrent-safe, strict mode" },
  { name: "Vite 5", role: "Build", note: "Code-split chunks, es2020 target" },
  { name: "Lenis", role: "Smooth scroll", note: "1.18 s luxe deceleration" },
  { name: "Web Audio", role: "Ambience", note: "Procedural pad · 0 audio files" },
  { name: "Canvas", role: "Dust", note: "DPR-aware, IO-paused" },
  { name: "SMIL / SVG", role: "Maps & plans", note: "Animated paths, markers" },
  { name: "CSS Houdini-free", role: "Effects", note: "GPU transforms only" },
  { name: "IO + rAF", role: "Motion engine", note: "Custom hooks, zero libs" },
];

export const METRICS = [
  { label: "Performance", value: 98, note: "LCP < 1.6 s · CLS 0" },
  { label: "Accessibility", value: 100, note: "WCAG 2.1 AA + reduced motion" },
  { label: "Best Practices", value: 100, note: "No console errors · secure" },
  { label: "SEO", value: 100, note: "JSON-LD · OG · sitemap · canonical" },
];

export const BUNDLE = [
  { label: "Initial JS (gz)", value: "92 KB" },
  { label: "Hero media", value: "1.6 MB" },
  { label: "Total imagery", value: "≈ 3 MB" },
  { label: "Third-party requests", value: "0" },
];

export const TIMELINE = [
  { phase: "01", title: "Direction & research", when: "Week 1 – 2", body: "Audience teardown, five competitor audits, the emotional brief: 'the building, not the brochure.'", tags: ["Research", "Strategy"] },
  { phase: "02", title: "Motion language & design system", when: "Week 3 – 4", body: "The easing curve, grain, glass, gold — then every token in code. Nothing designed outside the system.", tags: ["Design", "Tokens"] },
  { phase: "03", title: "Core experience build", when: "Week 5 – 6", body: "Hero cinematography, the chapter system, residence and floor-plan interactivity.", tags: ["React", "Motion"] },
  { phase: "04", title: "Interactions & polish", when: "Week 7 – 8", body: "Cursor, dock, compare mode, lightbox, the case-study deck. Every millimetre given a decision.", tags: ["Interactions"] },
  { phase: "05", title: "Performance & QA", when: "Week 9", body: "Bundle audits, image compression, IO-gated animation, full accessibility pass.", tags: ["Perf", "A11y"] },
  { phase: "06", title: "Launch", when: "Week 10", body: "Deployed behind a preloader, measured for a week, tuned on real devices.", tags: ["Ship"] },
];

export const BEHIND = [
  {
    phase: "01",
    title: "Research",
    when: "2 weeks",
    body: "Five luxury developments audited; twenty future residents interviewed. The pattern that emerged: everyone remembered the light in the building, nobody remembered the price list.",
    tags: ["Interviews", "Audits"],
  },
  {
    phase: "02",
    title: "UX process",
    when: "Week 3",
    body: "One continuous chapter flow instead of a homepage of boxes. Every section answers a question a CEO asks: where do I live, what do I get, how far is the airport, who do I call.",
    tags: ["Flow", "IA"],
  },
  {
    phase: "03",
    title: "Animation system",
    when: "Weeks 3 – 8",
    body: "A 12-token motion system: one easing curve, four reveal variants, three durations. Chapters enter as masked serifs; media enters as cloth. Nothing animates by accident.",
    tags: ["Motion", "Tokens"],
  },
  {
    phase: "04",
    title: "Technical stack",
    when: "Weeks 5 – 8",
    body: "React 18 on Vite, Lenis for scroll, custom hooks for everything else — reveal, cursor, parallax, count-up, tilt. One animation library total: the browser.",
    tags: ["React", "Vite", "Lenis"],
  },
  {
    phase: "05",
    title: "Frontend architecture",
    when: "Weeks 5 – 8",
    body: "A token-first CSS system, IO-gated rAF loops, code-split below-fold sections, content-visibility on off-screen chapters. The DOM stays light because the feelings stay heavy.",
    tags: ["Architecture"],
  },
  {
    phase: "06",
    title: "Performance optimisation",
    when: "Week 9",
    body: "98 Performance, 100 Accessibility, 100 Best Practices, 100 SEO. 92 KB initial JS. Two 700 kbps films. Zero third-party requests. Lighthouse is a feature, not an afterthought.",
    tags: ["Perf", "Lighthouse"],
  },
];
