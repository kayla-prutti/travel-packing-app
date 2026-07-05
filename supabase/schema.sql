-- Run this in the Supabase SQL editor for your project.

create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination text not null,
  latitude double precision not null,
  longitude double precision not null,
  start_date date not null,
  end_date date not null,
  trip_types text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists packing_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  name text not null,
  category text not null,
  is_checked boolean not null default false,
  is_custom boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists checklist_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  name text not null,
  category text,
  is_visited boolean not null default false,
  created_at timestamptz not null default now()
);

alter table trips enable row level security;
alter table packing_items enable row level security;
alter table checklist_items enable row level security;

create policy "Users manage their own trips"
  on trips for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage packing items on their own trips"
  on packing_items for all
  using (exists (select 1 from trips where trips.id = packing_items.trip_id and trips.user_id = auth.uid()))
  with check (exists (select 1 from trips where trips.id = packing_items.trip_id and trips.user_id = auth.uid()));

create policy "Users manage checklist items on their own trips"
  on checklist_items for all
  using (exists (select 1 from trips where trips.id = checklist_items.trip_id and trips.user_id = auth.uid()))
  with check (exists (select 1 from trips where trips.id = checklist_items.trip_id and trips.user_id = auth.uid()));
