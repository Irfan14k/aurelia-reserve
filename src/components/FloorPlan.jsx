import { useEffect, useMemo, useRef, useState } from "react";
import { FLOOR_PLANS, FLOOR_NOTES } from "../data/floorplan";
import { fmtArea } from "../lib/format";
import SectionHeading from "./SectionHeading";

const ROOM_NOTES = {
  living: "The living salon — the whole western wall opens to the sea.",
  master: "Master suite with sea-view bath and a walk-in that fits a season.",
  balcony: "The sea balcony — west-facing, made for the golden hour.",
  foyer: "A private foyer with its own lift lobby. Shoes off, sea on.",
  gallery: "The gallery hall — long, quiet, and lit like a museum.",
  ensuite: "Master bath in travertine, with a window above the bath.",
  walkin: "Walk-in wardrobe — brass, cedar, and mirrors that flatter.",
  bed2: "A guest suite with city and sea aspects.",
  bed3: "The third bedroom — quiet, east-facing morning light.",
  utility: "Utility room — plumbed, vented, and out of sight.",
  bath: "Guest bath in honed stone.",
};

const ICONS = {
  zoomIn: <path d="M12 5v14M5 12h14" />,
  zoomOut: <path d="M5 12h14" />,
  rotate: <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v6h-6" />,
  fit: <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />,
  full: <path d="M8 4H4v4M16 4h4v4M16 20h4v-4M8 20H4v-4" />,
  download: <path d="M12 4v11m0 0 4-4m-4 4-4-4M4 20h16" />,
  wind: <path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h8a3 3 0 1 1-3 3" />,
};

function Room({ room, active, onEnter, onLeave, onClick }) {
  const kind = room.kind || "";
  return (
    <g
      className={`fp-room${active ? " is-active" : ""}${kind ? ` fp-room--${kind}` : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${room.name}, ${room.area} square feet`}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      data-cursor-label="Explore"
    >
      <rect x={room.x} y={room.y} width={room.w} height={room.h} rx={4} className="fp-room__fill" />
      <rect x={room.x} y={room.y} width={room.w} height={room.h} rx={4} className="fp-room__hit" />
      <text
        x={room.x + room.w / 2}
        y={room.y + room.h / 2 - 4}
        className="fp-room__name"
        textAnchor="middle"
      >
        {room.name}
      </text>
      <text
        x={room.x + room.w / 2}
        y={room.y + room.h / 2 + 16}
        className="fp-room__area"
        textAnchor="middle"
      >
        {room.area} sq ft
      </text>
      {kind === "balcony" && (
        <>
          <circle cx={room.x + room.w / 2} cy={room.y + 120} r={30} className="fp-balcony-glow" />
          <path
            className="fp-waves"
            d={`M ${room.x + 6} ${room.y + 220} q 5 -6 10 0 t 10 0 t 10 0`}
          />
        </>
      )}
      {kind === "living" && <rect x={room.x + 8} y={room.y + 8} width={room.w - 16} height={room.h - 16} rx={2} className="fp-living-pulse" />}
    </g>
  );
}

/**
 * Floor plan atelier — zoom, pan, rotate, fullscreen, download,
 * animated room highlight, balcony glow, living-room pulse and a
 * cross-ventilation wind study. Pure SVG + pointer events.
 */
