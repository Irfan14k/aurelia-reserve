/**
 * AURELIA — Supabase client.
 *
 * Two rules shape this file:
 *
 * 1. The experience must keep working — and keep building — with no Supabase
 *    project attached. Every consumer checks `isSupabaseConfigured` first and
 *    falls back to the bundled static data in `src/data/*`.
 * 2. The SDK must stay out of the critical path. `@supabase/supabase-js` is
 *    pulled in with a dynamic import inside `loadSupabase()`, so Rollup emits
 *    it as its own chunk that the browser never fetches unless both env vars
 *    are set. Initial JS stays at its ≈77 KB gz budget.
 *
 * Vite inlines `import.meta.env.VITE_*` at build time, so on Vercel these two
 * variables are all that is required (Settings → Environment Variables):
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 *
 * The anon key is a *public* publishable key — it is safe to ship in the
 * bundle. Access is enforced by Row Level Security, never by key secrecy.
 * The `service_role` key must never appear here.
 */

const url = import.meta.env.VITE_SUPABASE_URL?.trim() || "";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || "";

/** True only when both variables are present and the URL is well-formed. */
export const isSupabaseConfigured =
  /^https?:\/\/.+/i.test(url) && anonKey.length > 0;

/**
 * Lazily-created singleton promise. Resolves to `null` when unconfigured, so
 * a missing env can never throw — and the SDK chunk is never requested.
 * @type {Promise<import("@supabase/supabase-js").SupabaseClient | null> | null}
 */
let clientPromise = null;

/**
 * @returns {Promise<import("@supabase/supabase-js").SupabaseClient | null>}
 */
export function loadSupabase() {
  if (!isSupabaseConfigured) return Promise.resolve(null);

  if (!clientPromise) {
    clientPromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: "aurelia-members-auth",
        },
      })
    );
  }

  return clientPromise;
}

export default loadSupabase;
