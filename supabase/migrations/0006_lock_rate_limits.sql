-- Caller-supplied limits could wipe other buckets and raise the cap.
-- Limits are fixed by bucket prefix. p_max and p_window are ignored.

create or replace function public.take_rate_slot(p_bucket text, p_max int, p_window_seconds int)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  n int;
  allowed boolean;
  v_max int;
  v_window int;
begin
  if p_bucket is null or char_length(p_bucket) < 8 or char_length(p_bucket) > 96 then
    return false;
  end if;
  if p_bucket like 'asst:%' then
    v_max := 20;
    v_window := 60;
  elsif p_bucket like 'lead-email:%' then
    v_max := 5;
    v_window := 3600;
  elsif p_bucket like 'lead:%' then
    v_max := 8;
    v_window := 3600;
  else
    return false;
  end if;

  delete from private.rate_hits
    where bucket = p_bucket
      and ts < pg_catalog.now() - pg_catalog.make_interval(secs => v_window);

  select count(*) into n
    from private.rate_hits
    where bucket = p_bucket
      and ts > pg_catalog.now() - pg_catalog.make_interval(secs => v_window);

  allowed := n < v_max;
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
  if not public.take_rate_slot('lead-email:' || md5(email_norm), 5, 3600) then
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
