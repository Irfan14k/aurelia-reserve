-- ============================================================
-- AURELIA RESERVE — seed
-- Mirrors src/data/residences.js exactly, so the static fallback and the
-- database render identical cards. Safe to re-run (ON CONFLICT DO UPDATE).
-- All content is fictional — see README.
-- ============================================================

insert into public.residences
  (id, position, name, tag, beds, area, price, remaining, image, blurb, features, aspect, terrace, lift)
values
  (
    'sky', 10, 'The Sky Residence', 'Signature', '4 Bed', 4850, 18.40, 3,
    '/images/opt/residence-1.jpg',
    'A corner residence wrapped in glass — the sea on two sides, the city on the third. A 90 sq m living salon, private lift lobby, and a master suite with its own dressing room and sea-view bath.',
    '["Private lift lobby", "90 m² living salon", "Sea-view master bath", "Dedicated study"]'::jsonb,
    'Sea · 270°', '18 m² sky terrace', 'Yes'
  ),
  (
    'garden', 20, 'The Garden Terrace', 'Collection', '3 Bed', 3120, 9.60, 7,
    '/images/opt/residence-2.jpg',
    'A residence that opens like a courtyard — every room gives onto a planted terrace. Evening light on teak, the city glowing below, and enough sky to call your own.',
    '["260 sq ft planted terrace", "Open-plan living", "Outdoor dining deck", "Sunrise kitchen"]'::jsonb,
    'Sea · City', '260 sq ft planted', 'Dedicated lift lobby'
  ),
  (
    'atelier', 30, 'The Atelier', 'Loft Collection', '3 Bed', 2460, 8.20, 5,
    '/images/opt/residence-3.jpg',
    'Walnut, brass and a wall of sea. The Atelier is the quietest residence in the tower — a study, a library, a place where work and stillness share a room.',
    '["Walnut library wall", "Brass detailing", "Chef''s kitchen", "City & sea aspect"]'::jsonb,
    'Sea · West', 'Balcony 12 m²', 'Shared (2 per floor)'
  )
on conflict (id) do update set
  position  = excluded.position,
  name      = excluded.name,
  tag       = excluded.tag,
  beds      = excluded.beds,
  area      = excluded.area,
  price     = excluded.price,
  remaining = excluded.remaining,
  image     = excluded.image,
  blurb     = excluded.blurb,
  features  = excluded.features,
  aspect    = excluded.aspect,
  terrace   = excluded.terrace,
  lift      = excluded.lift,
  updated_at = now();

-- ——— A couple of owner-facing documents for the members portal —————
insert into public.member_documents (title, kind, body, published_at)
values
  (
    'Tower topping-out — 14 March',
    'notice',
    'The structural frame reached the thirty-eighth floor this morning. Cladding to the west elevation follows in April; the sky lounge shell completes before the monsoon.',
    now() - interval '12 days'
  ),
  (
    'Q1 service charge statement',
    'statement',
    'Quarterly statement for common-area maintenance, concierge staffing, wellness operations and the marine-facility sinking fund. Figures are indicative and fictional.',
    now() - interval '30 days'
  ),
  (
    'Private preview of the wellness floor',
    'invite',
    'Owners are invited to walk the wellness floor before it opens — thermal suite, cold plunge, and the 25 m sea-facing lap pool — on the second Saturday of next month, from dusk.',
    now() - interval '3 days'
  )
on conflict (id) do nothing;
