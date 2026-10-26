-- authenticated cannot select auth.mfa_factors. The restrictive policies
-- must call a definer function instead of reading that table directly.

create schema if not exists private;

revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.session_meets_aal()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    array[(select auth.jwt() ->> 'aal')] <@ (
      select case
        when count(f.id) > 0 then array['aal2']::text[]
        else array['aal1', 'aal2']::text[]
      end
      from auth.mfa_factors as f
      where f.user_id = (select auth.uid())
        and f.status = 'verified'::auth.factor_status
    ),
    false
  );
$$;

revoke all on function private.session_meets_aal() from public, anon;
grant execute on function private.session_meets_aal() to authenticated;

drop policy if exists "mfa opted-in saved_plans" on public.saved_plans;
create policy "mfa opted-in saved_plans"
  on public.saved_plans
  as restrictive
  to authenticated
  using ((select private.session_meets_aal()))
  with check ((select private.session_meets_aal()));

drop policy if exists "mfa opted-in profiles" on public.profiles;
create policy "mfa opted-in profiles"
  on public.profiles
  as restrictive
  to authenticated
  using ((select private.session_meets_aal()))
  with check ((select private.session_meets_aal()));
