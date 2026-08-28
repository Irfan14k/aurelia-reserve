import type { Residence } from "../types/domain";

/**
 * Fallback residence data used ONLY when Supabase is not configured.
 *
 * This is the exact dataset that used to be hardcoded in Residences.tsx.
 * It keeps the site rendering correctly on a machine without credentials
 * (the UI labels it clearly as demo data), while the live path reads from
 * public.residences via src/services/residences.ts.
 */
export const demoResidences: Residence[] = [
  {
    id: "demo-atrium",
    n: "I",
    name: "The Atrium",
    beds: "3 Bedroom Residence",
    size: 1250,
    availability: 3,
    total: 4,
    collection: "Luxury Collection",
    desc: "A composition of shadow and light, opening onto a private atrium of layered greenery.",
    img: "/images/interior-1.jpg",
    features: ["Private Atrium", "Chef's Kitchen", "Cinematic Balcony", "Concierge Entry"],
  },
  {
    id: "demo-solene",
    n: "II",
    name: "The Solene",
    beds: "4 Bedroom Residence",
    size: 1780,
    availability: 2,
    total: 4,
    collection: "Signature Collection",
    desc: "Signature floor plates arranged around a central sunroom — an architecture of pause.",
    img: "/images/interior-2.jpg",
    features: ["Central Sunroom", "Dual Terrace", "Concierge Foyer", "Sky Garden"],
  },
  {
    id: "demo-aureate",
    n: "III",
    name: "The Aureate Penthouse",
    beds: "Penthouse",
    size: 2650,
    availability: 1,
    total: 2,
    collection: "Private Collection",
    desc: "A sky-set residence with panoramic vistas, a private pool deck and its own gilded dawn.",
    img: "/images/exterior-detail.jpg",
    features: ["Private Pool Deck", "360° Vistas", "Bespoke Interiors", "Owner's Lift"],
  },
];
