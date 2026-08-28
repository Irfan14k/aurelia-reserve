import { supabase } from "../lib/supabase/client";
import type { ResidenceRow } from "../lib/supabase/database.types";
import type { Residence } from "../types/domain";
import { demoResidences } from "../data/demoResidences";

/** Map a raw database row onto the shape the UI renders. */
export function mapResidence(row: ResidenceRow): Residence {
  return {
    id: row.id,
    n: row.numeral,
    name: row.name,
    beds: row.beds,
    size: row.size_sqft,
    availability: row.availability,
    total: row.total,
    collection: row.collection,
    desc: row.description,
    img: row.image_url ?? "/images/interior-1.jpg",
    features: row.features ?? [],
  };
}

export type ResidencesResult = {
  residences: Residence[];
  /** "live" = Supabase, "demo" = local fallback (no credentials). */
  source: "live" | "demo";
};

/**
 * Fetch published residences, ordered for display.
 * Falls back to demo data when Supabase env vars are absent.
 */
export async function fetchResidences(): Promise<ResidencesResult> {
  if (!supabase) {
    return { residences: demoResidences, source: "demo" };
  }

  const { data, error } = await supabase
    .from("residences")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);

  return { residences: (data ?? []).map(mapResidence), source: "live" };
}
