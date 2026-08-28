-- ===========================================================================
-- Aurelia Reserve — Row Level Security
--
-- RLS is ENABLED on every table. Nothing is left open.
-- Run AFTER 0001_init_schema.sql.
-- ===========================================================================

alter table public.profiles   enable row level security;
alter table public.residences enable row level security;
alter table public.inquiries  enable row level security;

-- ---------------------------------------------------------------------------
-- residences — public marketing catalogue.
-- Anyone (anonymous included) may read PUBLISHED rows. No client may write.
-- Writes are performed with the service-role key from a trusted environment.
-- ---------------------------------------------------------------------------
drop policy if exists "residences_public_read" on public.residences;
create policy "residences_public_read"
  on public.residences
  for select
  to anon, authenticated
  using (is_published = true);

-- No INSERT / UPDATE / DELETE policy is created for residences.
-- With RLS enabled and no policy, clients are denied by default. ✔

-- ---------------------------------------------------------------------------
-- profiles — strictly private to their owner.
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No INSERT policy: profiles are created by the handle_new_user() trigger
-- (security definer), which bypasses RLS.
-- No DELETE policy: users cannot delete their own profile from the client.

-- ---------------------------------------------------------------------------
-- inquiries — public visitors can ENQUIRE; nobody can read others' records.
-- ---------------------------------------------------------------------------

-- Anonymous visitors MUST be able to submit an enquiry (no login wall).
-- They may only create rows that are either unowned or owned by themselves,
-- which prevents spoofing another user's user_id.
drop policy if exists "inquiries_insert_public" on public.inquiries;
create policy "inquiries_insert_public"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (
    user_id is null
    or user_id = auth.uid()
  );

-- A signed-in user may read ONLY the enquiries they submitted.
-- Anonymous submissions (user_id is null) are intentionally not readable
-- by the client — they are retrieved with the service-role key by staff.
drop policy if exists "inquiries_select_own" on public.inquiries;
create policy "inquiries_select_own"
  on public.inquiries
  for select
  to authenticated
  using (auth.uid() = user_id);

-- No UPDATE / DELETE policy: clients cannot mutate or erase enquiries,
-- which protects the audit trail. Staff use the service-role key.

-- ===========================================================================
-- Verification queries (run these in the SQL editor and confirm results)
-- ===========================================================================
-- select tablename, rowsecurity
--   from pg_tables
--  where schemaname = 'public';
--   → expect rowsecurity = true for profiles, residences, inquiries
--
-- select tablename, policyname, cmd
--   from pg_policies
--  where schemaname = 'public'
--  order by tablename, policyname;
--   → expect exactly the five policies created above
-- ===========================================================================
