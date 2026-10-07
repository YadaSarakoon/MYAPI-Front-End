create table myapi_private.contact_admin_emails (
  email text primary key check (email = lower(email) and email <> '')
);
alter table myapi_private.contact_admin_emails enable row level security;
revoke all on myapi_private.contact_admin_emails from public, anon, authenticated;
grant all on myapi_private.contact_admin_emails to service_role;
insert into myapi_private.contact_admin_emails(email) values ('yada@myorder.ai'), ('sukanya@myorder.ai');
create or replace function myapi_private.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (
    select 1 from auth.users u
    where u.id = auth.uid() and u.email_confirmed_at is not null and u.deleted_at is null
      and (u.banned_until is null or u.banned_until < now())
      and (
        exists (select 1 from myapi_private.contact_admins a where a.user_id = u.id)
        or exists (select 1 from myapi_private.contact_admin_emails a where a.email = lower(u.email))
      )
  );
$$;
revoke all on function myapi_private.is_admin() from public, anon;
grant execute on function myapi_private.is_admin() to authenticated;
