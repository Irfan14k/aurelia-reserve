import { smoothScrollTo } from "../hooks";

const labels: Record<string, string> = {
  hero: "Overture",
  story: "The Story",
  residences: "Residences",
  floorplan: "Floor Plans",
  amenities: "Amenities",
  gallery: "Gallery",
  location: "Location",
  contact: "Enquire",
};

export default function ScrollRail({ ids, active }: { ids: string[]; active: string }) {
  return (
    <div className="scroll-rail hidden md:flex" aria-hidden>
      {ids.map((id) => (
        <button
          key={id}
          data-cursor="Jump"
          className={`scroll-rail__item ${active === id ? "active" : ""}`}
          onClick={() => smoothScrollTo(id)}
          aria-label={`Go to ${labels[id]}`}
        >
          <span className="scroll-rail__label">{labels[id]}</span>
          <span className="scroll-rail__dot" />
        </button>
      ))}
    </div>
  );
}
