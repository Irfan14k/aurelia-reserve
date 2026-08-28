import { supabase } from "../lib/supabase/client";
import type { Profile } from "../types/domain";

/**
 * Fetch the signed-in user's own profile row.
 * RLS policy "profiles_select_own" guarantees only their row is returned.
 */
export async function fetchMyProfile(): Promise<Profile | null> {
  if (!supabase) return null;

  let userId: string | null = null;
  try {
    const { data: userData } = await supabase.auth.getUser();
    userId = userData?.user?.id ?? null;
  } catch {
    userId = null;
  }
  if (!userId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    phone: data.phone,
    avatarUrl: data.avatar_url,
  };
}

/** Update the signed-in user's own profile (RLS restricts to own row). */
export async function updateMyProfile(patch: {
  fullName?: string | null;
  phone?: string | null;
}): Promise<void> {
  if (!supabase) return;

  let userId: string | null = null;
  try {
    const { data: userData } = await supabase.auth.getUser();
    userId = userData?.user?.id ?? null;
  } catch {
    userId = null;
  }
  if (!userId) return;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: patch.fullName ?? undefined,
      phone: patch.phone ?? undefined,
    })
    .eq("id", userId);

  if (error) throw new Error(error.message);
}