export default function FloorPlan() {
  const [planId, setPlanId] = useState(FLOOR_PLANS[0].id);
  const [zoom, setZoom] = useState(1.15);
  const [rot, setRot] = useState(0);
  const [activeRoom, setActiveRoom] = useState(null);
  const [pinned, setPinned] = useState(null);
  const [vent, setVent] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const stageRef = useRef(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const pan = useRef({ x: 0, y: 0 });
  const drag = useRef(null);

  const plan = useMemo(() => FLOOR_PLANS.find((p) => p.id === planId), [planId]);
  const room = plan.rooms.find((r) => r.id === activeRoom);

  /* ——— fullscreen sync ——— */
  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const applyTransform = () => {
    const s = stageRef.current;
    if (!s) return;
    const { x, y } = pan.current;
    s.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoom}) rotate(${rot}deg)`;
  };
  useEffect(applyTransform, [zoom, rot]);

  /* ——— wheel zoom toward cursor ——— */
  const onWheel = (e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const next = Math.min(3.2, Math.max(0.75, zoom * (e.deltaY < 0 ? 1.14 : 0.875)));
    const k = next / zoom;
    pan.current.x = cx - (cx - pan.current.x) * k;
    pan.current.y = cy - (cy - pan.current.y) * k;
    setZoom(next);
  };

  /* ——— drag pan ——— */
  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, px: pan.current.x, py: pan.current.y };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    pan.current.x = drag.current.px + (e.clientX - drag.current.x);
    pan.current.y = drag.current.py + (e.clientY - drag.current.y);
    applyTransform();
  };
  const onPointerUp = () => (drag.current = null);

  const fit = () => {
    pan.current = { x: 0, y: 0 };
    setZoom(1.15);
    setRot(0);
    applyTransform();
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current?.requestFullscreen?.();
  };

  const download = () => {
    const svg = svgRef.current;
    if (!svg || downloading) return;
    setDownloading(true);
    setTimeout(() => {
      const clone = svg.cloneNode(true);
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const blob = new Blob([new XMLSerializer().serializeToString(clone)], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aurelia-${plan.id}-floorplan.svg`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setDownloading(false);
    }, 350);
  };

  const tool = (label, icon, onClick, active = false) => (
    <button
      key={label}
      className={`fp-tool${active ? " is-active" : ""}`}
      onClick={onClick}
      aria-label={label}
      title={label}
      data-cursor-label={label}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {icon}
      </svg>
    </button>
  );

  return (
    <section id="floorplan" className="floorplan">
      <div className="wrap">
        <SectionHeading
          eyebrow="03 · Floor Plans"
          title={<>Every wall placed <em>by hand</em>.</>}
          meta="3 collections · 11 rooms"
        />

        {/* plan tabs */}
        <div className="fp-tabs" role="tablist" aria-label="Choose a residence plan" data-reveal>
          {FLOOR_PLANS.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={planId === p.id}
              className={`fp-tab${planId === p.id ? " is-active" : ""}`}
              onClick={() => { setPlanId(p.id); setActiveRoom(null); setPinned(null); }}
            >
              <span>{p.name}</span>
              <small>{fmtArea(p.area)}</small>
            </button>
          ))}
        </div>

        <div
          ref={containerRef}
          className={`fp-stage glass hairline-card${fullscreen ? " is-fullscreen" : ""}`}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          data-cursor="view"
        >
          {/* toolbar */}
          <div className="fp-tools glass-strong">
            {tool("Zoom in", ICONS.zoomIn, () => setZoom((z) => Math.min(3.2, z * 1.2)))}
            {tool("Zoom out", ICONS.zoomOut, () => setZoom((z) => Math.max(0.75, z / 1.2)))}
            {tool("Rotate 90°", ICONS.rotate, () => setRot((r) => (r + 90) % 360))}
            {tool("Reset view", ICONS.fit, fit)}
            {tool("Cross ventilation", ICONS.wind, () => setVent(!vent), vent)}
            {tool(downloading ? "Preparing…" : "Download plan", ICONS.download, download)}
            {tool(fullscreen ? "Exit fullscreen" : "Fullscreen", ICONS.full, toggleFullscreen)}
          </div>

          <div className="fp-viewport">
            <div className="fp-stage__transform" ref={stageRef}>
              <svg
                ref={svgRef}
                viewBox="0 0 900 640"
                className="fp-svg"
                role="img"
                aria-label={`Floor plan of ${plan.name}`}
              >
                <defs>
                  <radialGradient id="balconyGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#E6CD94" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#E6CD94" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="seaFill" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#16233f" />
                    <stop offset="100%" stopColor="#0d1424" />
                  </linearGradient>
                  <pattern id="gridDots" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="rgba(244,241,234,0.05)" />
                  </pattern>
                </defs>

                <rect width="900" height="640" fill="url(#gridDots)" />

                {/* sea */}
                <rect x="0" y="0" width="118" height="640" fill="url(#seaFill)" opacity="0.5" />
                <text x="14" y="330" className="fp-sea-label" transform="rotate(-90 14 330)">
                  ARABIAN SEA — WEST
                </text>

                {/* rooms */}
                {plan.rooms.map((r) => (
                  <Room
                    key={r.id}
                    room={r}
                    active={activeRoom === r.id}
                    onEnter={() => setActiveRoom(r.id)}
                    onLeave={() => setActiveRoom((a) => (pinned ? a : null))}
                    onClick={() => {
                      setActiveRoom(r.id);
                      setPinned(r.id);
                    }}
                  />
                ))}

                {/* interior walls */}
                <g className="fp-walls">
                  {/* balcony divider */}
                  <line x1="117" y1="55" x2="117" y2="290" />
                  <line x1="117" y1="340" x2="117" y2="600" />
                  {/* corridor wall */}
                  <line x1="127" y1="352" x2="150" y2="352" />
                  <line x1="190" y1="352" x2="570" y2="352" />
                  <line x1="610" y1="352" x2="732" y2="352" />
                  {/* ensuite / walkin divider */}
                  <line x1="547" y1="360" x2="547" y2="600" />
                  <line x1="432" y1="480" x2="547" y2="480" />
                  {/* bed2 / bed3 */}
                  <line x1="557" y1="485" x2="732" y2="485" />
                  {/* entry column */}
                  <line x1="742" y1="55" x2="742" y2="600" />
                  <line x1="752" y1="160" x2="870" y2="160" />
                  <line x1="752" y1="435" x2="870" y2="435" />
                  <line x1="808" y1="445" x2="808" y2="590" />
                  {/* outer wall */}
                  <rect x="30" y="30" width="840" height="580" fill="none" className="fp-outer" />
                </g>

                {/* doors */}
                <g className="fp-doors">
                  <path d="M 117 300 q 40 0 40 40" />
                  <path d="M 150 352 q 0 -40 40 -40" />
                  <path d="M 570 352 q 0 -40 40 -40" />
                  <path d="M 432 470 q 40 0 40 40" />
                  <path d="M 742 200 q 40 0 40 40" />
                  <path d="M 752 160 q 40 0 40 40" />
                  <path d="M 752 435 q 40 0 40 40" />
                  <path d="M 117 450 q 40 0 40 40" />
                </g>

                {/* sea-facing windows */}
                <g className="fp-windows">
                  {[120, 190, 260].map((y) => (
                    <g key={y}>
                      <line x1="30" y1={y} x2="30" y2={y + 34} />
                      <line x1="40" y1={y} x2="40" y2={y + 34} />
                    </g>
                  ))}
                  <g>
                    <line x1="30" y1="420" x2="30" y2="454" />
                    <line x1="40" y1="420" x2="40" y2="454" />
                  </g>
                </g>

                {/* dimensions */}
                <g className="fp-dims">
                  <line x1="30" y1="18" x2="870" y2="18" />
                  <line x1="30" y1="12" x2="30" y2="24" />
                  <line x1="870" y1="12" x2="870" y2="24" />
                  <text x="450" y="12" textAnchor="middle">40.2 m</text>
                  <line x1="18" y1="30" x2="18" y2="610" />
                  <line x1="12" y1="30" x2="24" y2="30" />
                  <line x1="12" y1="610" x2="24" y2="610" />
                  <text x="10" y="330" textAnchor="middle" transform="rotate(-90 10 330)">22.4 m</text>
                </g>

                {/* ventilation study */}
                <g className={`fp-vent${vent ? " is-on" : ""}`} aria-hidden>
                  <path d="M 160 300 C 320 300 420 280 520 250" />
                  <path d="M 170 250 C 340 250 460 235 560 215" />
                  <path d="M 160 200 C 300 200 400 190 520 180" />
                  <text x="470" y="330" className="fp-vent-label">Cross breeze — sea to gallery</text>
                </g>
              </svg>
            </div>

            {/* room info card */}
            {room && (
              <div className="fp-room-info glass-strong" key={room.id}>
                <p className="fp-room-info__name">{room.name}</p>
                <p className="fp-room-info__area">{room.area} sq ft</p>
                <p className="fp-room-info__note">{ROOM_NOTES[room.id] || "A considered room."}</p>
              </div>
            )}
          </div>

          {/* legend */}
          <div className="fp-legend glass" aria-hidden>
            <span><i className="fp-legend__sea" /> Sea wall</span>
            <span><i className="fp-legend__glow" /> Balcony glow</span>
            <span><i className="fp-legend__pulse" /> Living pulse</span>
          </div>

          <p className="fp-disclaimer">{FLOOR_NOTES[0]} Scroll to zoom · drag to move · pick a room.</p>
        </div>
      </div>
    </section>
  );
}
