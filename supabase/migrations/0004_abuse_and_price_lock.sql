-- Durable rate limits, lead RPC (anon cannot insert rows), column-level price lock,
-- and MFA enforcement for users who opted in.

create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon, authenticated;

create table if not exists private.rate_hits (
  bucket text not null,
  ts timestamptz not null default now()
);
create index if not exists rate_hits_bucket_ts_idx on private.rate_hits (bucket, ts);

create or replace function public.take_rate_slot(p_bucket text, p_max int, p_window_seconds int)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  n int;
  allowed boolean;
begin
  if p_bucket is null or char_length(p_bucket) < 8 or char_length(p_bucket) > 96 then
    return false;
  end if;
  if p_bucket not like 'asst:%' and p_bucket not like 'lead:%' then
    return false;
  end if;
  if p_max < 1 or p_max > 40 or p_window_seconds < 10 or p_window_seconds > 86400 then
    return false;
  end if;

  delete from private.rate_hits
    where ts < pg_catalog.now() - pg_catalog.make_interval(secs => p_window_seconds);

  select count(*) into n
    from private.rate_hits
    where bucket = p_bucket
      and ts > pg_catalog.now() - pg_catalog.make_interval(secs => p_window_seconds);

  allowed := n < p_max;
  if allowed then
    insert into private.rate_hits (bucket) values (p_bucket);
  end if;
  return allowed;
end;
$$;

revoke all on function public.take_rate_slot(text, int, int) from public;
grant execute on function public.take_rate_slot(text, int, int) to anon, authenticated;

create or replace function public.submit_lead(
  p_email text,
  p_name text,
  p_wedding_date text,
  p_guest_count int,
  p_estimate int,
  p_plan jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  email_norm text := lower(trim(p_email));
begin
  if email_norm is null
     or char_length(email_norm) not between 3 and 254
     or email_norm !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid_email';
  end if;
  if char_length(coalesce(p_name, '')) > 120 then
    raise exception 'invalid_name';
  end if;
  if char_length(coalesce(p_wedding_date, '')) > 40 then
    raise exception 'invalid_date';
  end if;
  if p_guest_count is null or p_guest_count not between 1 and 5000 then
    raise exception 'invalid_guests';
  end if;
  if p_estimate is not null and p_estimate not between 0 and 100000000 then
    raise exception 'invalid_estimate';
  end if;
  if p_plan is null or pg_column_size(p_plan) >= 32768 then
    raise exception 'plan_too_large';
  end if;
  if not public.take_rate_slot('lead:' || md5(email_norm), 5, 3600) then
    raise exception 'rate_limited';
  end if;

  insert into public.leads (email, name, wedding_date, guest_count, estimate, plan)
  values (
    email_norm,
    nullif(trim(coalesce(p_name, '')), ''),
    nullif(trim(coalesce(p_wedding_date, '')), ''),
    p_guest_count,
    p_estimate,
    p_plan
  )
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.submit_lead(text, text, text, int, int, jsonb) from public;
grant execute on function public.submit_lead(text, text, text, int, int, jsonb) to anon, authenticated;

revoke all on table public.leads from anon, authenticated;

-- Price columns are authenticated-only. Anon keeps the rest of the row.
revoke select on table public.venues from anon;
grant select (
  id, slug, name, tier, zone, styles, style_slugs,
  capacity_seated, capacity_max, sleep_rooms, sleep_guests, min_nights,
  catering_policy, score_overall, score_quality, score_transparency, score_value,
  amenities, season_high, season_shoulder, season_low,
  setting_text, ceremony_text, suits_text, wpm_selection, last_verified, created_at
) on table public.venues to anon;

revoke select on table public.planners from anon;
grant select (
  id, slug, name, tagline, bio, founded_year, languages, price_model, specialties,
  website, instagram, featured, created_at, website_domain,
  review_strengths, review_execution, review_suits, review_verdict
) on table public.planners to anon;

revoke select on table public.vendors from anon;
grant select (
  id, slug, name, category_slug, website, instagram, styles, languages, score, verified, created_at
) on table public.vendors to anon;

-- Users who enrolled TOTP must complete aal2 before touching account rows.
create policy "mfa opted-in saved_plans"
  on public.saved_plans
  as restrictive
  to authenticated
  using (
    array[(select auth.jwt()->>'aal')] <@ (
      select case
        when count(id) > 0 then array['aal2']
        else array['aal1', 'aal2']
      end
      from auth.mfa_factors
      where (select auth.uid()) = user_id and status = 'verified'
    )
  )
  with check (
    array[(select auth.jwt()->>'aal')] <@ (
      select case
        when count(id) > 0 then array['aal2']
        else array['aal1', 'aal2']
      end
      from auth.mfa_factors
      where (select auth.uid()) = user_id and status = 'verified'
    )
  );

create policy "mfa opted-in profiles"
  on public.profiles
  as restrictive
  to authenticated
  using (
    array[(select auth.jwt()->>'aal')] <@ (
      select case
        when count(id) > 0 then array['aal2']
        else array['aal1', 'aal2']
      end
      from auth.mfa_factors
      where (select auth.uid()) = user_id and status = 'verified'
    )
  )
  with check (
    array[(select auth.jwt()->>'aal')] <@ (
      select case
        when count(id) > 0 then array['aal2']
        else array['aal1', 'aal2']
      end
      from auth.mfa_factors
      where (select auth.uid()) = user_id and status = 'verified'
    )
  );
