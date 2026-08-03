export const RESIDENCES = [
  {
    id: "sky",
    name: "The Sky Residence",
    tag: "Signature",
    beds: "4 Bed",
    area: 4850,
    price: 18.4,
    remaining: 3,
    image: "/images/opt/residence-1.jpg",
    blurb:
      "A corner residence wrapped in glass — the sea on two sides, the city on the third. A 90 sq m living salon, private lift lobby, and a master suite with its own dressing room and sea-view bath.",
    features: ["Private lift lobby", "90 m² living salon", "Sea-view master bath", "Dedicated study"],
  },
  {
    id: "garden",
    name: "The Garden Terrace",
    tag: "Collection",
    beds: "3 Bed",
    area: 3120,
    price: 9.6,
    remaining: 7,
    image: "/images/opt/residence-2.jpg",
    blurb:
      "A residence that opens like a courtyard — every room gives onto a planted terrace. Evening light on teak, the city glowing below, and enough sky to call your own.",
    features: ["260 sq ft planted terrace", "Open-plan living", "Outdoor dining deck", "Sunrise kitchen"],
  },
  {
    id: "atelier",
    name: "The Atelier",
    tag: "Loft Collection",
    beds: "3 Bed",
    area: 2460,
    price: 8.2,
    remaining: 5,
    image: "/images/opt/residence-3.jpg",
    blurb:
      "Walnut, brass and a wall of sea. The Atelier is the quietest residence in the tower — a study, a library, a place where work and stillness share a room.",
    features: ["Walnut library wall", "Brass detailing", "Chef's kitchen", "City & sea aspect"],
  },
];

export const COMPARE_META = [
  { key: "beds", label: "Configuration" },
  { key: "area", label: "Internal area", kind: "area" },
  { key: "price", label: "All-inclusive price", kind: "price" },
  { key: "remaining", label: "Availability", kind: "remaining" },
  { key: "aspect", label: "Aspect" },
  { key: "terrace", label: "Private terrace" },
  { key: "lift", label: "Private lift lobby" },
];

export const COMPARE_DATA = {
  sky: {
    beds: "4 Bed · 5 Bath",
    area: 4850,
    price: 18.4,
    remaining: 3,
    aspect: "Sea · 270°",
    terrace: "18 m² sky terrace",
    lift: "Yes",
  },
  garden: {
    beds: "3 Bed · 4 Bath",
    area: 3120,
    price: 9.6,
    remaining: 7,
    aspect: "Sea · City",
    terrace: "260 sq ft planted",
    lift: "Dedicated lift lobby",
  },
  atelier: {
    beds: "3 Bed · 3 Bath",
    area: 2460,
    price: 8.2,
    remaining: 5,
    aspect: "Sea · West",
    terrace: "Balcony 12 m²",
    lift: "Shared (2 per floor)",
  },
};
