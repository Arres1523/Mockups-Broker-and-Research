create extension if not exists pgcrypto;
create table if not exists public.executive_summaries (
  id uuid primary key default gen_random_uuid(),
  property_name text not null,
  market text,
  broker_name text,
  units integer,
  year_built integer,
  physical_occupancy_pct numeric,
  noi_actual numeric,
  expense_ratio_actual numeric,
  dscr_current numeric,
  in_place_annual_upside numeric,
  created_at timestamp with time zone default now()
);
alter table public.executive_summaries enable row level security;
drop policy if exists "Public read access for executive summaries" on public.executive_summaries;
create policy "Public read access for executive summaries" on public.executive_summaries for select using (true);
create index if not exists executive_summaries_market_idx on public.executive_summaries (market);
create index if not exists executive_summaries_broker_name_idx on public.executive_summaries (broker_name);
create index if not exists executive_summaries_year_built_idx on public.executive_summaries (year_built);
create index if not exists executive_summaries_noi_actual_idx on public.executive_summaries (noi_actual desc);
create index if not exists executive_summaries_dscr_current_idx on public.executive_summaries (dscr_current desc);
create index if not exists executive_summaries_physical_occupancy_pct_idx on public.executive_summaries (physical_occupancy_pct desc);
truncate table public.executive_summaries;
insert into public.executive_summaries (
  property_name,
  market,
  broker_name,
  units,
  year_built,
  physical_occupancy_pct,
  noi_actual,
  expense_ratio_actual,
  dscr_current,
  in_place_annual_upside
)
values
  ('2708 Penn Mar Ave', 'EL MONTE, CA', 'CBRE', 5, 1953, null, null, null, null, null),
  ('Carmel Hills', 'ST. LOUIS, MO', 'CBRE', 86, null, 0.616, null, null, null, null),
  ('Concord Place Apartments', 'ST. LOUIS, MO', 'CBRE', null, null, null, 70749.74, 0.8773, null, null),
  ('Mary Lu', 'ST. LOUIS, MO', 'CBRE', null, null, null, null, null, null, null),
  ('Morningside Condominiums', 'HAZELWOOD, MO', 'CBRE', 66, null, 1.0, null, null, null, null),
  ('Seven Hills Forest', 'ST. LOUIS, MO', 'CBRE', null, null, null, null, null, null, null),
  ('St. Antimo Apartments', 'MCALLEN, TX', 'CBRE', 68, 2003, 0.9118, null, null, null, 42158.82),
  ('The Lange', 'ST. LOUIS, MO', 'CBRE', 27, null, 0.963, null, null, null, null),
  ('Tiburon Apartments', 'HOUSTON, TX', 'CBRE', 320, null, 0.9248, 2043349.57, 0.5964, null, 90498.6),
  ('University Villas', 'ST. LOUIS, MO', 'CBRE', null, null, null, 480377.2399999999, 0.379, null, null),
  ('Westbury at Fondren', 'HOUSTON, TX', 'CBRE', 240, 1983, 0.93, null, null, null, null),
  ('Woodknoll  Townhomes', 'ST. LOUIS, MO', 'CBRE', null, null, null, null, null, null, null),
  ('Woodland Grove Apartments', 'ROCK ISLAND, IL', 'CBRE', 48, 1966, null, null, null, null, null),
  ('Ventana Apartment Homes', 'LOUISVILLE, KY', 'JLL', 382, 1967, null, 3106939.0, 0.4255, null, null),
  ('100 S 9th Street', 'BROOKLYN, NY', 'JLL', 48, 2025, null, null, null, null, null),
  ('1164-1168 Greene Avenue', 'BROOKLYN, NY', 'JLL', 10, null, null, null, null, null, null),
  ('155 Cecil B Moore', 'PHILADELPHIA, PA', 'JLL', null, null, null, null, null, null, null),
  ('5550 Wilshire', 'LOS ANGELES, CA', 'JLL', 163, 2010, 1.0, null, null, null, null),
  ('625 Broadway', 'SAN DIEGO, CA', 'JLL', 231, 1926, null, null, null, null, null),
  ('Club at Stone Oak', 'SAN ANTONIO, TX', 'JLL', 250, 2006, 0.92, null, null, null, null),
  ('Cottages at Brightleaf', 'DURHAM, NC', 'JLL', null, null, 0.8485, null, null, null, 130667.04),
  ('Delantero North Multifamily Land', 'GREELEY, CO', 'JLL', null, null, null, null, null, null, null),
  ('Desert Commons East', 'EL PASO, TX', 'JLL', 225, 2023, 0.942, null, null, null, null),
  ('Fawn Ridge Apartments', 'STATE MCHENRY, IL', 'JLL', null, 1988, 0.99, null, null, null, null),
  ('Griffis Cherry Creek Apartments', 'DENVER, CO', 'JLL', 240, null, null, null, null, null, null),
  ('Luna Villa', 'PHOENIX, AZ', 'JLL', 288, 1973, 0.91, null, null, null, null),
  ('Morris Station', 'STATE MUNDELEIN, IL', 'JLL', null, 2023, 0.96, null, null, null, null),
  ('Pavillion Village', 'CHARLOTTE, NC', 'JLL', null, null, null, 2844567.5, 0.4144, null, null),
  ('Reserve at Chino Hills Sales', 'CHINO HILLS, CA', 'JLL', null, null, null, null, null, null, null),
  ('Ridgewood Preserve Apartments', 'ARLINGTON, TX', 'JLL', 184, 1979, 0.946, null, null, null, null),
  ('The Harper', 'DENVER, CO', 'JLL', 253, null, 0.8175, null, null, null, 184056.0),
  ('The Lorrel', 'LITTLE RIVER, SC', 'JLL', 270, null, 0.96, null, null, null, null),
  ('The Verandahs at Hunt Club', 'APOPKA, FL', 'JLL', 210, 1984, null, 2439795.0, null, null, null),
  ('Attiva', 'PEARLAND, TX', 'Newmark', 126, 2008, 0.9206, 1255979.77, 0.5226, null, 88141.44),
  ('Hayden at Enclave', 'HOUSTON, TX', 'Newmark', 476, null, 0.9328, 3409852.0, 0.5525, null, 0.0)
;
