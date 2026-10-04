-- ============================================================
-- CAREERS: open roles and job applications
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- It is safe to run more than once.
-- ============================================================

create extension if not exists pgcrypto;

-- Roles that admins publish on the Careers page
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null default '',
  location text not null default 'Vienna, Austria',
  employment_type text not null default 'Volunteer',
  description text not null default '',
  requirements text not null default '',
  deadline date,
  status text not null default 'draft' check (status in ('draft', 'open', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Applications sent through the website
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete set null,
  job_title text not null default '',          -- kept so the application stays readable if the role is deleted
  name text not null,
  email text not null,
  phone text not null default '',
  linkedin_url text not null default '',
  cv_url text not null default '',
  message text not null default '',
  status text not null default 'new' check (status in ('new', 'reviewed', 'shortlisted', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists jobs_status_idx on public.jobs (status, created_at desc);
create index if not exists job_applications_job_idx on public.job_applications (job_id, created_at desc);

-- Staff = users whose profile role is admin or moderator (same roles the dashboard uses)
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

alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;

drop policy if exists "Public can read open jobs" on public.jobs;
create policy "Public can read open jobs" on public.jobs
  for select using (status = 'open' or public.is_staff());

drop policy if exists "Staff manage jobs" on public.jobs;
create policy "Staff manage jobs" on public.jobs
  for all using (public.is_staff()) with check (public.is_staff());

-- Anyone may apply, but only with sensible values and only as a new application
drop policy if exists "Anyone can apply" on public.job_applications;
create policy "Anyone can apply" on public.job_applications
  for insert with check (
    status = 'new'
    and char_length(name) between 1 and 200
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(message) <= 5000
    and char_length(cv_url) <= 500
    and char_length(linkedin_url) <= 500
  );

-- Only staff can read or change applications (they contain personal data)
drop policy if exists "Staff read applications" on public.job_applications;
create policy "Staff read applications" on public.job_applications
  for select using (public.is_staff());

drop policy if exists "Staff update applications" on public.job_applications;
create policy "Staff update applications" on public.job_applications
  for update using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Staff delete applications" on public.job_applications;
create policy "Staff delete applications" on public.job_applications
  for delete using (public.is_staff());
