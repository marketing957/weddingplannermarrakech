-- Wedding Planner Marrakesh clone: initial schema
-- Content tables are publicly readable (anon + authenticated), writes are admin-only via service role.
-- `leads` accepts anonymous inserts only (budget plan submissions).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Pricing configuration (drives the budget simulator)
-- ---------------------------------------------------------------------------

create table public.seasons (
  id          text primary key,
  name        text not null,
  months      text not null,
  multiplier  numeric(4,2) not null default 1.00,
  note        text,
  sort_order  int not null default 0
);

create table public.venue_types (
  id          text primary key,
  name        text not null,
  tagline     text not null,
  max_guests  int  not null,
  base_fee    int  not null,
  per_guest   int  not null,
  sort_order  int  not null default 0
);

create table public.event_types (
  id           text primary key,
  name         text not null,
  description  text,
  is_core      boolean not null default false,
  fnb_standard int not null,
  fnb_premium  int not null,
  fnb_luxury   int not null,
  sort_order   int not null default 0
);

create table public.service_categories (
  id            text primary key,
  name          text not null,
  section       text not null check (section in ('core','details','traditions')),
  description   text,
  budget_group  text not null check (budget_group in ('venue','fnb','planning','decor','photo','music','beauty','traditions')),
  vendor_rating numeric(3,1),
  sort_order    int not null default 0
);

create table public.service_tiers (
  id             uuid primary key default gen_random_uuid(),
  category_id    text not null references public.service_categories(id) on delete cascade,
  key            text not null,
  name           text not null,
  fixed_cost     int  not null default 0,
  per_guest_cost int  not null default 0,
  features       text[] not null default '{}',
  is_default     boolean not null default false,
  sort_order     int not null default 0,
  unique (category_id, key)
);
create index service_tiers_category_idx on public.service_tiers (category_id);

-- ---------------------------------------------------------------------------
-- Editorial content
-- ---------------------------------------------------------------------------

create table public.planners (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  tagline       text,
  bio           text,
  founded_year  int,
  languages     text[] not null default '{}',
  price_model   text,
  price_from    int,
  specialties   text[] not null default '{}',
  website       text,
  instagram     text,
  featured      boolean not null default false,
  created_at    timestamptz not null default now()
);

create table public.real_weddings (
  id             uuid primary key default gen_random_uuid(),
  location       text not null,
  wedding_month  date not null,
  guest_count    int  not null,
  total_cost     int  not null,
  venue_type_id  text references public.venue_types(id),
  notes          text
);
create index real_weddings_guest_count_idx on public.real_weddings (guest_count);

create table public.faq_items (
  id          uuid primary key default gen_random_uuid(),
  section     text not null check (section in ('planner_guide','general')),
  question    text not null,
  answer      text not null,
  link_label  text,
  link_href   text,
  sort_order  int not null default 0
);
create index faq_items_section_idx on public.faq_items (section, sort_order);

create table public.guides (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text not null,
  body          text not null,
  category      text not null,
  read_minutes  int not null default 5,
  published_at  date not null default current_date
);

-- ---------------------------------------------------------------------------
-- Leads: saved budget plans from visitors
-- ---------------------------------------------------------------------------

create table public.leads (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  name         text,
  wedding_date text,
  guest_count  int,
  estimate     int,
  plan         jsonb,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.seasons            enable row level security;
alter table public.venue_types        enable row level security;
alter table public.event_types        enable row level security;
alter table public.service_categories enable row level security;
alter table public.service_tiers      enable row level security;
alter table public.planners           enable row level security;
alter table public.real_weddings      enable row level security;
alter table public.faq_items          enable row level security;
alter table public.guides             enable row level security;
alter table public.leads              enable row level security;

create policy "public read seasons"            on public.seasons            for select to anon, authenticated using (true);
create policy "public read venue_types"        on public.venue_types        for select to anon, authenticated using (true);
create policy "public read event_types"        on public.event_types        for select to anon, authenticated using (true);
create policy "public read service_categories" on public.service_categories for select to anon, authenticated using (true);
create policy "public read service_tiers"      on public.service_tiers      for select to anon, authenticated using (true);
create policy "public read planners"           on public.planners           for select to anon, authenticated using (true);
create policy "public read real_weddings"      on public.real_weddings      for select to anon, authenticated using (true);
create policy "public read faq_items"          on public.faq_items          for select to anon, authenticated using (true);
create policy "public read guides"             on public.guides             for select to anon, authenticated using (true);

create policy "anyone can submit a lead" on public.leads for insert to anon, authenticated with check (true);
