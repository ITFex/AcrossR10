create table if not exists public.member_locations (
  member_id text primary key,
  name text not null,
  status text not null default 'active',
  latitude double precision,
  longitude double precision,
  accuracy integer,
  last_seen timestamptz not null default now(),
  source text not null default 'web'
);

alter table public.member_locations enable row level security;

create policy if not exists "anon_select_member_locations"
  on public.member_locations
  for select
  to anon
  using (true);

create policy if not exists "anon_upsert_member_locations"
  on public.member_locations
  for insert
  to anon
  with check (true);

create policy if not exists "anon_update_member_locations"
  on public.member_locations
  for update
  to anon
  using (true)
  with check (true);

-- In Supabase dashboard, enable Realtime for this table:
-- Database -> Replication -> public.member_locations
