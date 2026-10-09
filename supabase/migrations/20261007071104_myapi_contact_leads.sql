-- MyAPI-only objects. Existing extension application tables are untouched.
create schema myapi_private;
revoke all on schema myapi_private from public, anon, authenticated;
grant usage on schema myapi_private to authenticated, service_role;
create table myapi_private.contact_admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table myapi_private.contact_admins enable row level security;

create function myapi_private.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from myapi_private.contact_admins a join auth.users u on u.id = a.user_id
    where a.user_id = auth.uid() and u.email_confirmed_at is not null and u.deleted_at is null
      and (u.banned_until is null or u.banned_until < now())
  );
$$;
revoke all on function myapi_private.is_admin() from public, anon;
grant execute on function myapi_private.is_admin() to authenticated;
create function public.myapi_is_admin() returns boolean language sql stable security invoker set search_path = '' as $$
  select myapi_private.is_admin();
$$;
revoke all on function public.myapi_is_admin() from public, anon;
grant execute on function public.myapi_is_admin() to authenticated;

create table public.myapi_contact_leads (
  id uuid primary key,
  "fullName" text not null check (char_length("fullName") between 1 and 120),
  company text not null default '' check (char_length(company) <= 200),
  phone text not null check (char_length(phone) between 7 and 30),
  email text not null check (char_length(email) between 3 and 254),
  website text not null default '' check (char_length(website) <= 500),
  courier text not null default '' check (char_length(courier) <= 200),
  status text not null default 'new' check (status in ('new','contacted','closed')),
  note text not null default '' check (char_length(note) <= 4000),
  "notificationStatus" text not null default 'pending' check ("notificationStatus" in ('pending','sent','failed')),
  "createdAt" timestamptz not null default clock_timestamp(),
  "updatedAt" timestamptz not null default clock_timestamp()
);
alter table public.myapi_contact_leads enable row level security;
revoke all on public.myapi_contact_leads from anon, authenticated;
grant select on public.myapi_contact_leads to authenticated;
grant update (status, note) on public.myapi_contact_leads to authenticated;
grant all on public.myapi_contact_leads to service_role;
create policy myapi_admin_read on public.myapi_contact_leads for select to authenticated using ((select myapi_private.is_admin()));
create policy myapi_admin_update on public.myapi_contact_leads for update to authenticated using ((select myapi_private.is_admin())) with check ((select myapi_private.is_admin()));
create index myapi_leads_created on public.myapi_contact_leads ("createdAt" desc, id desc);
create index myapi_leads_new on public.myapi_contact_leads (status) where status = 'new';
create function myapi_private.touch_lead() returns trigger language plpgsql security invoker set search_path = '' as $$
begin new."updatedAt" := clock_timestamp(); return new; end;
$$;
revoke all on function myapi_private.touch_lead() from public, anon, authenticated;
create trigger myapi_lead_updated before update on public.myapi_contact_leads for each row execute function myapi_private.touch_lead();

create table myapi_private.contact_receipts (id uuid primary key references public.myapi_contact_leads(id) on delete cascade, payload jsonb not null);
create table myapi_private.contact_rate_limits (client_key text primary key, started_at timestamptz not null, count integer not null);
create table myapi_private.contact_outbox (
  lead_id uuid primary key references public.myapi_contact_leads(id) on delete cascade,
  attempts integer not null default 0, first_attempt_at timestamptz,
  next_attempt_at timestamptz not null default now(), locked_until timestamptz, lock_token uuid,
  sent_at timestamptz, provider_id text, last_error text
);
alter table myapi_private.contact_receipts enable row level security;
alter table myapi_private.contact_rate_limits enable row level security;
alter table myapi_private.contact_outbox enable row level security;
revoke all on all tables in schema myapi_private from public, anon, authenticated;
grant all on all tables in schema myapi_private to service_role;

