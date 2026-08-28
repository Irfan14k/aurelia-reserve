# Supabase Setup — Aurelia Reserve

All application code is implemented and building. Supabase is **not connected yet** because
the project credentials do not exist. Follow these steps to connect it.

---

## 1. Create the project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Choose a region close to your users.
3. Generate and **save** the database password (shown once).

---

## 2. Copy credentials

Supabase Dashboard → **Project Settings → API**

| Value | Where |
|---|---|
| `Project URL` | `VITE_SUPABASE_URL` |
| `anon` / `public` key | `VITE_SUPABASE_ANON_KEY` |

> ⚠️ Use **only** the anon key. The `service_role` key bypasses Row Level Security and must
> never be placed in `.env` or any frontend file.

Create `.env` in the project root:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Restart `npm run dev` afterwards — Vite only reads env vars at startup.

---

## 3. Run the schema

Dashboard → **SQL Editor → New query**

Run these **in this order**:

1. `supabase/migrations/0001_init_schema.sql`
2. `supabase/migrations/0002_rls_policies.sql`
3. `supabase/seed.sql`

Both migration files are idempotent — safe to re-run.

---

## 4. Configure Auth

Dashboard → **Authentication → Providers** → Email is enabled by default.

Recommended for a demo:

- Turn **off** "Confirm email" so sign-up logs the user in immediately.
  - If you leave it **on**, the UI already handles it — it shows
    *"Check your inbox to confirm your email address."*
- Dashboard → **Authentication → URL Configuration**:
  - `Site URL` → `http://localhost:5173` (dev) or your production domain
  - Add `http://localhost:5173/**` to **Redirect URLs**

---

## 5. Verify RLS

Run in the SQL Editor:

```sql
select tablename, rowsecurity
  from pg_tables
 where schemaname = 'public';
```

Expect `rowsecurity = true` for `profiles`, `residences`, `inquiries`.

```sql
select tablename, policyname, cmd, roles
  from pg_policies
 where schemaname = 'public'
 order by tablename;
```

Expect exactly five policies:

| Table | Policy | Command |
|---|---|---|
| residences | `residences_public_read` | SELECT |
| profiles | `profiles_select_own` | SELECT |
| profiles | `profiles_update_own` | UPDATE |
| inquiries | `inquiries_insert_public` | INSERT |
| inquiries | `inquiries_select_own` | SELECT |

### Confirm anonymous users cannot read enquiries

Dashboard → **Authentication → Policies** or run with the anon key:

```sql
set local role anon;
select * from public.inquiries;   -- must return 0 rows
select * from public.profiles;    -- must return 0 rows
select * from public.residences;  -- returns published rows only
```

---

## 6. Verify in the browser

1. `npm run dev`
2. **Residences section** — three residences load from `public.residences`.
   Edit a row in the Table Editor (e.g. change `availability`) and refresh: the UI updates.
   The "Demo data · Supabase not configured" badge must be **gone**.
3. **Contact form** — submit an enquiry →
   check **Table Editor → inquiries** for the new row.
   - Signed out → `user_id` is `NULL`
   - Signed in → `user_id` is your auth user id
4. **Auth** — the `IN` button appears top-right.
   - Sign up → sign in → refresh the page → still signed in (session persisted)
   - Open the account panel → "Your Enquiries" lists only your own rows
   - Sign out

---

## What was built

| Layer | File |
|---|---|
| Client | `src/lib/supabase/client.ts` |
| Typed schema | `src/lib/supabase/database.types.ts` |
| Domain types | `src/types/domain.ts` |
| Residences service | `src/services/residences.ts` |
| Inquiries service | `src/services/inquiries.ts` |
| Profiles service | `src/services/profiles.ts` |
| Residences hook | `src/hooks/useResidences.ts` |
| Inquiry hook | `src/hooks/useInquiry.ts` |
| Auth provider + hook | `src/context/AuthProvider.tsx` |
| Auth UI | `src/components/AccountMenu.tsx` |
| Demo fallback | `src/data/demoResidences.ts` |

### Demo mode

Without `.env`, the app still runs: residences render from `demoResidences`, the auth UI hides
itself, and the contact form simulates a submission. The Residences section shows a
**"Demo data · Supabase not configured"** badge so the state is never ambiguous.

### Security notes

- RLS is **enabled on all three tables** and never disabled.
- Enquiries are insertable by anonymous visitors, but **not readable** by any client —
  staff read them with the service-role key from a trusted environment.
- Clients cannot `UPDATE` or `DELETE` enquiries, preserving the audit trail.
- Clients cannot write to `residences` at all.
- Users can only read/update their own `profiles` row.
