alter table public.courses
  add column if not exists description text,
  add column if not exists professor_id uuid references public.profiles(id);

update public.courses
set professor_id = created_by
where professor_id is null and created_by is not null;

alter table public.submissions
  add column if not exists file_url text,
  add column if not exists feedback text;

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (course_id, student_id)
);

create table if not exists public.course_weeks (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  number int not null,
  title text not null,
  status text not null default 'locked',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint course_weeks_status_check check (status in ('locked', 'in-progress', 'done')),
  unique (course_id, number)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.course_weeks(id) on delete cascade,
  title text not null,
  type text not null,
  file_url text,
  completed_by jsonb not null default '[]'::jsonb,
  order_num int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lessons_type_check check (type in ('lecture', 'practice', 'quiz'))
);

alter table public.enrollments enable row level security;
alter table public.course_weeks enable row level security;
alter table public.lessons enable row level security;

drop policy if exists enrollments_select_own_or_staff on public.enrollments;
create policy enrollments_select_own_or_staff
  on public.enrollments
  for select
  using (
    student_id = auth.uid()
    or (auth.jwt() ->> 'email') = 'eduryday@gmail.com'
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'professor'
        and p.status = 'active'
    )
  );

drop policy if exists enrollments_write_staff on public.enrollments;
create policy enrollments_write_staff
  on public.enrollments
  for all
  using (
    (auth.jwt() ->> 'email') = 'eduryday@gmail.com'
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'professor'
        and p.status = 'active'
    )
  )
  with check (
    (auth.jwt() ->> 'email') = 'eduryday@gmail.com'
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'professor'
        and p.status = 'active'
    )
  );

drop policy if exists course_weeks_select_enrolled_or_staff on public.course_weeks;
create policy course_weeks_select_enrolled_or_staff
  on public.course_weeks
  for select
  using (
    exists (
      select 1
      from public.enrollments e
      where e.course_id = course_weeks.course_id
        and e.student_id = auth.uid()
    )
    or (auth.jwt() ->> 'email') = 'eduryday@gmail.com'
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'professor'
        and p.status = 'active'
    )
  );

drop policy if exists course_weeks_write_staff on public.course_weeks;
create policy course_weeks_write_staff
  on public.course_weeks
  for all
  using (
    (auth.jwt() ->> 'email') = 'eduryday@gmail.com'
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'professor'
        and p.status = 'active'
    )
  )
  with check (
    (auth.jwt() ->> 'email') = 'eduryday@gmail.com'
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'professor'
        and p.status = 'active'
    )
  );

drop policy if exists lessons_select_enrolled_or_staff on public.lessons;
create policy lessons_select_enrolled_or_staff
  on public.lessons
  for select
  using (
    exists (
      select 1
      from public.course_weeks cw
      join public.enrollments e on e.course_id = cw.course_id
      where cw.id = lessons.week_id
        and e.student_id = auth.uid()
    )
    or (auth.jwt() ->> 'email') = 'eduryday@gmail.com'
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'professor'
        and p.status = 'active'
    )
  );

drop policy if exists lessons_write_staff on public.lessons;
create policy lessons_write_staff
  on public.lessons
  for all
  using (
    (auth.jwt() ->> 'email') = 'eduryday@gmail.com'
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'professor'
        and p.status = 'active'
    )
  )
  with check (
    (auth.jwt() ->> 'email') = 'eduryday@gmail.com'
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'professor'
        and p.status = 'active'
    )
  );

drop trigger if exists trg_course_weeks_touch_updated_at on public.course_weeks;
create trigger trg_course_weeks_touch_updated_at
before update on public.course_weeks
for each row
execute function public.touch_updated_at();

drop trigger if exists trg_lessons_touch_updated_at on public.lessons;
create trigger trg_lessons_touch_updated_at
before update on public.lessons
for each row
execute function public.touch_updated_at();
