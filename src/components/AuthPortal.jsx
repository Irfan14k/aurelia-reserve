import { useEffect, useState } from "react";

import { useMembers } from "../context/AuthContext";
import LuxModal from "./LuxModal";
import { SITE } from "../data/site";

const KIND_LABEL = {
  notice: "Notice",
  statement: "Statement",
  floorplan: "Floor plan",
  invite: "Invitation",
};

const shortDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

/**
 * Members portal — the private half of the experience.
 *
 * Signed out: a sign-in card (Supabase Auth, password).
 * Signed in:  the member's tier, their residence, and — for owners — the
 *             document wall from `member_documents`.
 * Unconfigured: an honest configuration notice rather than a dead form.
 */
export default function AuthPortal() {
  const {
    user,
    profile,
    tier,
    tierLabel,
    documents,
    initializing,
    loading,
    error,
    isLive,
    portalOpen,
    closePortal,
    signIn,
    signOut,
    updateProfile,
    clearError,
  } = useMembers();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (profile?.full_name) setName(profile.full_name);
  }, [profile?.full_name]);

  useEffect(() => {
    if (portalOpen) {
      setNotice(null);
      clearError();
    }
  }, [portalOpen, clearError]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setNotice(null);
    const res = await signIn({ email, password });
    if (res.ok) setPassword("");
  };

  const onSaveName = async (e) => {
    e.preventDefault();
    const res = await updateProfile({ fullName: name });
    setNotice(res.ok ? "Saved." : res.error);
  };

  const onSignOut = async () => {
    await signOut();
    setPassword("");
  };

  return (
    <LuxModal open={portalOpen} onClose={closePortal} labelledBy="portal-title" className="portal">
      <div className="portal__inner">
        <header className="portal__head">
          <p className="eyebrow">Members</p>
          <h2 className="portal__title" id="portal-title">
            {user ? <>Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.</> : "The private entrance."}
          </h2>
          <button className="portal__close" onClick={closePortal} aria-label="Close members portal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {!isLive ? (
          <div className="portal__notice" role="status">
            <h3 className="portal__notice-title">Members access is not wired up in this build.</h3>
            <p>
              Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>, run the
              migrations in <code>supabase/migrations/</code>, then rebuild. The rest of the
              experience runs unchanged without them.
            </p>
          </div>
        ) : initializing ? (
          <p className="portal__busy" role="status">Checking your session…</p>
        ) : !user ? (
          <form className="portal__form" onSubmit={onSubmit} noValidate>
            <p className="portal__lede">
              Owners and registered buyers — the tower notices, statements and
              private invitations live behind this door.
            </p>

            <div className="portal__field">
              <label className="portal__label" htmlFor="portal-email">Email</label>
              <input
                id="portal-email"
                className="portal__input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="portal__field">
              <label className="portal__label" htmlFor="portal-password">Password</label>
              <input
                id="portal-password"
                className="portal__input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="portal__error" role="alert">{error}</p>}

            <button type="submit" className="btn-lux portal__submit" disabled={loading}>
              <span className="btn-lux__sheen" aria-hidden />
              {loading ? "Signing in…" : "Enter"}
            </button>

            <p className="portal__fine">
              Demo project — create members in the Supabase dashboard
              (Authentication → Users). Enquiries from {SITE.brand} are
              attributed to your account automatically.
            </p>
          </form>
        ) : (
          <div className="portal__dash">
            <dl className="portal__meta">
              <div>
                <dt>Member</dt>
                <dd>{profile?.full_name || user.email}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt>Standing</dt>
                <dd>
                  <span className={`portal__tier${tier ? ` is-${tier}` : ""}`}>{tierLabel ?? "—"}</span>
                </dd>
              </div>
              <div>
                <dt>Member since</dt>
                <dd>{shortDate(profile?.created_at || user.created_at)}</dd>
              </div>
            </dl>

            <form className="portal__name" onSubmit={onSaveName}>
              <label className="portal__label" htmlFor="portal-name">Name on record</label>
              <div className="portal__name-row">
                <input
                  id="portal-name"
                  className="portal__input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                />
                <button type="submit" className="btn-ghost" disabled={loading}>Save</button>
              </div>
              {notice && <p className="portal__hint" role="status">{notice}</p>}
            </form>

            <section className="portal__docs" aria-label="Member documents">
              <h3 className="portal__docs-title">
                {tier === "owner" ? "From the residence office" : "Owner documents"}
              </h3>

              {tier === "owner" ? (
                documents.length ? (
                  <ul className="portal__doc-list">
                    {documents.map((d) => (
                      <li className="portal__doc" key={d.id}>
                        <span className="portal__doc-kind">{KIND_LABEL[d.kind] ?? d.kind}</span>
                        <div>
                          <h4 className="portal__doc-title">{d.title}</h4>
                          <p className="portal__doc-body">{d.body}</p>
                          <time className="portal__doc-date">{shortDate(d.published_at)}</time>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="portal__hint">Nothing published yet.</p>
                )
              ) : (
                <p className="portal__hint">
                  Owner notices open once the concierge sets your standing to owner.
                </p>
              )}
            </section>

            {error && <p className="portal__error" role="alert">{error}</p>}

            <div className="portal__foot">
              <button className="btn-ghost" onClick={onSignOut} disabled={loading}>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </LuxModal>
  );
}
