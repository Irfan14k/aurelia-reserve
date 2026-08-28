import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { fetchMyInquiries } from "../services/inquiries";
import { toMessage } from "../lib/supabase/client";
import type { Inquiry } from "../types/domain";

type Mode = "signin" | "signup";

function AuthInput({
  label,
  type,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  const filled = value.length > 0;
  return (
    <div className="relative pt-5">
      <input
        type={type}
        value={value}
        required
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="peer w-full bg-transparent border-b border-parchment/20 py-3 text-bone placeholder-transparent outline-none transition-colors focus:border-gold"
      />
      <label
        className={`absolute left-0 mono text-[0.6rem] tracking-[0.35em] uppercase transition-all duration-500 pointer-events-none ${
          filled ? "top-0 text-gold" : "top-8 text-parchment/40 peer-focus:top-0 peer-focus:text-gold"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

/**
 * Account menu. Purely additive — it never blocks browsing or enquiries.
 * Hidden entirely when Supabase credentials are absent.
 */
export default function AccountMenu({ variant = "icon" }: { variant?: "icon" | "drawer" }) {
  const { user, loading, configured, signIn, signUp, signOut } = useAuth();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inqLoading, setInqLoading] = useState(false);
  const [inqError, setInqError] = useState<string | null>(null);

  // Don't render auth UI at all without credentials
  if (!configured) return null;

  // Escape to close + lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("is-locked");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
    };
  }, [open]);

  // Load the signed-in user's own enquiries (RLS enforces ownership)
  useEffect(() => {
    if (!open || !user) return;
    let cancelled = false;
    (async () => {
      setInqLoading(true);
      setInqError(null);
      try {
        const rows = await fetchMyInquiries();
        if (!cancelled) setInquiries(rows);
      } catch (err) {
        if (!cancelled) setInqError(toMessage(err, "Could not load your enquiries."));
      } finally {
        if (!cancelled) setInqLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, user]);

  const close = () => {
    setOpen(false);
    setError(null);
    setNotice(null);
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);

    const result =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password, fullName);

    if (result.ok) {
      if (result.message) {
        setNotice(result.message);
      } else {
        setEmail("");
        setFullName("");
        close();
      }
    } else {
      setError(result.error);
    }
    setBusy(false);
  };

  const initials = (user?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <>
      <button
        data-cursor={user ? "Account" : "Sign In"}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={user ? "Account" : "Sign in"}
        className={
          variant === "drawer"
            ? "display text-5xl text-bone hover:text-gold transition-colors"
            : "w-9 h-9 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors flex items-center justify-center mono text-[0.6rem] tracking-widest"
        }
      >
        {user ? (variant === "drawer" ? "Account" : initials) : variant === "drawer" ? "Sign In" : "IN"}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Account"
          className="fixed inset-0 z-[85] bg-obsidian/90 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={close}
        >
          <div
            className="glass-strong w-full max-w-md p-8 md:p-10 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute top-4 right-5 text-parchment/60 hover:text-gold text-2xl transition-colors"
              aria-label="Close"
            >
              ×
            </button>

            {user ? (
              /* ---------------------------- Signed in ---------------------------- */
              <div>
                <div className="mono text-[0.6rem] tracking-[0.4em] uppercase text-gold mb-2">
                  Signed in
                </div>
                <div className="display text-3xl text-bone mb-1 break-all">{user.email}</div>

                <div className="mt-8 border-t border-gold/20 pt-6">
                  <div className="mono text-[0.6rem] tracking-[0.4em] uppercase text-gold mb-4">
                    Your Enquiries
                  </div>

                  {inqLoading && (
                    <div className="mono text-[0.62rem] tracking-[0.3em] uppercase text-parchment/40">
                      Loading…
                    </div>
                  )}

                  {inqError && (
                    <div className="mono text-[0.62rem] tracking-[0.2em] text-red-400/80">
                      {inqError}
                    </div>
                  )}

                  {!inqLoading && !inqError && inquiries.length === 0 && (
                    <div className="serif italic text-parchment/50 text-sm">
                      No enquiries yet.
                    </div>
                  )}

                  {!inqLoading && !inqError && inquiries.length > 0 && (
                    <ul className="space-y-3 max-h-56 overflow-y-auto pr-1">
                      {inquiries.map((q) => (
                        <li key={q.id} className="border-b border-parchment/10 pb-3">
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="serif text-bone">
                              {q.residenceName ?? "General enquiry"}
                            </span>
                            <span className="mono text-[0.55rem] tracking-[0.3em] uppercase text-gold">
                              {q.status}
                            </span>
                          </div>
                          <div className="mono text-[0.55rem] tracking-[0.25em] uppercase text-parchment/40 mt-1">
                            {new Date(q.createdAt).toLocaleDateString()}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  onClick={async () => {
                    setBusy(true);
                    await signOut();
                    setBusy(false);
                    close();
                  }}
                  disabled={busy}
                  className="btn-ghost mt-8 w-full justify-center disabled:opacity-60"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              /* ---------------------------- Signed out --------------------------- */
              <form onSubmit={handleSubmit}>
                <div className="mono text-[0.6rem] tracking-[0.4em] uppercase text-gold mb-6">
                  {mode === "signin" ? "Welcome back" : "Create account"}
                </div>

                <div className="flex gap-6 mb-6">
                  {(["signin", "signup"] as Mode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMode(m);
                        setError(null);
                        setNotice(null);
                      }}
                      className={`mono text-[0.62rem] tracking-[0.3em] uppercase pb-1 border-b transition-colors ${
                        mode === m
                          ? "text-gold border-gold"
                          : "text-parchment/40 border-transparent hover:text-parchment/80"
                      }`}
                    >
                      {m === "signin" ? "Sign In" : "Sign Up"}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {mode === "signup" && (
                    <AuthInput
                      label="Full Name"
                      type="text"
                      value={fullName}
                      onChange={setFullName}
                      autoComplete="name"
                    />
                  )}
                  <AuthInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    autoComplete="email"
                  />
                  <AuthInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                </div>

                {error && (
                  <div className="mono text-[0.6rem] tracking-[0.2em] text-red-400/90 mt-5">
                    {error}
                  </div>
                )}
                {notice && (
                  <div className="mono text-[0.6rem] tracking-[0.2em] text-gold mt-5">
                    {notice}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy || loading}
                  className="btn-gold mt-8 w-full justify-center disabled:opacity-60"
                >
                  {busy
                    ? "Please wait…"
                    : mode === "signin"
                      ? "Sign In"
                      : "Create Account"}
                </button>

                <p className="mono text-[0.55rem] tracking-[0.25em] uppercase text-parchment/35 mt-5 leading-relaxed">
                  Optional — you can browse and enquire without an account.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
