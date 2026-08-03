/**
 * Location — a stylised, fictional concept map (viewBox 0 0 900 640).
 * Every place name, route and travel time is invented for demonstration.
 * No real city, district, landmark or property is referenced.
 */
export const MAP = {
  viewBox: "0 0 900 640",
  sea: "M0 0 H330 C250 120 210 220 230 330 C250 440 210 520 160 640 H0 Z",
  land: "M330 0 C380 60 420 140 390 230 C360 320 430 400 520 400 C640 400 700 470 690 560 C685 610 720 630 760 640 H900 V0 Z",
  landAlt: "M330 0 C380 60 420 140 390 230 C360 320 430 400 520 400 C640 400 700 470 690 560 C685 610 720 630 760 640 H900 V0 Z",
  contours: [
    "M350 40 C420 90 430 170 400 260",
    "M400 300 C480 360 580 370 650 430",
    "M360 420 C430 470 520 490 600 560",
    "M250 180 C300 230 290 300 260 360",
  ],
  roads: [
    { d: "M290 640 C300 520 330 440 400 400 C500 350 560 280 600 200 C630 140 680 100 760 70", label: "Harbour Link" },
    { d: "M360 0 C370 120 420 220 520 260 C640 300 720 420 760 640", label: "Western Corridor" },
    { d: "M210 640 C240 560 260 480 330 440 C400 400 480 430 560 470", label: "Coastal Route" },
  ],
  pois: [
    { id: "aurelia", x: 312, y: 302, name: "Aurelia Reserve", note: "The concept residence — where the experience begins.", tag: "You are here" },
    { id: "oldtown", x: 236, y: 470, name: "Old Town", note: "The cultural heart of the city.", time: 12 },
    { id: "biz", x: 588, y: 168, name: "Business District", note: "Eighteen minutes of calm, then the city.", time: 18 },
    { id: "airport", x: 782, y: 92, name: "International Airport", note: "A straight run east. Thirty-two minutes, door to gate.", time: 32 },
    { id: "culture", x: 452, y: 420, name: "Cultural Quarter", note: "Galleries, concert halls and the weekend.", time: 9 },
  ],
  routes: [
    {
      id: "airport",
      name: "To the Airport",
      time: 32,
      distance: "26 km",
      note: "Eastern corridor — light traffic after 10 am.",
      d: "M312 302 C340 300 380 250 440 210 C500 170 560 150 640 130 C690 118 730 100 782 92",
    },
    {
      id: "biz",
      name: "To the Business District",
      time: 18,
      distance: "11 km",
      note: "The north expressway, straight through.",
      d: "M312 302 C360 290 430 240 500 200 C530 182 560 172 588 168",
    },
    {
      id: "oldtown",
      name: "To the Old Town",
      time: 12,
      distance: "7 km",
      note: "Along the coast, past the waterfront curve.",
      d: "M312 302 C290 330 270 380 250 430 C244 448 240 460 236 470",
    },
    {
      id: "culture",
      name: "To the Cultural Quarter",
      time: 9,
      distance: "6 km",
      note: "Two turns and a glimpse of the water.",
      d: "M312 302 C340 330 380 370 420 400 C436 412 444 416 452 420",
    },
  ],
};
