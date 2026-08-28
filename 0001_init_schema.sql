-- ===========================================================================
-- Aurelia Reserve — initial schema
-- Run in Supabase Dashboard → SQL Editor (or via supabase db push)
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / DO blocks.
-- ===========================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Shared trigger: keep updated_at fresh
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Enum for enquiry lifecycle
-- ---------------------------------------------------------------------------
do $$
begin
  create type public.inquiry_status as enum ('new', 'contacted', 'qualified', 'closed');
exception
  when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- profiles — public mirror of auth.users (never expose auth.users directly)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  phone       text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- residences — the three residences rendered by the Residences section
-- ---------------------------------------------------------------------------
create table if not exists public.residences (
  id            uuid primary key default gen_random_uuid(),
  numeral       text not null unique,          -- 'I' | 'II' | 'III'
  name          text not null,
  beds          text not null,                 -- '4 Bedroom Residence'
  size_sqft     integer not null check (size_sqft > 0),
  availability  integer not null default 0 check (availability >= 0),
  total         integer not null default 0 check (total >= 0),
  collection    text not null,                 -- 'Signature Collection'
  description   text not null default '',
  image_url     text,
  features      text[] not null default '{}',
  display_order integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint residences_availability_lte_total check (availability <= total)
);

-- ---------------------------------------------------------------------------
-- inquiries — reservation / contact submissions
-- user_id is nullable so anonymous visitors can still enquire.
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id           uuid primary key default gen_random_uuid(),
  residence_id uuid references public.residences (id) on delete set null,
  user_id      uuid references auth.users (id) on delete set null,
  first_name   text not null,
  last_name    text not null,
  email        text not null,
  phone        text,
  message      text,
  status       public.inquiry_status not null default 'new',
  source       text not null default 'website',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists residences_display_order_idx
  on public.residences (display_order);

create index if not exists residences_published_idx
  on public.residences (is_published) where is_published = true;

create index if not exists inquiries_residence_id_idx
  on public.inquiries (residence_id);

create index if not exists inquiries_user_id_idx
  on public.inquiries (user_id) where user_id is not null;

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

create index if not exists inquiries_email_idx
  on public.inquiries (email);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists residences_set_updated_at on public.residences;
create trigger residences_set_updated_at
  before update on public.residences
  for each row execute function public.set_updated_at();

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at
  before update on public.inquiries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever a user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
