create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  role text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (
    role is null or role in ('student', 'professor', 'admin')
  ),
  constraint profiles_status_check check (
    status in ('pending', 'active', 'suspended')
  )
);

alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists profiles_admin_manage on public.profiles;
create policy profiles_admin_manage
  on public.profiles
  for all
  using ((auth.jwt() ->> 'email') = 'eduryday@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'eduryday@gmail.com');

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_set_profiles_updated_at on public.profiles;
create trigger trg_set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_profiles_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
  final_role text;
  final_status text;
  final_name text;
begin
  requested_role := new.raw_user_meta_data ->> 'requested_role';

  if lower(new.email) = 'eduryday@gmail.com' then
    final_role := 'admin';
    final_status := 'active';
  elsif requested_role in ('student', 'professor') then
    final_role := requested_role;
    final_status := 'pending';
  else
    final_role := null;
    final_status := 'pending';
  end if;

  final_name := coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1));

  insert into public.profiles (id, email, name, role, status)
  values (new.id, new.email, final_name, final_role, final_status)
  on conflict (id) do update
  set
    email = excluded.email,
    name = excluded.name,
    role = coalesce(public.profiles.role, excluded.role),
    status = public.profiles.status,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
