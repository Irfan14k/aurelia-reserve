/**
 * Centralized site configuration.
 *
 * This is the single place to swap demo content for real client content.
 * Leave a value as `null` and the UI degrades gracefully (the control becomes
 * a non-navigating, clearly-labelled placeholder) instead of a broken link.
 */

export const site = {
  brand: {
    name: "Aurelia Reserve",
    tagline: "Where Silence Meets Opulence",
    category: "Luxury Real Estate Experience",
    badge: "Concept Demo",
  },

  contact: {
    /** E.164 without spaces, e.g. "+971500000000" */
    phone: null as string | null,
    /** E.164 without spaces, e.g. "+971500000000" */
    whatsapp: null as string | null,
    email: null as string | null,
    address: null as string | null,
  },

  social: {
    instagram: null as string | null,
    behance: null as string | null,
    dribbble: null as string | null,
    linkedin: null as string | null,
  },

  isDemo: true,
} as const;

/** Build a tel: href, or null when unconfigured. */
export const telHref = (n: string | null) => (n ? `tel:${n.replace(/\s/g, "")}` : null);

/** Build a wa.me href, or null when unconfigured. */
export const waHref = (n: string | null, message?: string) =>
  n ? `https://wa.me/${n.replace(/[^\d]/g, "")}${message ? `?text=${encodeURIComponent(message)}` : ""}` : null;

/** Build a mailto: href, or null when unconfigured. */
export const mailHref = (e: string | null) => (e ? `mailto:${e}` : null);
