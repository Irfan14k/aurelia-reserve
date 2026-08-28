-- ============================================================
-- AURELIA RESERVE — Row Level Security
--
-- The anon key ships inside the public bundle, so *these policies are the
-- only authorisation boundary*. Rules applied:
--   residences       — public read, no public write
--   enquiries        — public INSERT (no read-back, no update, no delete)
--   member_profiles  — a member reads and edits only their own row
--   member_documents — owners only
-- ============================================================

alter table public.residences       enable row level security;
alter table public.enquiries        enable row level security;
alter table public.member_profiles  enable row level security;
alter table public.member_documents enable row level security;

-- ——— residences ————————————————————————————————————————————
drop policy if exists residences_public_read on public.residences;
create policy residences_public_read
  on public.residences
  for select
  to anon, authenticated
  using (is_published = true);

-- ——— enquiries —————————————————————————————————————————————
-- The public may hand a note to the concierge but never read the inbox:
-- an INSERT-only policy with no matching SELECT closes the enumeration hole.
drop policy if exists enquiries_public_insert on public.enquiries;
create policy enquiries_public_insert
  on public.enquiries
  for insert
  to anon
  with check (
    char_length(name) between 1 and 120
    and char_length(message) <= 1000
    and member_id is null
  );

-- A signed-in member may insert on their own behalf.
drop policy if exists enquiries_member_insert on public.enquiries;
create policy enquiries_member_insert
  on public.enquiries
  for insert
  to authenticated
  with check (
    char_length(name) between 1 and 120
    and char_length(message) <= 1000
    and (member_id is null or member_id = auth.uid())
  );

-- Members can read back only their own submissions.
drop policy if exists enquiries_own_read on public.enquiries;
create policy enquiries_own_read
  on public.enquiries
  for select
  to authenticated
  using (member_id = auth.uid());

-- ——— member_profiles ———————————————————————————————————————
drop policy if exists profiles_own_select on public.member_profiles;
create policy profiles_own_select
  on public.member_profiles
  for select
  to authenticated
  using (id = auth.uid());

drop policy if exists profiles_own_update on public.member_profiles;
create policy profiles_own_update
  on public.member_profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    -- tier and residence_id are granted by the concierge, never self-served
    and tier = (select tier from public.member_profiles where id = auth.uid())
    and coalesce(residence_id, '00000000-0000-0000-0000-000000000000') =
        coalesce((select residence_id from public.member_profiles where id = auth.uid()),
                 '00000000-0000-0000-0000-000000000000')
  );

-- ——— member_documents ——————————————————————————————————————
-- Owners read everything published; nobody writes from the client.
drop policy if exists documents_owner_read on public.member_documents;
create policy documents_owner_read
  on public.member_documents
  for select
  to authenticated
  using (
    exists (
      select 1 from public.member_profiles mp
      where mp.id = auth.uid() and mp.tier = 'owner'
    )
  );

-- ——— Concierge access ——————————————————————————————————————
-- Granted to the human role you sign in with in the Supabase dashboard
-- (or via a `concierge` claim). Adjust the role name to your project.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'concierge') then
    create role concierge nologin;
  end if;
end
$$;

drop policy if exists enquiries_concierge_all on public.enquiries;
create policy enquiries_concierge_all
  on public.enquiries
  for all
  to concierge
  using (true)
  with check (true);
