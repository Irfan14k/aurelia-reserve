import { supabase } from "../lib/supabase/client";
import type { Inquiry, InquiryInput } from "../types/domain";

/**
 * Insert a reservation / enquiry.
 *
 * Works for BOTH anonymous visitors and signed-in users: the row's user_id is
 * set to the current user when there is one, otherwise left NULL.
 * RLS policy "inquiries_insert_public" permits this for anon + authenticated.
 */
export async function submitInquiry(input: InquiryInput): Promise<void> {
  if (!supabase) {
    // Demo mode — no backend. Simulate network latency so the loading,
    // success and error states are all exercised realistically.
    await new Promise((resolve) => setTimeout(resolve, 900));
    return;
  }

  // Anonymous visitors have no session — resolve the id defensively so the
  // public enquiry path can never fail on auth lookup.
  let userId: string | null = null;
  try {
    const { data: userData } = await supabase.auth.getUser();
    userId = userData?.user?.id ?? null;
  } catch {
    userId = null;
  }

  const { error } = await supabase.from("inquiries").insert({
    residence_id: input.residenceId ?? null,
    user_id: userId,
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    message: input.message?.trim() || null,
    source: input.source ?? "website",
  });

  if (error) throw new Error(error.message);
}

/**
 * Enquiries belonging to the signed-in user.
 * RLS policy "inquiries_select_own" restricts this to the caller's own rows.
 */
export async function fetchMyInquiries(): Promise<Inquiry[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("inquiries")
    .select(
      `
      id,
      status,
      residence_id,
      message,
      created_at,
      residences ( name )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const residence = row.residences as unknown as { name: string } | null;
    return {
      id: row.id,
      status: row.status,
      residenceId: row.residence_id,
      residenceName: residence?.name ?? null,
      message: row.message,
      createdAt: row.created_at,
    };
  });
}
