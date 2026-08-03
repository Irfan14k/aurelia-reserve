export default function PortfolioBadge() {
  return (
    <a
      href="#about"
      className="badge-portfolio"
      data-cursor-label="Open"
      onClick={(e) => {
        e.preventDefault();
        const lenis = window.__lenis;
        if (lenis) lenis.scrollTo("#about", { duration: 1.6 });
        else document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <span className="badge-dot" aria-hidden />
      Concept Portfolio · 2026
    </a>
  );
}
