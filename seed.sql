-- ===========================================================================
-- Aurelia Reserve — seed data
--
-- Run AFTER 0001_init_schema.sql and 0002_rls_policies.sql.
-- This mirrors the residence data that was previously hardcoded in
-- src/components/Residences.tsx, so the UI looks identical after the
-- migration to Supabase.
--
-- Safe to re-run (upsert on the unique `numeral` column).
-- ===========================================================================

insert into public.residences
  (numeral, name, beds, size_sqft, availability, total, collection,
   description, image_url, features, display_order, is_published)
values
  (
    'I',
    'The Atrium',
    '3 Bedroom Residence',
    1250,
    3,
    4,
    'Luxury Collection',
    'A composition of shadow and light, opening onto a private atrium of layered greenery.',
    '/images/interior-1.jpg',
    array['Private Atrium', 'Chef''s Kitchen', 'Cinematic Balcony', 'Concierge Entry'],
    1,
    true
  ),
  (
    'II',
    'The Solene',
    '4 Bedroom Residence',
    1780,
    2,
    4,
    'Signature Collection',
    'Signature floor plates arranged around a central sunroom — an architecture of pause.',
    '/images/interior-2.jpg',
    array['Central Sunroom', 'Dual Terrace', 'Concierge Foyer', 'Sky Garden'],
    2,
    true
  ),
  (
    'III',
    'The Aureate Penthouse',
    'Penthouse',
    2650,
    1,
    2,
    'Private Collection',
    'A sky-set residence with panoramic vistas, a private pool deck and its own gilded dawn.',
    '/images/exterior-detail.jpg',
    array['Private Pool Deck', '360° Vistas', 'Bespoke Interiors', 'Owner''s Lift'],
    3,
    true
  )
on conflict (numeral) do update
set
  name          = excluded.name,
  beds          = excluded.beds,
  size_sqft     = excluded.size_sqft,
  availability  = excluded.availability,
  total         = excluded.total,
  collection    = excluded.collection,
  description   = excluded.description,
  image_url     = excluded.image_url,
  features      = excluded.features,
  display_order = excluded.display_order,
  is_published  = excluded.is_published,
  updated_at    = now();
