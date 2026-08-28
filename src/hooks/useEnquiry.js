import { useCallback, useState } from "react";

import { loadSupabase, isSupabaseConfigured } from "../lib/supabase";

/**
 * Private-enquiry submission.
 *
 * Inserts one row into `public.enquiries` under an INSERT-only RLS policy —
 * the caller can never read the inbox back, only add to it.
 *
 * When Supabase is not attached the hook still resolves `"sent"` after a short
 * simulated delay, preserving the concept demo's success animation. `stored`
 * distinguishes the two cases for the UI.
 *
 * @param {{ memberId?: string|null, source?: string }} options
 * @returns {{
 *   submit: (payload: {name:string,email:string,phone:string,residenceId?:string,message?:string})
 *     => Promise<{ok:boolean, stored:boolean, error?:string}>,
 *   status: "idle"|"sending"|"sent"|"error", error: string|null
 * }}
 */
export function useEnquiry({ memberId = null, source = "website" } = {}) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const submit = useCallback(
    async (payload) => {
      const name = String(payload?.name ?? "").trim();
      const email = String(payload?.email ?? "").trim();
      const phone = String(payload?.phone ?? "").trim();
      const message = String(payload?.message ?? "").slice(0, 1000);
      const residenceId = payload?.residenceId || null;

      if (!name || !email || !phone) {
        const msg = "Name, email and phone are required.";
        setStatus("error");
        setError(msg);
        return { ok: false, stored: false, error: msg };
      }

      setStatus("sending");
      setError(null);

      const db = await loadSupabase();

      // No backend attached — simulate, so the demo animation still lands.
      if (!db) {
        await new Promise((r) => setTimeout(r, 1200));
        setStatus("sent");
        return { ok: true, stored: false };
      }

      const row = {
        name,
        email,
        phone,
        message,
        residence_id: residenceId,
        member_id: memberId ?? null,
        source,
      };

      const { error: insertError } = await db.from("enquiries").insert(row);

      if (insertError) {
        console.warn("[aurelia] enquiry insert failed:", insertError.message);
        setStatus("error");
        setError(insertError.message);
        return { ok: false, stored: false, error: insertError.message };
      }

      setStatus("sent");
      return { ok: true, stored: true };
    },
    [memberId, source]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { submit, status, error, reset, isLive: isSupabaseConfigured };
}
