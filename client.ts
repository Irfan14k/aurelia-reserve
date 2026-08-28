import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * True only when both env vars are present.
 * The app degrades gracefully (clearly-labelled demo data) when this is false,
 * so the site never white-screens on a machine without credentials.
 */
export const isSupabaseConfigured: boolean = Boolean(url && anonKey);

/**
 * The single shared Supabase client instance.
 *
 * Only the anon (public) key is ever used here. The service-role key must
 * never appear in frontend code — it bypasses Row Level Security entirely.
 */
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "aurelia-reserve-auth",
      },
    })
  : null;

/** Thrown by services when a DB call is attempted without configuration. */
export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env",
    );
    this.name = "SupabaseNotConfiguredError";
  }
}

/** Narrow the nullable client, throwing a helpful error when unavailable. */
export function requireSupabase(): SupabaseClient<Database> {
  if (!supabase) throw new SupabaseNotConfiguredError();
  return supabase;
}

/** Turn any thrown value into a user-presentable message. */
export function toMessage(err: unknown, fallback = "Something went wrong"): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return fallback;
}
