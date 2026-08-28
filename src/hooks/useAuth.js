import { useCallback, useEffect, useRef, useState } from "react";

import { loadSupabase, isSupabaseConfigured } from "../lib/supabase";

const TIER_LABEL = {
  prospect: "Prospect",
  registered: "Registered buyer",
  owner: "Owner",
};

/**
 * Members authentication — Supabase Auth plus the member's own profile.
 *
 * Session state comes from `onAuthStateChange`, so a refresh, a magic-link
 * redirect, or a sign-out in another tab all land here. The profile row is
 * re-read whenever the session changes and is always scoped by RLS to
 * `id = auth.uid()`.
 *
 * Returns `isLive: false` when Supabase is unconfigured; the portal then shows
 * a configuration notice instead of a broken sign-in form.
 */
export function useAuth() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [initializing, setInitializing] = useState(isSupabaseConfigured);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadProfile = useCallback(async (uid) => {
    const db = await loadSupabase();
    if (!db || !uid) {
      setProfile(null);
      setDocuments([]);
      return;
    }

    const { data, error: profileError } = await db
      .from("member_profiles")
      .select("id, full_name, email, tier, residence_id, created_at")
      .eq("id", uid)
      .maybeSingle();

    if (!mounted.current) return;

    if (profileError) {
      console.warn("[aurelia] member profile load failed:", profileError.message);
      setProfile(null);
      setDocuments([]);
      return;
    }

    setProfile(data ?? null);

    // Owner-only layer — RLS returns an empty set for anyone else.
    if (data?.tier === "owner") {
      const { data: docs, error: docsError } = await db
        .from("member_documents")
        .select("id, title, kind, body, published_at")
        .order("published_at", { ascending: false });

      if (mounted.current && !docsError) setDocuments(docs ?? []);
    } else {
      setDocuments([]);
    }
  }, []);

  // Bootstrap the session and keep it in sync for the lifetime of the app.
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setInitializing(false);
      return;
    }

    let unsubscribed = false;
    let sub = null;

    loadSupabase().then((db) => {
      if (unsubscribed || !db) return;

      db.auth.getSession().then(({ data }) => {
        if (unsubscribed || !mounted.current) return;
        setSession(data.session);
        setInitializing(false);
        if (data.session?.user) loadProfile(data.session.user.id);
      });

      const { data } = db.auth.onAuthStateChange((_event, nextSession) => {
        if (!mounted.current) return;
        setSession(nextSession);
        setInitializing(false);
        if (nextSession?.user) loadProfile(nextSession.user.id);
        else {
          setProfile(null);
          setDocuments([]);
        }
      });
      sub = data.subscription;
    });

    return () => {
      unsubscribed = true;
      sub?.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async ({ email, password }) => {
    const db = await loadSupabase();
    if (!db) {
      setError("Supabase is not configured for this build.");
      return { ok: false, error: "Supabase is not configured for this build." };
    }
    if (!email || !password) {
      const msg = "Email and password are required.";
      setError(msg);
      return { ok: false, error: msg };
    }

    setLoading(true);
    setError(null);
    const { error: signInError } = await db.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return { ok: false, error: signInError.message };
    }
    return { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    const db = await loadSupabase();
    if (!db) return { ok: false };
    setLoading(true);
    const { error: outError } = await db.auth.signOut();
    setLoading(false);
    if (outError) {
      setError(outError.message);
      return { ok: false, error: outError.message };
    }
    return { ok: true };
  }, []);

  const updateProfile = useCallback(async ({ fullName }) => {
    const db = await loadSupabase();
    if (!db || !session?.user) return { ok: false, error: "Not signed in." };

    setLoading(true);
    const { error: updateError } = await db
      .from("member_profiles")
      .update({ full_name: String(fullName ?? "").trim() })
      .eq("id", session.user.id);
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return { ok: false, error: updateError.message };
    }
    await loadProfile(session.user.id);
    return { ok: true };
  }, [session, loadProfile]);

  const user = session?.user ?? null;
  const tier = profile?.tier ?? null;

  return {
    session,
    user,
    profile,
    tier,
    tierLabel: TIER_LABEL[tier] ?? null,
    documents,
    initializing,
    loading,
    error,
    isLive: isSupabaseConfigured,
    signIn,
    signOut,
    updateProfile,
    refreshProfile: () => loadProfile(user?.id),
    clearError: () => setError(null),
  };
}
