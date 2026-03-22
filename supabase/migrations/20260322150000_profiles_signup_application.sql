alter table public.profiles
  add column if not exists student_id text,
  add column if not exists department text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  final_role text;
  final_status text;
  final_name text;
begin
  if lower(new.email) = 'eduryday@gmail.com' then
    final_role := 'admin';
    final_status := 'active';
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
    role = case
      when lower(excluded.email) = 'eduryday@gmail.com' then 'admin'
      else public.profiles.role
    end,
    status = case
      when lower(excluded.email) = 'eduryday@gmail.com' then 'active'
      else public.profiles.status
    end,
    updated_at = now();

  return new;
end;
$$;
