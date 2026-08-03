/**
 * Floor plan geometry — viewBox 900 × 640.
 * Rooms are drawn as filled shapes; walls render as strokes on top.
 * Sea faces west (left), matching Worli Sea Face.
 */
export const FLOOR_PLANS = [
  {
    id: "sky",
    name: "The Sky Residence",
    area: 4850,
    rooms: [
      { id: "balcony", name: "Sea Balcony", area: 260, x: 55, y: 55, w: 52, h: 545, kind: "balcony" },
      { id: "living", name: "Living & Dining", area: 640, x: 127, y: 55, w: 545, h: 285, kind: "living" },
      { id: "master", name: "Master Suite", area: 400, x: 127, y: 360, w: 285, h: 235 },
      { id: "ensuite", name: "Master Bath", area: 95, x: 432, y: 360, w: 105, h: 110 },
      { id: "walkin", name: "Walk-in", area: 75, x: 432, y: 490, w: 105, h: 105 },
      { id: "bed2", name: "Bedroom II", area: 240, x: 557, y: 360, w: 175, h: 115 },
      { id: "bed3", name: "Bedroom III", area: 220, x: 557, y: 495, w: 175, h: 115 },
      { id: "foyer", name: "Foyer", area: 100, x: 752, y: 55, w: 118, h: 95 },
      { id: "gallery", name: "Gallery Hall", area: 190, x: 752, y: 170, w: 118, h: 255 },
      { id: "utility", name: "Utility", area: 70, x: 752, y: 445, w: 56, h: 145 },
      { id: "bath", name: "Bath", area: 70, x: 814, y: 445, w: 56, h: 145 },
    ],
  },
  {
    id: "garden",
    name: "The Garden Terrace",
    area: 3120,
    rooms: [
      { id: "balcony", name: "Planted Terrace", area: 260, x: 55, y: 55, w: 52, h: 545, kind: "balcony" },
      { id: "living", name: "Living & Dining", area: 520, x: 127, y: 55, w: 545, h: 285, kind: "living" },
      { id: "master", name: "Master Suite", area: 340, x: 127, y: 360, w: 285, h: 235 },
      { id: "ensuite", name: "Master Bath", area: 85, x: 432, y: 360, w: 105, h: 110 },
      { id: "walkin", name: "Walk-in", area: 65, x: 432, y: 490, w: 105, h: 105 },
      { id: "bed2", name: "Bedroom II", area: 210, x: 557, y: 360, w: 175, h: 115 },
      { id: "bed3", name: "Bedroom III", area: 190, x: 557, y: 495, w: 175, h: 115 },
      { id: "foyer", name: "Foyer", area: 90, x: 752, y: 55, w: 118, h: 95 },
      { id: "gallery", name: "Gallery Hall", area: 160, x: 752, y: 170, w: 118, h: 255 },
      { id: "utility", name: "Utility", area: 60, x: 752, y: 445, w: 56, h: 145 },
      { id: "bath", name: "Bath", area: 60, x: 814, y: 445, w: 56, h: 145 },
    ],
  },
  {
    id: "atelier",
    name: "The Atelier",
    area: 2460,
    rooms: [
      { id: "balcony", name: "Sea Balcony", area: 160, x: 55, y: 55, w: 52, h: 545, kind: "balcony" },
      { id: "living", name: "Living & Study", area: 460, x: 127, y: 55, w: 545, h: 285, kind: "living" },
      { id: "master", name: "Master Suite", area: 300, x: 127, y: 360, w: 285, h: 235 },
      { id: "ensuite", name: "Master Bath", area: 80, x: 432, y: 360, w: 105, h: 110 },
      { id: "walkin", name: "Walk-in", area: 60, x: 432, y: 490, w: 105, h: 105 },
      { id: "bed2", name: "Bedroom II", area: 190, x: 557, y: 360, w: 175, h: 115 },
      { id: "bed3", name: "Bedroom III", area: 170, x: 557, y: 495, w: 175, h: 115 },
      { id: "foyer", name: "Foyer", area: 80, x: 752, y: 55, w: 118, h: 95 },
      { id: "gallery", name: "Gallery Hall", area: 140, x: 752, y: 170, w: 118, h: 255 },
      { id: "utility", name: "Utility", area: 55, x: 752, y: 445, w: 56, h: 145 },
      { id: "bath", name: "Bath", area: 55, x: 814, y: 445, w: 56, h: 145 },
    ],
  },
];

export const FLOOR_NOTES = [
  "Indicative layout — final drawings on request.",
  "Sea-facing living and master suite on every floor.",
  "Cross-ventilation between the sea front and the east gallery.",
];
