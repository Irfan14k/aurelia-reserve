import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured, toMessage } from "../lib/supabase/client";

export interface AuthResult {
  ok: boolean;
  error: string | null;
  /** Informational message, e.g. "confirm your email". */
  message?: string | null;
}

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  /** True until the initial session has been restored from storage. */
  loading: boolean;
  /** False when Supabase env vars are missing — auth UI hides itself. */
  configured: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Session is persisted by the Supabase client (localStorage) and restored on
 * mount, so a refresh keeps the user signed in. `onAuthStateChange` keeps
 * React state in sync with token refresh and sign-out from other tabs.
 *
 * This deliberately does NOT gate any content: the marketing experience stays
 * fully browsable for anonymous visitors, including submitting an enquiry.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: "Supabase is not configured." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true, error: null };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string): Promise<AuthResult> => {
      if (!supabase) return { ok: false, error: "Supabase is not configured." };

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (error) return { ok: false, error: error.message };

      // When email confirmation is on, there is no session yet.
      if (!data.session) {
        return {
          ok: true,
          error: null,
          message: "Check your inbox to confirm your email address.",
        };
      }

      return { ok: true, error: null };
    },
    [],
  );

  const signOut = useCallback(async (): Promise<AuthResult> => {
    if (!supabase) return { ok: false, error: "Supabase is not configured." };
    const { error } = await supabase.auth.signOut();
    if (error) return { ok: false, error: error.message };
    return { ok: true, error: null };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      configured: isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
    }),
    [user, session, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>.");
  return ctx;
}

/** Small helper for surfacing auth errors consistently. */
export const authErrorMessage = (e: unknown) =>
  toMessage(e, "Authentication failed. Please try again.");
