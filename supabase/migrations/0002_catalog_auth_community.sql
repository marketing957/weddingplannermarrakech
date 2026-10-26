-- Catalog (venues, vendors), auth profiles, community votes/reviews, saved plans, season data.

-- ---------------------------------------------------------------------------
-- Profiles (one row per auth user)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url   text,
  created_at   timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "users read own profile"   on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "users update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Venues
-- ---------------------------------------------------------------------------
create table public.venue_styles (
  slug        text primary key,
  name        text not null,
  description text not null,
  sort_order  int not null default 0
);

create table public.venues (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  name               text not null,
  tier               text not null check (tier in ('luxury','premium','standard')),
  zone               text not null,
  styles             text[] not null default '{}',
  style_slugs        text[] not null default '{}',
  capacity_seated    int not null,
  capacity_max       int,
  sleep_rooms        int,
  sleep_guests       int,
  min_nights         int not null default 2,
  price_night_low    int not null,
  price_night_high   int,
  catering_policy    text not null default 'In-house only',
  score_overall      numeric(3,1) not null,
  score_quality      numeric(3,1),
  score_transparency numeric(3,1),
  score_value        numeric(3,1),
  amenities          text[] not null default '{}',
  season_high        text,
  season_shoulder    text,
  season_low         text,
  setting_text       text,
  ceremony_text      text,
  costs_text         text,
  suits_text         text,
  wpm_selection      boolean not null default false,
  last_verified      date,
  created_at         timestamptz not null default now()
);
create index venues_score_idx on public.venues (score_overall desc);
create index venues_style_slugs_idx on public.venues using gin (style_slugs);

-- ---------------------------------------------------------------------------
-- Vendors
-- ---------------------------------------------------------------------------
create table public.vendor_categories (
  slug        text primary key,
  name        text not null,
  icon        text not null,
  headline    text not null,
  description text not null,
  most_booked boolean not null default false,
  sort_order  int not null default 0
);

create table public.vendors (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  category_slug text not null references public.vendor_categories(slug) on delete cascade,
  website       text,
  instagram     text,
  styles        text[] not null default '{}',
  languages     text[] not null default '{}',
  score         numeric(3,1) not null,
  price_from    int not null,
  verified      boolean not null default false,
  created_at    timestamptz not null default now()
);
create index vendors_category_idx on public.vendors (category_slug, score desc);

-- ---------------------------------------------------------------------------
-- Planner editorial review fields
-- ---------------------------------------------------------------------------
alter table public.planners
  add column website_domain   text,
  add column review_strengths text,
  add column review_execution text,
  add column review_suits     text,
  add column review_verdict   text;

-- ---------------------------------------------------------------------------
-- Community: votes + reviews
-- ---------------------------------------------------------------------------
create table public.votes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('planner','venue','vendor')),
  target_id   uuid not null,
  value       smallint not null check (value in (-1, 1)),
  created_at  timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);
create index votes_target_idx on public.votes (target_type, target_id);
alter table public.votes enable row level security;
create policy "votes are public"       on public.votes for select to anon, authenticated using (true);
create policy "users insert own votes" on public.votes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own votes" on public.votes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own votes" on public.votes for delete to authenticated using ((select auth.uid()) = user_id);

create view public.vote_counts
with (security_invoker = true) as
  select target_type, target_id,
         count(*) filter (where value = 1)  as up,
         count(*) filter (where value = -1) as down
  from public.votes
  group by target_type, target_id;

create table public.reviews (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('planner','venue','vendor')),
  target_id   uuid not null,
  rating      smallint not null check (rating between 1 and 5),
  body        text not null check (char_length(body) between 20 and 2000),
  author_name text,
  created_at  timestamptz not null default now()
);
create index reviews_target_idx on public.reviews (target_type, target_id, created_at desc);
alter table public.reviews enable row level security;
create policy "reviews are public"        on public.reviews for select to anon, authenticated using (true);
create policy "users insert own reviews"  on public.reviews for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users delete own reviews"  on public.reviews for delete to authenticated using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Saved plans (the account feature)
-- ---------------------------------------------------------------------------
create table public.saved_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text,
  guests      int not null,
  estimate    int not null,
  state       jsonb not null,
  breakdown   jsonb not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index saved_plans_user_idx on public.saved_plans (user_id, updated_at desc);
alter table public.saved_plans enable row level security;
create policy "users read own plans"   on public.saved_plans for select to authenticated using ((select auth.uid()) = user_id);
create policy "users insert own plans" on public.saved_plans for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own plans" on public.saved_plans for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own plans" on public.saved_plans for delete to authenticated using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Season / month data for the date optimizer
-- ---------------------------------------------------------------------------
create table public.months (
  month        int primary key check (month between 1 and 12),
  name         text not null,
  temp_high    int not null,
  temp_low     int not null,
  rain_days    int not null,
  price_index  numeric(3,2) not null,
  availability text not null check (availability in ('high','medium','low')),
  score        numeric(3,1) not null,
  verdict      text not null,
  note         text not null
);

-- Public read on all new content tables
alter table public.venue_styles      enable row level security;
alter table public.venues            enable row level security;
alter table public.vendor_categories enable row level security;
alter table public.vendors           enable row level security;
alter table public.months            enable row level security;
create policy "public read venue_styles"      on public.venue_styles      for select to anon, authenticated using (true);
create policy "public read venues"            on public.venues            for select to anon, authenticated using (true);
create policy "public read vendor_categories" on public.vendor_categories for select to anon, authenticated using (true);
create policy "public read vendors"           on public.vendors           for select to anon, authenticated using (true);
create policy "public read months"            on public.months            for select to anon, authenticated using (true);
