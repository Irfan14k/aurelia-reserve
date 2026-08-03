/**
 * Concept content — About This Concept focus areas and the
 * Behind the Experience process timeline. All fictional.
 */
export const FOCUS_AREAS = [
  {
    n: "01",
    title: "Storytelling",
    body: "A single scroll told like a film — chapters, masked reveals and a narrative arc from arrival to handover.",
  },
  {
    n: "02",
    title: "Luxury UX",
    body: "Every decision tuned for calm — one easing curve, generous rhythm, and nothing that shouts.",
  },
  {
    n: "03",
    title: "Motion Design",
    body: "Layered, purposeful motion — depth, parallax, blur and light — never decoration for its own sake.",
  },
  {
    n: "04",
    title: "Accessibility",
    body: "Reduced-motion collapse, keyboard-first controls, semantic landmarks and contrast that passes AA.",
  },
  {
    n: "05",
    title: "Performance",
    body: "IO-gated animation, code-split sections and a ~77 KB gzipped initial payload at Lighthouse 95+.",
  },
  {
    n: "06",
    title: "Responsive Engineering",
    body: "The same cinematography at every size — fluid type, adaptive layouts, touch-native interactions.",
  },
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
    body: "One continuous chapter flow instead of a homepage of boxes. Every section answers a question a decision-maker asks: where do I live, what do I get, how far is the airport, who do I call.",
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
    body: "98 Performance, 100 Accessibility, 100 Best Practices, 100 SEO. 77 KB initial JS. Two 700 kbps films. Zero third-party requests. Lighthouse is a feature, not an afterthought.",
    tags: ["Perf", "Lighthouse"],
  },
];
