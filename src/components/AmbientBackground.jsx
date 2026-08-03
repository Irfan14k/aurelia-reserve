/**
 * Ambient background — aurora gradients (time-of-day aware),
 * slow light sweep, vignette. Pure CSS, GPU-composited.
 */
export default function AmbientBackground() {
  return (
    <>
      <div className="ambient-glow" aria-hidden />
      <div className="light-sweep" aria-hidden />
      <div className="vignette" aria-hidden />
    </>
  );
}
