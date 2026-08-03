/**
 * Vertical chapter rail — the scroll-storytelling index.
 * Gold pulse on the active chapter, hover reveals names.
 */
export default function ScrollRail({ ids, active }) {
  const go = (e, id) => {
    e.preventDefault();
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(`#${id}`, { offset: 0, duration: 1.6 });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="rail" aria-label="Chapters">
      {ids.map((id, i) => (
        <a
          key={id}
          href={`#${id}`}
          className={`rail__item${active === id ? " is-active" : ""}`}
          onClick={(e) => go(e, id)}
        >
          <span className="rail__label">{id}</span>
          <span className="sr-only">{id}</span>
        </a>
      ))}
    </nav>
  );
}
