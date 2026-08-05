# Aurelia Reserve

**Luxury Real Estate Experience**

Concept Demo

---

A fictional luxury real-estate website engineered to award-level standards — cinematic storytelling, premium motion design and modern frontend engineering, presented as an independent portfolio concept.

> The brief: *"When a CEO opens this site they should think — this feels like a keynote presentation for a five-star resort brand."* *(fictional creative brief for demonstration)*

---

## Overview

Aurelia Reserve is a concept demo of what a luxury real-estate digital experience can be. A single scroll tells the story in chapters — arrival, residences, floor plans, amenities, gallery, location, contact — and a one-click **Website ⇄ Case Study** toggle reveals the making-of: research, wireframes, moodboard, design system, development, performance and outcome.

All branding, names, imagery, pricing and locations are **fictional**.

## Features

- Cinematic dual-video hero — crossfade, volumetric light, fog, light rays, mouse parallax, split-serif typography
- Procedural ambient soundscape (Web Audio, zero audio files)
- Dynamic time-of-day lighting that regrades the entire experience
- Residence cards — 3D tilt, glare, hover expand, availability, price animation, compare mode
- Interactive floor plans — zoom, pan, rotate, fullscreen, SVG download, room highlight, ventilation study
- Amenities with environment-changing backgrounds and animated counters
- Masonry gallery with parallax depth and a fullscreen viewer (drag, swipe, keyboard)
- Cinematic location map — self-drawing routes, travelling markers, travel-time animation
- Glass cursor with context labels · magnetic buttons · floating dock · film grain · gold design tokens
- **Case Study mode** — an 8-chapter making-of deck inside the same experience

## Technology Stack

- **React 18** + **Vite 5** — code-split, es2020 target
- **Lenis** — buttery smooth scroll with a luxury deceleration curve
- **Custom hook motion engine** — reveal, cursor, parallax, tilt, magnetic, count-up (IntersectionObserver + rAF; no animation library)
- **Web Audio API** — procedural ambience
- **Canvas** — DPR-aware floating dust, IO-paused
- **SVG/SMIL** — maps, floor plans, animated paths
- **CSS custom properties** — a 12-token design system

## Motion System

- One easing curve everywhere: `cubic-bezier(0.16, 1, 0.3, 1)` — never linear
- Layered motion: opacity, blur, scale, mask reveal, clip-path, depth, perspective, parallax, micro-rotation
- Four reveal variants (`rise / mask / scale / line`) with `--d` stagger
- GPU transforms and opacity only; rAF loops gated by IntersectionObserver
- Full `prefers-reduced-motion` collapse to a quiet static frame

## Performance

- **~77 KB gzipped initial JS** (React 45 + app 27 + Lenis 5.5)
- Hero films at **700 kbps** (~0.8 MB each), poster preloaded for LCP
- Gallery, Location and Case Study sections **code-split** and IO-triggered
- `content-visibility: auto` for off-screen chapters
- **Zero third-party requests** (fonts preconnected, swap-display)
- Lighthouse target: **95+** across all categories

## Accessibility

- Reduced-motion media query collapses all animation
- Keyboard-first: lightbox, dock, floor-plan rooms, skip link
- Semantic landmarks, ARIA roles/labels, focus-visible rings
- Contrast passes WCAG 2.1 AA

## Responsive Design

The same cinematography at every size: fluid type scales, adaptive grids, touch-native interactions, a full-screen menu on mobile, and the dock, rail and badges reflowing gracefully.

## Project Structure

```
aurelia/
├── index.html              — SEO shell · OG/Twitter · JSON-LD
├── public/                 — media, images, favicon, manifest, sitemap, robots
└── src/
    ├── App.jsx             — experience composition (all layers)
    ├── hooks/              — smooth scroll · reveal · cursor · parallax · count-up…
    ├── lib/                — lenis · splitText · easing · ambient audio · ready
    ├── context/            — Sound · CaseStudy
    ├── data/               — ALL copy in one place (rebrand in minutes)
    ├── components/         — 25+ components, all animated
    └── styles/             — tokens · base · effects · components · sections · casestudy
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev        # local dev server at :5173
```

## Build

```bash
npm run build      # production build → dist/
npm run preview    # serve the production build
```

## Deployment

Zero-config on any static host. Build command `npm run build`, output directory `dist/`.

- **Vercel:** import the repo → framework preset Vite → deploy
- **Netlify:** new site from Git → build `npm run build` → publish `dist`

## Lighthouse

Run Lighthouse (Chrome DevTools or `npx lighthouse https://your-deploy-url`) to verify:
Performance 95+ · Accessibility 100 · Best Practices 100 · SEO 100.

## License

MIT — see [LICENSE](LICENSE).

## Portfolio Disclaimer

------------------------------------------------

**Portfolio Disclaimer**

This project was independently designed and developed by Irfan Khan as a frontend portfolio concept.

It is created solely to demonstrate premium UI, motion design, frontend engineering and luxury digital experiences.

It is not affiliated with, endorsed by or associated with any real estate developer, company, property, trademark or location.

All branding, names, imagery, copy and content are fictional or used only for demonstration purposes.

------------------------------------------------

## Contact

- Email: [hello@yourportfolio.dev](mailto:hello@yourportfolio.dev)
- LinkedIn: [linkedin.com/in/irfan-khan-36220022b](https://linkedin.com/in/irfan-khan-36220022b)
- GitHub: [github.com/YOUR_USERNAME](https://github.com/YOUR_USERNAME)
## Live Links

🌐 Live Website:
https://YOUR-VERCEL-URL.vercel.app

🎨 Figma Presentation:
https://www.figma.com/deck/hMrHWp0mxF7XxaLTT7R4Md/Aurelia-Reserve-...

💻 GitHub Repository:
https://github.com/Irfan14k/aurelia-reserve
## Portfolio Note

This project is a fictional luxury real estate concept created for portfolio purposes only.

It is not affiliated with, endorsed by, or associated with any real estate developer, company, brand, or project.

All branding, visuals, names, copywriting, interactions, and animations were designed to demonstrate premium UI/UX, frontend engineering, and motion design capabilities.
