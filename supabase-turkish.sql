-- ============================================================
-- TURKISH: lets news, events and gallery items be saved in Turkish
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- It is safe to run more than once. Until you run it, everything still saves,
-- but the Turkish text is left out (the site then shows English to Turkish visitors).
-- ============================================================

alter table public.posts   add column if not exists title_tr text;
alter table public.posts   add column if not exists content_tr text;

alter table public.events  add column if not exists title_tr text;
alter table public.events  add column if not exists description_tr text;

alter table public.gallery add column if not exists title_tr text;
alter table public.gallery add column if not exists artist_tr text;
alter table public.gallery add column if not exists description_tr text;

-- Make the new columns visible to the website straight away
notify pgrst, 'reload schema';
