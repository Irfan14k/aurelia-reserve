import { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks";

/**
 * Floating dust — a light canvas particle field.
 * DPR-aware, pauses when off-screen or the tab is hidden.
 * `region`: "global" (fixed, behind content) | "hero" (absolute, dense).
 */
export default function DustParticles({ density = 1, region = "global", className = "" }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let particles = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((rect.width * rect.height) / 26000 * density);
      particles = Array.from({ length: Math.min(count, 90) }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: 0.4 + Math.random() * 1.3,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -0.02 - Math.random() * 0.07,
        a: 0.12 + Math.random() * 0.4,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      ctx.clearRect(0, 0, rect.width, rect.height);
      const t = performance.now() / 1000;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.02;
        if (p.y < -4) p.y = rect.height + 4;
        if (p.x < -4) p.x = rect.width + 4;
        if (p.x > rect.width + 4) p.x = -4;
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 205, 148, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        draw();
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden && running) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!document.hidden && !running) {
        running = true;
        draw();
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);

    // static single pass for reduced motion
    if (reduced) {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      particles.slice(0, 24).forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 205, 148, 0.25)`;
        ctx.fill();
      });
    } else {
      running = true;
      draw();
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={`dust ${region === "global" ? "dust--global" : ""} ${className}`}
      aria-hidden
    />
  );
}
