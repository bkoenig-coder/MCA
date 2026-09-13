-- ============================================================
-- SUPABASE SQL SCHEMA FOR MONGOLIAN CENTER IN VIENNA (MCA)
-- ============================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Posts (News & Articles)
create table if not exists public.posts (
  id text primary key,
  title text not null,
  title_en text,
  title_mn text,
  title_de text,
  slug text,
  content text not null,
  content_en text,
  content_mn text,
  content_de text,
  image_url text,
  gallery_images jsonb default '[]'::jsonb,
  category text,
  category_en text,
  category_mn text,
  category_de text,
  tags jsonb default '[]'::jsonb,
  featured boolean default false,
  status text default 'published',
  author_id text,
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now())
);

-- 3. Events
create table if not exists public.events (
  id text primary key,
  title text not null,
  title_en text,
  title_mn text,
  title_de text,
  description text not null,
  description_en text,
  description_mn text,
  description_de text,
  price numeric default 0,
  capacity integer default 0,
  registered_count integer default 0,
  date text not null,
  time text,
  location text,
  location_en text,
  location_mn text,
  location_de text,
  image_url text,
  gallery_images jsonb default '[]'::jsonb,
  category text,
  category_en text,
  category_mn text,
  category_de text,
  whats_included jsonb default '[]'::jsonb,
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now())
);

-- 4. Gallery Items
create table if not exists public.gallery (
  id text primary key,
  title text not null,
  title_en text,
  title_mn text,
  title_de text,
  artist text,
  artist_en text,
  artist_mn text,
  artist_de text,
  year text,
  description text,
  description_en text,
  description_mn text,
  description_de text,
  image_url text not null,
  gallery_images jsonb default '[]'::jsonb,
  category text,
  category_en text,
  category_mn text,
  category_de text,
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now())
);

-- 5. User Profiles
create table if not exists public.users (
  id text primary key,
  email text not null,
  display_name text,
  photo_url text,
  role text default 'user',
  membership_tier text,
  membership_status text,
  membership_updated_at timestamptz,
  stripe_session_id text,
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now())
);

-- 6. Membership Applications
create table if not exists public.membership_applications (
  id text primary key,
  user_id text,
  user_email text not null,
  first_name text not null,
  last_name text not null,
  gender text,
  dob text,
  phone text,
  nationality text,
  tier text not null,
  age integer,
  school_or_university text,
  student_id_number text,
  organization_name text,
  position text,
  website_or_linkedin text,
  statement_of_purpose text,
  status text default 'pending',
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now())
);

-- 7. Event Registrations
create table if not exists public.registrations (
  id text primary key,
  event_id text not null,
  event_title text not null,
  user_id text,
  user_email text not null,
  name text not null,
  email text not null,
  phone text,
  notes text,
  status text default 'pending',
  amount numeric default 0,
  stripe_session_id text,
  created_at timestamptz default timezone('utc'::text, now())
);

-- 8. Game Scores
create table if not exists public.game_scores (
  id text primary key,
  score numeric not null,
  player_name text,
  created_at timestamptz default timezone('utc'::text, now())
);

-- 9. Analytics
create table if not exists public.analytics (
  id text primary key,
  path text not null,
  timestamp timestamptz default timezone('utc'::text, now()),
  metadata jsonb default '{}'::jsonb
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
alter table public.posts enable row level security;
alter table public.events enable row level security;
alter table public.gallery enable row level security;
alter table public.users enable row level security;
alter table public.membership_applications enable row level security;
alter table public.registrations enable row level security;
alter table public.game_scores enable row level security;
alter table public.analytics enable row level security;

-- Public READ access for public tables
create policy "Allow public read on posts" on public.posts for select using (true);
create policy "Allow public read on events" on public.events for select using (true);
create policy "Allow public read on gallery" on public.gallery for select using (true);
create policy "Allow public read on game_scores" on public.game_scores for select using (true);
create policy "Allow public read on registrations" on public.registrations for select using (true);

-- Allow authenticated / service users full access
create policy "Allow all on posts for service/authenticated" on public.posts for all using (true) with check (true);
create policy "Allow all on events for service/authenticated" on public.events for all using (true) with check (true);
create policy "Allow all on gallery for service/authenticated" on public.gallery for all using (true) with check (true);
create policy "Allow all on users for service/authenticated" on public.users for all using (true) with check (true);
create policy "Allow all on membership_applications for service/authenticated" on public.membership_applications for all using (true) with check (true);
create policy "Allow all on registrations for service/authenticated" on public.registrations for all using (true) with check (true);
create policy "Allow all on game_scores for service/authenticated" on public.game_scores for all using (true) with check (true);
create policy "Allow all on analytics for service/authenticated" on public.analytics for all using (true) with check (true);
