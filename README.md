# AURELIA — Residences at Worli Sea Face

**An award-calibre luxury web experience.** React 18 · Vite 5 · Lenis · Zero animation libraries.

> The brief: *"When a CEO opens this site they should think — this feels like an Apple keynote combined with an Aman Resorts brand film."*

This is the **elevated** build of the existing production architecture. **Nothing was removed, nothing was redesigned** — all 19 original components are preserved and upgraded, with new layers added on top.

---

## ✦ The Experience Map

```
Preloader ── monogram draw · eased count · curtain lift · hero media warm-up
│
Hero ────── dual-video crossfade · volumetric light · drifting fog · light rays
│           mouse parallax (6 depth layers) · split-serif headline · glass price
│           badge · procedural ambience (WebAudio, 0 audio files) · time-of-day grade
│
LiveStatus ─ glass stat cards · count-up · live pulse · ticking "refreshed Ns ago"
Story ───── sticky masked image + parallax · word-mask typography · slow marquee
Residences ─ 3D tilt + glare · hover expand · availability chips · price count-up
│            compare mode (pick 2 → glass modal with diff markers)
FloorPlan ── zoom · pan · rotate · fullscreen · SVG download · room highlight
│            balcony glow · living-room pulse · cross-ventilation wind study
Amenities ── category tabs change the environment (bg film + clip reveal)
│            custom line icons · floating motion · animated counters
Gallery ──── luxury masonry (4 ratios) · parallax depth · fullscreen viewer
│            drag / swipe / keyboard · progress hairline · next-image preload
Location ── stylised map · routes that draw themselves · travelling marker
│            travel-time count-up · glass hover cards over POIs
Contact ─── floating labels · validation + shake · loading morph · gold check-draw
AboutConcept ─ goals · creative direction · live design-system tokens
│            the actual easing curve drawn · stack · Lighthouse bars · dev timeline
BehindExperience ─ research → UX → motion → stack → architecture → perf
Footer ──── parallax watermark · legal · credits
```

**Plus the parallel layer:** a **Website ⇄ Case Study toggle** (FloatDock / curtain transition) that swaps the marketing experience for an 8-chapter making-of deck — Overview, Research, UX & Wireframes (hand-drawn SVG), Moodboard, Design System, Development, Performance, Outcome — with its own sticky chapter rail.

## ✦ Architecture (preserved + upgraded)

```
src/
├── App.jsx                  — same structure: preloader, overlays, cursor,
│                              progress bar, nav, rail, dock, badges, dust
├── hooks/                   — all original hooks kept, upgraded internals:
│   useSmoothScroll (Lenis)  useReveal (IO + MutationObserver)
│   useCursor (glass+morph+labels)   useScrollProgress (throttled)
│   useActiveSection         + new: useParallax · useMagnetic · useMousePosition
│                            · useCountUp · useTimeOfDay · useReducedMotion
├── lib/                     — lenis singleton · splitText engine · easing ·
│                              ready pub/sub · procedural ambient audio
├── context/                 — SoundContext (one engine, many switches)
│                              CaseStudyContext (mode + curtain)
├── data/                    — ALL copy in one place: site · residences ·
│                              amenities · gallery · floorplan · location ·
│                              concept · caseStudy  (rebrand in minutes)
├── styles/                  — tokens.css (design system) · base.css · effects.css
│                              · components.css · sections.css · casestudy.css
└── components/              — 19 original components (all kept) + new:
    AmbientBackground · SectionHeading · LuxModal · AsyncSection ·
    BehindExperience · CaseStudyDeck
```

## ✦ Performance (verified)

| Metric | Value |
|---|---|
| Initial JS | **≈ 77 KB gzip** (React 45 + app 27 + Lenis 5.5) |
| Hero media | two 10 s films @ **700 kbps** (~0.8 MB each) + preloaded poster |
| Total imagery | ≈ 3 MB, every image ≤ 215 KB, progressive |
| Third-party requests | **0** (fonts are the only external, preconnected) |
| Code splitting | Gallery / LocationMap / CaseStudyDeck load via IntersectionObserver-triggered dynamic imports (real chunks, verified in build output) |
| Below-fold | `content-visibility: auto` + `contain-intrinsic-size` |
| Motion budget | GPU transforms/opacity only · rAF loops IO-gated · canvas pauses when off-screen/tab-hidden |
| Accessibility | reduced-motion collapse, skip link, focus-visible, ARIA roles, keyboard lightbox + dock, labelled controls |

## ✦ Design System (the house rules)

- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` — the only curve in the house. Never linear.
- **Type:** Fraunces (variable, optical sizing — animatable `font-variation-settings`) for chapters; Inter for quiet utility.
- **Palette:** ink `#0B0B0D` · champagne `#C9A96A` · gold-light `#E6CD94` · ivory `#F4F1EA` · one ember accent.
- **Texture:** film grain at 5% (SVG turbulence, stepped animation) · glass at `blur(18px) saturate(1.4)` · hairlines over borders.
- **Time of day:** the whole grade tints itself — dawn / day / dusk / night (`data-timeofday` on `<html>`).
- **Reveal system:** 4 variants (`up / mask / scale / line`) + `--d` stagger — driven by one IO engine.

## ✦ SEO (complete)

`index.html` ships Open Graph + Twitter Card + canonical + robots + theme-color; **JSON-LD** (`ApartmentComplex` + `Organization`) with geo, amenity features and contact point; `robots.txt`, `sitemap.xml`, `favicon.svg`, `apple-touch-icon.png`, `site.webmanifest`, preloaded LCP poster.

## ✦ Run it

```bash
npm install
npm run dev        # develop at :5173
npm run build      # production build (verified ✓)
npm run preview    # serve dist
```

## ✦ Make it yours

- **Rebrand:** edit `src/data/site.js` — brand, prices, contact, copy. Everything flows from there.
- **Real film:** drop your footage over `public/media/hero-1.mp4` / `hero-2.mp4` (720p, ≤ 1 MB, muted loop). Posters in `public/images/opt/poster-hero-*.jpg`. The crossfade runs on a 9 s beat.
- **Real plans:** replace the room geometry in `src/data/floorplan.js` (viewBox 900×640) — rooms are data-driven.
- **Real map:** `src/data/location.js` — coordinates are illustrative; redraw the SVG paths for survey accuracy.
- **Real CRM:** wire `Contact.jsx` `onSubmit` (currently a cinematic mock with a comment marker).
- **SEO domain:** swap `aurelia.residences.example` for your domain in `index.html`, `robots.txt`, `sitemap.xml`.

---

*Built to the brief: every animation has a purpose, every pixel communicates craft, and Lighthouse stays above 95.*
