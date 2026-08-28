/**
 * Application-level domain types.
 *
 * These are the shapes the UI consumes. They are deliberately decoupled from
 * the raw database row shapes so a schema change only touches the mappers in
 * src/services/*, never the presentation components.
 */

/** A residence as rendered by the Residences section. */
export interface Residence {
  id: string;
  /** Roman numeral shown in the selector, e.g. "I", "II", "III". */
  n: string;
  name: string;
  /** Human-readable configuration, e.g. "4 Bedroom Residence". */
  beds: string;
  /** Interior area in square feet. */
  size: number;
  /** Units still available. */
  availability: number;
  /** Total units in this residence type. */
  total: number;
  collection: string;
  desc: string;
  img: string;
  features: string[];
}

/** Payload for a reservation / enquiry submission. */
export interface InquiryInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  /** Residence id, when the visitor selected one. */
  residenceId?: string | null;
  /** Provenance of the lead, e.g. "contact-section". */
  source?: string;
}

export type InquiryStatus = "new" | "contacted" | "qualified" | "closed";

/** An enquiry as returned to an authenticated user viewing their own records. */
export interface Inquiry {
  id: string;
  status: InquiryStatus;
  residenceId: string | null;
  residenceName: string | null;
  message: string | null;
  createdAt: string;
}

/** Minimal user profile stored in public.profiles. */
export interface Profile {
  id: string;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
}
