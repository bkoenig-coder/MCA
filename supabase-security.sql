-- ============================================================
-- SECURITY: only staff may change content; visitors may only read it
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- It is safe to run more than once.
--
-- Why: the original policies were "for all using (true)", which lets ANYONE who has the
-- public website key create, change and delete news, events, gallery items, user profiles
-- (including roles) and read member data. This script replaces them.
--
-- Staff = users whose profile role is admin or moderator.
-- ============================================================

create extension if not exists pgcrypto;

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users u
    where u.id::text = auth.uid()::text
      and u.role in ('admin', 'moderator')
  );
$$;

-- A new profile gets its role on the server (from the verified sign-in e-mail), and nobody
-- except staff can change a role afterwards. This stops people from making themselves admin.
create or replace function public.protect_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  if tg_op = 'INSERT' then
    select lower(email) into v_email from auth.users where id::text = new.id::text;
    if v_email is not null and (
         v_email in ('emeraldtorstein@gmail.com', 'batmunkh.unen@gmail.com')
         or v_email like '%@mongoliancenter.org'
       ) then
      new.role := 'admin';
    else
      new.role := 'user';
    end if;
  elsif tg_op = 'UPDATE' then
    if new.role is distinct from old.role and not public.is_staff() then
      new.role := old.role;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_user_role_trg on public.users;
create trigger protect_user_role_trg
  before insert or update on public.users
  for each row execute function public.protect_user_role();

-- ---- Content: everyone reads, staff write -------------------------------------------------
drop policy if exists "Allow public read on posts" on public.posts;
drop policy if exists "Allow all on posts for service/authenticated" on public.posts;
drop policy if exists "Public read posts" on public.posts;
drop policy if exists "Staff write posts" on public.posts;
create policy "Public read posts" on public.posts for select using (true);
create policy "Staff write posts" on public.posts for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Allow public read on events" on public.events;
drop policy if exists "Allow all on events for service/authenticated" on public.events;
drop policy if exists "Public read events" on public.events;
drop policy if exists "Staff write events" on public.events;
create policy "Public read events" on public.events for select using (true);
create policy "Staff write events" on public.events for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Allow public read on gallery" on public.gallery;
drop policy if exists "Allow all on gallery for service/authenticated" on public.gallery;
drop policy if exists "Public read gallery" on public.gallery;
drop policy if exists "Staff write gallery" on public.gallery;
create policy "Public read gallery" on public.gallery for select using (true);
create policy "Staff write gallery" on public.gallery for all using (public.is_staff()) with check (public.is_staff());

-- ---- Profiles: you see and edit your own, staff see and manage all ------------------------
drop policy if exists "Allow all on users for service/authenticated" on public.users;
drop policy if exists "Read own or staff users" on public.users;
drop policy if exists "Insert own user" on public.users;
drop policy if exists "Update own or staff users" on public.users;
drop policy if exists "Staff delete users" on public.users;
create policy "Read own or staff users" on public.users for select using (id::text = auth.uid()::text or public.is_staff());
create policy "Insert own user" on public.users for insert with check (id::text = auth.uid()::text);
create policy "Update own or staff users" on public.users for update
  using (id::text = auth.uid()::text or public.is_staff())
  with check (id::text = auth.uid()::text or public.is_staff());
create policy "Staff delete users" on public.users for delete using (public.is_staff());

-- ---- Membership applications: signed-in people send their own, staff review ---------------
drop policy if exists "Allow all on membership_applications for service/authenticated" on public.membership_applications;
drop policy if exists "Send own application" on public.membership_applications;
drop policy if exists "Read own or staff applications" on public.membership_applications;
drop policy if exists "Staff manage applications" on public.membership_applications;
create policy "Send own application" on public.membership_applications for insert
  with check (user_id::text = auth.uid()::text);
create policy "Read own or staff applications" on public.membership_applications for select
  using (user_id::text = auth.uid()::text or public.is_staff());
create policy "Staff manage applications" on public.membership_applications for update using (public.is_staff()) with check (public.is_staff());
create policy "Staff delete applications" on public.membership_applications for delete using (public.is_staff());

-- ---- Event registrations: anyone can register (guests too), only staff and the owner read --
drop policy if exists "Allow public read on registrations" on public.registrations;
drop policy if exists "Allow all on registrations for service/authenticated" on public.registrations;
drop policy if exists "Anyone can register" on public.registrations;
drop policy if exists "Read own or staff registrations" on public.registrations;
drop policy if exists "Staff manage registrations" on public.registrations;
create policy "Anyone can register" on public.registrations for insert with check (true);
create policy "Read own or staff registrations" on public.registrations for select
  using (user_id::text = auth.uid()::text or public.is_staff());
create policy "Staff manage registrations" on public.registrations for update using (public.is_staff()) with check (public.is_staff());
create policy "Staff delete registrations" on public.registrations for delete using (public.is_staff());

-- ---- Game scores: everyone reads and adds a score, staff clean up -------------------------
drop policy if exists "Allow public read on game_scores" on public.game_scores;
drop policy if exists "Allow all on game_scores for service/authenticated" on public.game_scores;
drop policy if exists "Public read scores" on public.game_scores;
drop policy if exists "Anyone adds a score" on public.game_scores;
drop policy if exists "Staff manage scores" on public.game_scores;
create policy "Public read scores" on public.game_scores for select using (true);
create policy "Anyone adds a score" on public.game_scores for insert with check (true);
create policy "Staff manage scores" on public.game_scores for all using (public.is_staff()) with check (public.is_staff());

-- ---- Visit statistics: visitors add, only staff read --------------------------------------
drop policy if exists "Allow all on analytics for service/authenticated" on public.analytics;
drop policy if exists "Anyone adds a visit" on public.analytics;
drop policy if exists "Staff read analytics" on public.analytics;
drop policy if exists "Staff delete analytics" on public.analytics;
create policy "Anyone adds a visit" on public.analytics for insert with check (true);
create policy "Staff read analytics" on public.analytics for select using (public.is_staff());
create policy "Staff delete analytics" on public.analytics for delete using (public.is_staff());
