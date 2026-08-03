import { useEffect, useMemo, useState } from "react";
import { MAP } from "../data/location";
import { useCountUp } from "../hooks";
import SectionHeading from "./SectionHeading";

/**
 * Location — a stylised cinematic map of Worli's peninsula: the sea
 * drawn as gradient, routes that draw themselves, a marker that travels,
 * travel time that counts up, and hover cards over every point of interest.
 */
export default function LocationMap() {
  const [routeId, setRouteId] = useState(MAP.routes[0].id);
  const [hoverPoi, setHoverPoi] = useState(null);
  const route = useMemo(() => MAP.routes.find((r) => r.id === routeId), [routeId]);
  const [time, timeRef] = useCountUp(route.time, { duration: 1400, start: 0 });

  useEffect(() => {
    timeRef.current = null;
  }, [routeId]);

  return (
    <section id="location" className="location">
      <div className="wrap">
        <SectionHeading
          eyebrow="06 · Location"
          title={<>Ten minutes to <em>the rest of Mumbai</em>.</>}
          meta="Worli Sea Face"
        />

        <div className="location__grid" data-reveal="mask">
          {/* ——— The map ——— */}
          <div className="loc-map glass hairline-card" data-cursor="view" data-cursor-label="Explore">
            <svg viewBox={MAP.viewBox} className="loc-map__svg" role="img" aria-label="Stylised map of Worli and Mumbai's coastline">
              <defs>
                <linearGradient id="locSea" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1a2a4d" />
                  <stop offset="100%" stopColor="#0c1424" />
                </linearGradient>
                <linearGradient id="locLand" x1="0" y1="0" x2="0.6" y2="1">
                  <stop offset="0%" stopColor="#23232a" />
                  <stop offset="100%" stopColor="#16161b" />
                </linearGradient>
              </defs>

              <path d={MAP.sea} fill="url(#locSea)" />
              <path d={MAP.land} fill="url(#locLand)" stroke="rgba(244,241,234,0.14)" strokeWidth="1.5" />

              {/* contours */}
              {MAP.contours.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="rgba(244,241,234,0.05)" strokeWidth="1" />
              ))}

              {/* roads */}
              {MAP.roads.map((r) => (
                <path key={r.label} d={r.d} fill="none" stroke="rgba(244,241,234,0.1)" strokeWidth="1.4" strokeDasharray="3 5" />
              ))}

              {/* neighbourhood labels */}
              <text x="470" y="330" className="loc-map__hood" textAnchor="middle">Parel</text>
              <text x="560" y="120" className="loc-map__hood" textAnchor="middle">Bandra</text>
              <text x="280" y="560" className="loc-map__hood" textAnchor="middle">Colaba</text>
              <text x="520" y="560" className="loc-map__hood" textAnchor="middle">Lower Parel</text>

              {/* active route — draws itself */}
              <path
                key={`route-${route.id}`}
                d={route.d}
                className={`loc-map__route${routeId ? " is-drawn" : ""}`}
                fill="none"
              />
              {/* travelling marker */}
              <circle r="5" className="loc-map__traveler">
                <animateMotion dur={`${Math.max(2.2, route.time * 0.14)}s`} repeatCount="indefinite" path={route.d} />
              </circle>

              {/* POIs */}
              {MAP.pois.map((poi) => (
                <g
                  key={poi.id}
                  className={`loc-map__poi${poi.id === "aurelia" ? " is-home" : ""}${hoverPoi === poi.id ? " is-hover" : ""}`}
                  onMouseEnter={() => setHoverPoi(poi.id)}
                  onMouseLeave={() => setHoverPoi(null)}
                  data-cursor-label={poi.name}
                >
                  <circle cx={poi.x} cy={poi.y} r="16" className="loc-map__poi-halo" />
                  <circle cx={poi.x} cy={poi.y} r="5" className="loc-map__poi-dot" />
                  <text x={poi.x + 12} y={poi.y - 8} className="loc-map__poi-name">{poi.name}</text>

                  {hoverPoi === poi.id && (
                    <g className="loc-map__card">
                      <rect x={poi.x + 14} y={poi.y + 10} width="196" height="74" rx="10" fill="rgba(16,16,19,0.92)" stroke="rgba(201,169,106,0.4)" strokeWidth="1" />
                      <text x={poi.x + 30} y={poi.y + 34} className="loc-map__card-title">{poi.tag === "You are here" ? "You are here" : poi.name}</text>
                      <text x={poi.x + 30} y={poi.y + 54} className="loc-map__card-note">{poi.note}</text>
                      {poi.time && <text x={poi.x + 30} y={poi.y + 72} className="loc-map__card-time">{poi.time} min by car</text>}
                    </g>
                  )}
                </g>
              ))}
            </svg>

            <div className="loc-map__legend" aria-hidden>
              <span><i className="loc-map__legend-dot" /> AURELIA</span>
              <span><i className="loc-map__legend-route" /> Route</span>
              <span><i className="loc-map__legend-poi" /> Point of interest</span>
            </div>
          </div>

          {/* ——— Route selector ——— */}
          <div className="loc-panel">
            <p className="eyebrow" data-reveal>From your doorstep</p>

            <div className="loc-routes" role="tablist" aria-label="Choose a route">
              {MAP.routes.map((r, i) => (
                <button
                  key={r.id}
                  role="tab"
                  aria-selected={routeId === r.id}
                  className={`loc-route${routeId === r.id ? " is-active" : ""}`}
                  onClick={() => setRouteId(r.id)}
                  data-reveal
                  style={{ "--d": `${i * 90}ms` }}
                  data-cursor-label="Drive"
                >
                  <span className="loc-route__idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="loc-route__body">
                    <span className="loc-route__name">{r.name}</span>
                    <span className="loc-route__note">{r.note}</span>
                  </span>
                  <span className="loc-route__meta">
                    <span className="loc-route__time">{r.time} min</span>
                    <span className="loc-route__dist">{r.distance}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="loc-now glass glass-reflect" data-reveal style={{ "--d": "320ms" }} aria-live="polite">
              <div className="loc-now__row">
                <span className="loc-now__label">Travel time</span>
                <span className="loc-now__value">
                  <span ref={timeRef}>{Math.round(time)}</span> min
                </span>
              </div>
              <div className="loc-now__bar" aria-hidden>
                <i style={{ transform: `scaleX(${Math.max(0.06, time / 35)})` }} />
              </div>
              <p className="loc-now__note">
                {route.note} · Driving, live traffic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