-- Service-only transaction; validation is performed by the intake function, constraints here are defense in depth.
create function public.myapi_submit_contact(p_payload jsonb, p_client_key text) returns jsonb language plpgsql security invoker set search_path = '' as $$
declare v_id uuid := (p_payload->>'submissionId')::uuid; v_previous jsonb; v_count integer; v_start timestamptz;
begin
  if p_client_key is null or length(p_client_key) <> 64 then raise exception 'Invalid client key'; end if;
  perform pg_advisory_xact_lock(hashtextextended('myapi_submission:' || v_id::text, 0));
  select payload into v_previous from myapi_private.contact_receipts where id = v_id;
  if found then
    if v_previous <> p_payload then raise exception using errcode = 'P0001', message = 'submission-conflict'; end if;
    return jsonb_build_object('accepted', true);
  end if;
  perform pg_advisory_xact_lock(hashtextextended('myapi_client:' || p_client_key, 0));
  select count, started_at into v_count, v_start from myapi_private.contact_rate_limits where client_key = p_client_key;
  if v_start is null or v_start <= now() - interval '1 hour' then v_count := 0; v_start := now(); end if;
  if v_count >= 5 then raise exception using errcode = 'P0001', message = 'rate-limit'; end if;
  insert into myapi_private.contact_rate_limits values (p_client_key, v_start, v_count + 1)
    on conflict (client_key) do update set started_at = excluded.started_at, count = excluded.count;
  insert into public.myapi_contact_leads (id, "fullName", company, phone, email, website, courier)
    values (v_id, p_payload->>'fullName', p_payload->>'company', p_payload->>'phone', p_payload->>'email', p_payload->>'website', p_payload->>'courier');
  insert into myapi_private.contact_receipts values (v_id, p_payload);
  insert into myapi_private.contact_outbox (lead_id) values (v_id);
  return jsonb_build_object('accepted', true);
end;
$$;
revoke all on function public.myapi_submit_contact(jsonb,text) from public, anon, authenticated;
grant execute on function public.myapi_submit_contact(jsonb,text) to service_role;

create function public.myapi_claim_notifications() returns table (lead_id uuid, lock_token uuid) language plpgsql security invoker set search_path = '' as $$
begin
  delete from myapi_private.contact_rate_limits where started_at < now() - interval '2 hours';
  -- Stop before the provider's 24-hour idempotency window expires.
  update public.myapi_contact_leads l set "notificationStatus" = 'failed'
    from myapi_private.contact_outbox o where l.id = o.lead_id and o.sent_at is null
      and o.first_attempt_at <= now() - interval '23 hours' and l."notificationStatus" <> 'failed';
  return query
  with candidates as (
    select o.lead_id from myapi_private.contact_outbox o where o.sent_at is null and o.attempts < 10
      and o.next_attempt_at <= now() and (o.locked_until is null or o.locked_until <= now())
      and (o.first_attempt_at is null or o.first_attempt_at > now() - interval '23 hours')
    order by o.next_attempt_at limit 5 for update skip locked
  )
  update myapi_private.contact_outbox o set attempts = o.attempts + 1,
    first_attempt_at = coalesce(o.first_attempt_at, now()), locked_until = now() + interval '3 minutes', lock_token = gen_random_uuid()
    from candidates c where o.lead_id = c.lead_id returning o.lead_id, o.lock_token;
end;
$$;
revoke all on function public.myapi_claim_notifications() from public, anon, authenticated;
grant execute on function public.myapi_claim_notifications() to service_role;

create function public.myapi_finish_notification(p_id uuid, p_token uuid, p_provider_id text) returns void language plpgsql security invoker set search_path = '' as $$
begin
  update myapi_private.contact_outbox set sent_at = case when p_provider_id is not null then now() end,
    provider_id = p_provider_id, last_error = case when p_provider_id is null then 'delivery-failed' end,
    next_attempt_at = now() + interval '5 minutes' * power(2, least(attempts - 1, 7)), locked_until = null, lock_token = null
    where lead_id = p_id and lock_token = p_token and sent_at is null;
  if found then update public.myapi_contact_leads set "notificationStatus" = case when p_provider_id is not null then 'sent' else 'failed' end where id = p_id; end if;
end;
$$;
revoke all on function public.myapi_finish_notification(uuid,uuid,text) from public, anon, authenticated;
grant execute on function public.myapi_finish_notification(uuid,uuid,text) to service_role;
