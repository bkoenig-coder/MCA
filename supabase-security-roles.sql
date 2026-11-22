-- ============================================================
-- SECURITY, STEP 2: only ADMINS may change roles or delete profiles (not moderators)
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- It is safe to run more than once. Run supabase-security.sql first.
--
-- Why: supabase-security.sql lets any staff member (admin OR moderator) change roles and delete
-- user profiles. A moderator could therefore promote themselves to admin. The website no longer
-- decides who is an admin from e-mail addresses; it reads the role stored here, so this role
-- must be protected properly.
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users u
    where u.id::text = auth.uid()::text
      and u.role = 'admin'
  );
$$;

-- Same rule as before for new profiles (role comes from the verified sign-in e-mail);
-- after that only an admin can change a role.
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
    if new.role is distinct from old.role and not public.is_admin() then
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

-- Only admins may delete profiles
drop policy if exists "Staff delete users" on public.users;
drop policy if exists "Admins delete users" on public.users;
create policy "Admins delete users" on public.users for delete using (public.is_admin());
