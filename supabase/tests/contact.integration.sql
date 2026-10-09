-- Run as postgres (SQL Editor/MCP). Every test record and temporary grant rolls back.
begin;
select set_config('myapi.test_user', (select id::text from auth.users where lower(email) not in (select email from myapi_private.contact_admin_emails) and email_confirmed_at is not null and deleted_at is null and (banned_until is null or banned_until < now()) limit 1), true);
select set_config('request.jwt.claims', json_build_object('sub', current_setting('myapi.test_user'), 'role', 'authenticated')::text, true);
set local role service_role;
do $$
declare p jsonb := '{"submissionId":"00000000-0000-4000-8000-000000000071","fullName":"Migration test","company":"","phone":"0812345678","email":"migration-test@example.invalid","website":"","courier":""}'; r jsonb; job record;
begin
  r := public.myapi_submit_contact(p, repeat('a',64));
  if r <> '{"accepted":true}'::jsonb then raise exception 'Not accepted'; end if;
  perform public.myapi_submit_contact(p, repeat('a',64));
  if (select count from myapi_private.contact_rate_limits where client_key=repeat('a',64)) <> 1 then raise exception 'Duplicate consumed quota'; end if;
  if (select count(*) from myapi_private.contact_outbox where lead_id=(p->>'submissionId')::uuid) <> 1 then raise exception 'Missing/duplicate outbox'; end if;
  begin
    perform public.myapi_submit_contact(p || '{"fullName":"Different"}', repeat('a',64));
    raise exception 'Conflict accepted';
  exception when sqlstate 'P0001' then if sqlerrm <> 'submission-conflict' then raise; end if; end;
  for i in 72..75 loop
    perform public.myapi_submit_contact(p || jsonb_build_object('submissionId', '00000000-0000-4000-8000-' || lpad(i::text,12,'0')), repeat('a',64));
  end loop;
  begin
    perform public.myapi_submit_contact(p || '{"submissionId":"00000000-0000-4000-8000-000000000076"}', repeat('a',64));
    raise exception 'Quota bypassed';
  exception when sqlstate 'P0001' then if sqlerrm <> 'rate-limit' then raise; end if; end;
  for job in select * from public.myapi_claim_notifications() loop
    perform public.myapi_finish_notification(job.lead_id, job.lock_token, null);
  end loop;
  if (select "notificationStatus" from public.myapi_contact_leads where id=(p->>'submissionId')::uuid) <> 'failed' then raise exception 'Failure missing'; end if;
  update myapi_private.contact_outbox set next_attempt_at=now() where lead_id=(p->>'submissionId')::uuid;
  select * into job from public.myapi_claim_notifications() where lead_id=(p->>'submissionId')::uuid;
  if job.lead_id is null then raise exception 'Retry missing'; end if;
  perform public.myapi_finish_notification(job.lead_id, job.lock_token, 'test-provider-id');
  perform public.myapi_finish_notification(job.lead_id, job.lock_token, null);
  if (select "notificationStatus" from public.myapi_contact_leads where id=job.lead_id) <> 'sent' then raise exception 'Stale failure downgraded sent'; end if;
end;
$$;
reset role;
set local role anon;
do $$ begin
  begin perform * from public.myapi_contact_leads; raise exception 'Guest could read'; exception when insufficient_privilege then null; end;
  begin perform public.myapi_submit_contact('{}', repeat('a',64)); raise exception 'Guest bypassed intake'; exception when insufficient_privilege then null; end;
end $$;
reset role;
-- Ensure the chosen test user has no membership before checking a normal member.
delete from myapi_private.contact_admins where user_id=current_setting('myapi.test_user')::uuid;
set local role authenticated;
do $$ begin
  if public.myapi_is_admin() then raise exception 'Member recognized as admin'; end if;
  if exists(select 1 from public.myapi_contact_leads) then raise exception 'Member saw leads'; end if;
  begin insert into myapi_private.contact_admin_emails values('intruder@example.invalid'); raise exception 'Member added allowlist'; exception when insufficient_privilege then null; end;
  begin insert into myapi_private.contact_admins values(auth.uid()); raise exception 'Member granted own role'; exception when insufficient_privilege then null; end;
  begin perform public.myapi_claim_notifications(); raise exception 'Member claimed emails'; exception when insufficient_privilege then null; end;
end $$;
reset role;
-- A verified allowlisted identity gets access without a manual membership row.
insert into myapi_private.contact_admin_emails select lower(email) from auth.users where id=current_setting('myapi.test_user')::uuid;
set local role authenticated;
do $$ begin
  if not public.myapi_is_admin() then raise exception 'Verified allowlisted user denied'; end if;
  if not exists(select 1 from public.myapi_contact_leads) then raise exception 'Allowlist RLS denied'; end if;
end $$;
reset role;
delete from myapi_private.contact_admin_emails where email=(select lower(email) from auth.users where id=current_setting('myapi.test_user')::uuid);
insert into myapi_private.contact_admins values(current_setting('myapi.test_user')::uuid);
set local role authenticated;
do $$ declare old_time timestamptz; affected integer; begin
  if not public.myapi_is_admin() then raise exception 'Admin not recognized'; end if;
  select "updatedAt" into old_time from public.myapi_contact_leads where id='00000000-0000-4000-8000-000000000071';
  update public.myapi_contact_leads set note='Test note', status='contacted' where id='00000000-0000-4000-8000-000000000071' and "updatedAt"=old_time;
  get diagnostics affected=row_count;
  if affected <> 1 then raise exception 'Admin could not update'; end if;
  update public.myapi_contact_leads set note='Stale update' where id='00000000-0000-4000-8000-000000000071' and "updatedAt"=old_time;
  get diagnostics affected=row_count;
  if affected <> 0 then raise exception 'Stale update succeeded'; end if;
  begin update public.myapi_contact_leads set email='changed@example.invalid'; raise exception 'Admin changed customer email'; exception when insufficient_privilege then null; end;
  begin update public.myapi_contact_leads set "notificationStatus"='sent'; raise exception 'Admin forged delivery'; exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'PASS: atomic intake, duplicate/conflict, quota, outbox retry, anon/member/admin RLS, column grants and stale edits' as result;
