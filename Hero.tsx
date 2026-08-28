import { useEffect, useRef, useState } from "react";
import { smoothScrollTo } from "../hooks";

// Dual-video crossfade playlist
const CLIPS = [
  "https://videos.pexels.com/video-files/10227696/10227696-uhd_3840_2160_30fps.mp4",
  "https://videos.pexels.com/video-files/38630679/16406931_3840_2160_60fps.mp4",
  "https://videos.pexels.com/video-files/38675645/16428603_3840_2160_30fps.mp4",
  "https://videos.pexels.com/video-files/29095944/12571464_3840_2160_60fps.mp4",
];

export default function Hero() {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const bgWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeVideo, setActiveVideo] = useState<"A" | "B">("A");
  const [clipIndex, setClipIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState("");
  const [videoFailed, setVideoFailed] = useState(false);

  // Preload initial clips
  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;
    a.src = CLIPS[0];
    b.src = CLIPS[1];
    a.load();
    b.load();
    a.play().catch(() => {});
  }, []);

  // Dual-video crossfade
  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    const la = layerARef.current;
    const lb = layerBRef.current;
    if (!a || !b || !la || !lb) return;

    const FADE_MS = 900;
    let disposed = false;

    const handleTime = (which: "A" | "B") => () => {
      if (disposed) return;
      const video = which === "A" ? a : b;
      const other = which === "A" ? b : a;
      const otherLayer = which === "A" ? lb : la;
      const thisLayer = which === "A" ? la : lb;

      if (!video.duration || isNaN(video.duration)) return;
      const remaining = video.duration - video.currentTime;

      // Crossfade window
      if (remaining < FADE_MS / 1000 + 0.15 && activeVideo === which) {
        // Prepare the other video
        const nextIndex = (clipIndex + 1) % CLIPS.length;
        // Only swap source if not already loaded to next
        if (other.src.indexOf(CLIPS[nextIndex]) === -1) {
          other.src = CLIPS[nextIndex];
          other.load();
        }
        other.currentTime = 0;
        const playPromise = other.play();
        if (playPromise) playPromise.catch(() => {});

        // Trigger opacity swap
        thisLayer.style.opacity = "0";
        otherLayer.style.opacity = "1";

        setActiveVideo(which === "A" ? "B" : "A");
        setClipIndex(nextIndex);
      }
    };

    const listenerA = handleTime("A");
    const listenerB = handleTime("B");
    a.addEventListener("timeupdate", listenerA);
    b.addEventListener("timeupdate", listenerB);

    return () => {
      disposed = true;
      a.removeEventListener("timeupdate", listenerA);
      b.removeEventListener("timeupdate", listenerB);
    };
  }, [activeVideo, clipIndex]);

  // Mouse parallax on background
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!bgWrapRef.current) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      bgWrapRef.current.style.transform = `scale(1.08) translate(${dx * -22}px, ${dy * -22}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Scroll parallax + content fade
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (bgWrapRef.current) {
        bgWrapRef.current.style.filter = `brightness(${Math.max(0.35, 1 - y / 900)})`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(${y * 0.4}px)`;
        contentRef.current.style.opacity = `${Math.max(0, 1 - y / 600)}`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="relative h-[100svh] min-h-[560px] md:min-h-[720px] w-full overflow-hidden bg-obsidian">
      {/* Video parallax wrapper */}
      <div
        ref={bgWrapRef}
        className="absolute inset-[-4%] will-change-transform"
        style={{ transition: "transform 0.6s cubic-bezier(0.2,0.7,0.15,1), filter 0.4s ease" }}
      >
        {/* Cinematic still — always painted, guarantees a composed hero if video fails */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero.jpg)" }}
          aria-hidden
        />

        {/* Layer B (below) */}
        <div
          ref={layerBRef}
          className="video-layer"
          style={{ opacity: 0, transition: "opacity 900ms cubic-bezier(0.65,0.05,0.15,1)" }}
        >
          <video
            ref={videoBRef}
            muted={muted}
            playsInline
            preload="auto"
            poster="/images/hero.jpg"
            onError={() => setVideoFailed(true)}
          />
        </div>
        {/* Layer A (top) */}
        <div
          ref={layerARef}
          className="video-layer"
          style={{ opacity: videoFailed ? 0 : 1, transition: "opacity 900ms cubic-bezier(0.65,0.05,0.15,1)" }}
        >
          <video
            ref={videoARef}
            muted={muted}
            playsInline
            preload="auto"
            autoPlay
            poster="/images/hero.jpg"
            onError={() => setVideoFailed(true)}
          />
        </div>
      </div>

      {/* Depth layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/45 via-obsidian/25 to-obsidian z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian/60 via-transparent to-obsidian/40 z-[2]" />
      <div className="light-rays" aria-hidden />

      {/* Corner HUD — coordinates cluster is desktop-only to keep mobile calm */}
      <div className="hidden md:block absolute top-24 md:top-28 left-6 md:left-12 z-10 mono text-[0.62rem] tracking-[0.35em] text-parchment/50 uppercase">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px bg-gold/60" />
          <span>N 41°24′ · E 12°28′</span>
        </div>
        <div className="mt-2 pl-11">Elev. 118 m · Reserve I–III</div>
      </div>
      <div className="absolute top-24 md:top-28 right-6 md:right-12 z-10 mono text-[0.62rem] tracking-[0.35em] text-parchment/50 uppercase text-right">
        <div className="flex items-center gap-3 justify-end">
          <span>Local · {time}</span>
          <span className="hidden md:inline w-8 h-px bg-gold/60" />
        </div>
        <div className="hidden md:block text-gold/70 mt-2">Concept Demo · v2.6</div>
      </div>

      {/* Sound toggle — hidden when no video is playing */}
      <button
        disabled={videoFailed}
        onClick={() => {
          setMuted((m) => !m);
          if (videoARef.current) videoARef.current.muted = !videoARef.current.muted;
          if (videoBRef.current) videoBRef.current.muted = !videoBRef.current.muted;
        }}
        data-cursor={muted ? "Sound On" : "Sound Off"}
        className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2 z-10 mono text-[0.6rem] tracking-[0.35em] uppercase text-parchment/60 hover:text-gold transition-colors flex items-center gap-3 disabled:opacity-0 disabled:pointer-events-none"
        aria-label={muted ? "Enable ambient sound" : "Disable ambient sound"}
      >
        <span className="relative w-8 h-8 rounded-full border border-parchment/20 flex items-center justify-center hover:border-gold transition-colors">
          <span className={`absolute inset-0 rounded-full border border-gold ${muted ? "" : "animate-ping opacity-40"}`} />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            {muted ? (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </>
            ) : (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </>
            )}
          </svg>
        </span>
        <span className="hidden md:inline">Ambient · {muted ? "Silent" : "Playing"}</span>
      </button>

      {/* Floating concept badge */}
      <div className="absolute top-40 md:top-44 right-6 md:right-12 z-10 glass px-5 py-3 flex items-center gap-3 rounded-full">
        <span className="live-dot" />
        <div className="flex flex-col leading-none gap-1">
          <span className="mono text-[0.6rem] tracking-[0.35em] uppercase text-parchment/80">Independent Concept</span>
          <span className="mono text-[0.52rem] tracking-[0.35em] uppercase text-gold/70">Portfolio Demonstration</span>
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-14"
      >
        <div className="max-w-6xl">
          <div className="line-mask is-visible mb-8">
            <span className="inline-block mono text-[0.68rem] tracking-[0.45em] uppercase text-gold">
              <span className="mr-3">◆</span>Luxury Real Estate Experience · Concept Demo
            </span>
          </div>

          <h1 className="display text-[15vw] md:text-[11vw] lg:text-[9.5vw] leading-[0.88] text-bone font-normal tracking-[-0.02em]">
            <span className="line-mask is-visible block" style={{ ["--reveal-delay" as any]: "300ms" }}>
              <span>Where Silence</span>
            </span>
            <span className="line-mask is-visible block italic text-gold-grad" style={{ ["--reveal-delay" as any]: "500ms" }}>
              <span>Meets Opulence.</span>
            </span>
          </h1>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <p className="md:col-span-5 text-parchment/70 max-w-md leading-relaxed line-mask is-visible" style={{ ["--reveal-delay" as any]: "800ms" }}>
              <span>
                An independent concept showcasing premium architecture, cinematic storytelling and luxury digital experiences.
              </span>
            </p>

            <div className="md:col-span-5 md:col-start-8 flex flex-wrap gap-4 justify-start md:justify-end">
              <button
                data-cursor="Explore"
                onClick={() => smoothScrollTo("residences")}
                className="btn-gold"
              >
                <span>Explore Experience</span>
                <span>→</span>
              </button>
              <button
                data-cursor="View"
                onClick={() => smoothScrollTo("story")}
                className="btn-ghost"
              >
                <span className="w-2 h-2 border-l-[6px] border-l-current border-y-4 border-y-transparent" />
                <span>View Concept</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="mono text-[0.58rem] tracking-[0.5em] text-parchment/50 uppercase">Scroll</span>
          <div className="relative w-px h-14 bg-parchment/20 overflow-hidden">
            <span className="absolute top-0 left-0 w-px h-6 bg-gold" style={{ animation: "scrollcue 2.4s ease-in-out infinite" }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollcue {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  );
}
