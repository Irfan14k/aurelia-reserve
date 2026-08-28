-- ============================================================
-- AURELIA RESERVE — initial schema
-- Public residences catalogue, private-enquiry inbox, and the
-- members-only content layer.
--
-- Applied with:  supabase db push      (or paste into the SQL editor)
-- Idempotent: every statement uses IF NOT EXISTS / OR REPLACE.
-- ============================================================

create extension if not exists "pgcrypto";

-- ——— Public catalogue ————————————————————————————————————————
-- Backs src/hooks/useResidences.js, which falls back to
-- src/data/residences.js when Supabase is not attached.
create table if not exists public.residences (
  id           text primary key,
  position     integer not null default 100,
  name         text not null,
  tag          text not null default '',
  beds         text not null default '',
  area         integer not null default 0,        -- internal area, sq ft
  price        numeric(10, 2) not null default 0, -- indicative price, ₹ Cr
  remaining    integer not null default 0,
  image        text not null default '',
  blurb        text not null default '',
  features     jsonb not null default '[]'::jsonb, -- text[] as JSON for portability
  aspect       text not null default '',
  terrace      text not null default '',
  lift         text not null default '',
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.residences is
  'Public residence catalogue. Read by the marketing site; remaining is the live availability counter.';

create index if not exists residences_position_idx
  on public.residences (position) where is_published;

-- ——— Private enquiry inbox ———————————————————————————————————
-- Written by src/hooks/useEnquiry.js from the Contact form.
create table if not exists public.enquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  phone        text not null,
  residence_id text references public.residences (id) on delete set null,
  message      text not null default '',
  source       text not null default 'website',
  member_id    uuid,                              -- set when a signed-in member submits
  status       text not null default 'new'
               check (status in ('new', 'contacted', 'viewing_booked', 'closed', 'spam')),
  created_at   timestamptz not null default now(),
  constraint enquiries_email_shape check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint enquiries_phone_shape check (char_length(phone) between 7 and 20)
);

comment on table public.enquiries is
  'Private-viewing requests. Anonymously insertable by the public, readable only by the concierge.';

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx on public.enquiries (status) where status = 'new';

-- ——— Members layer ——————————————————————————————————————————
-- Profiles are keyed to auth.users and populated by the trigger below.
create table if not exists public.member_profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '',
  email       text not null default '',
  tier        text not null default 'prospect'
              check (tier in ('prospect', 'registered', 'owner')),
  residence_id text references public.residences (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.member_profiles is
  'Public profile of a signed-in member. Owners additionally see member_documents.';

-- Documents are gated to owners via RLS (see the next migration).
create table if not exists public.member_documents (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  kind         text not null default 'notice',  -- notice | statement | floorplan | invite
  body         text not null default '',
  residence_id text references public.residences (id) on delete set null,
  published_at timestamptz not null default now()
);

comment on table public.member_documents is
  'Owner-only notices and statements. No SELECT for the public role.';

-- ——— updated_at bookkeeping ———————————————————————————————————
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists residences_touch_updated_at on public.residences;
create trigger residences_touch_updated_at
  before update on public.residences
  for each row execute function public.touch_updated_at();

drop trigger if exists member_profiles_touch_updated_at on public.member_profiles;
create trigger member_profiles_touch_updated_at
  before update on public.member_profiles
  for each row execute function public.touch_updated_at();

-- ——— Keep member_profiles in step with auth.users —————————————
create or replace function public.handle_new_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.member_profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_member();
