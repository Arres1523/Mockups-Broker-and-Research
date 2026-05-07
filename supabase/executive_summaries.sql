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
create policy "Public read access for executive summaries"
on public.executive_summaries
for select
using (true);

create index if not exists executive_summaries_market_idx
  on public.executive_summaries (market);

create index if not exists executive_summaries_broker_name_idx
  on public.executive_summaries (broker_name);

create index if not exists executive_summaries_year_built_idx
  on public.executive_summaries (year_built);

create index if not exists executive_summaries_noi_actual_idx
  on public.executive_summaries (noi_actual desc);

create index if not exists executive_summaries_dscr_current_idx
  on public.executive_summaries (dscr_current desc);

create index if not exists executive_summaries_physical_occupancy_pct_idx
  on public.executive_summaries (physical_occupancy_pct desc);

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
  ('Sunset Ridge', 'Dallas, TX', 'JLL', 220, 1998, 96, 1450000, 41, 1.62, 380000),
  ('Harbor Point', 'Austin, TX', 'CBRE', 142, 2007, 91, 980000, 47, 1.31, 210000),
  ('River Walk Commons', 'Dallas, TX', 'Newmark', 310, 2016, 88, 1820000, 38, 1.84, 520000)
on conflict do nothing;
