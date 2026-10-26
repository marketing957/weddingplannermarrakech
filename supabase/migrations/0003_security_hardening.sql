-- Harden RPC grants, vote aggregator, and anonymous lead inserts.
-- Trigger functions stay SECURITY DEFINER but are no longer callable via PostgREST.

revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon, authenticated;
revoke all on function public.rls_auto_enable() from public;
revoke all on function public.rls_auto_enable() from anon, authenticated;

create or replace function public.vote_tallies(p_type text)
returns table(target_id uuid, up bigint, down bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select target_id,
    count(*) filter (where value = 1),
    count(*) filter (where value = -1)
  from public.votes
  where target_type = p_type
  group by target_id;
$$;

grant execute on function public.vote_tallies(text) to anon, authenticated;

revoke all on table public.leads from anon, authenticated;
grant insert on table public.leads to anon, authenticated;

drop policy if exists "anyone can submit a lead" on public.leads;
create policy "anyone can submit a lead" on public.leads
  for insert to anon, authenticated
  with check (
    char_length(email) between 3 and 254
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(coalesce(name, '')) <= 120
    and char_length(coalesce(wedding_date, '')) <= 40
    and (guest_count is null or guest_count between 1 and 5000)
    and (estimate is null or estimate between 0 and 100000000)
    and pg_column_size(plan) < 32768
  );

revoke all on table public.profiles from anon;
revoke all on table public.saved_plans from anon;
