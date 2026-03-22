-- Add courses.professor_id FK for enrollment-backed queries
alter table public.courses
  add column if not exists professor_id uuid references public.profiles(id);

-- Enrollments: student-course join table
create table if not exists public.enrollments (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references public.courses(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique(course_id, student_id)
);

alter table public.enrollments enable row level security;

drop policy if exists enrollments_student_select on public.enrollments;
create policy enrollments_student_select
  on public.enrollments
  for select
  using (auth.uid() = student_id);

drop policy if exists enrollments_professor_select on public.enrollments;
create policy enrollments_professor_select
  on public.enrollments
  for select
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_id
        and c.professor_id = auth.uid()
    )
  );

-- Course weeks: weekly lecture structure
create table if not exists public.course_weeks (
  id        uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  number    int not null,
  title     text not null,
  status    text not null default 'locked',
  constraint course_weeks_status_check check (status in ('locked', 'in-progress', 'done')),
  unique(course_id, number)
);

alter table public.course_weeks enable row level security;

drop policy if exists course_weeks_select on public.course_weeks;
create policy course_weeks_select
  on public.course_weeks
  for select
  using (
    exists (
      select 1 from public.enrollments e
      where e.course_id = course_id
        and e.student_id = auth.uid()
    )
    or exists (
      select 1 from public.courses c
      where c.id = course_id
        and c.professor_id = auth.uid()
    )
  );

-- Lessons: individual lecture items within a week
create table if not exists public.lessons (
  id           uuid primary key default gen_random_uuid(),
  week_id      uuid not null references public.course_weeks(id) on delete cascade,
  title        text not null,
  type         text not null default 'lecture',
  file_url     text,
  completed_by jsonb not null default '[]',
  order_num    int not null default 0,
  constraint lessons_type_check check (type in ('lecture', 'practice', 'quiz'))
);

alter table public.lessons enable row level security;

drop policy if exists lessons_select on public.lessons;
create policy lessons_select
  on public.lessons
  for select
  using (
    exists (
      select 1
      from public.course_weeks cw
      join public.enrollments e on e.course_id = cw.course_id
      where cw.id = week_id
        and e.student_id = auth.uid()
    )
    or exists (
      select 1
      from public.course_weeks cw
      join public.courses c on c.id = cw.course_id
      where cw.id = week_id
        and c.professor_id = auth.uid()
    )
  );
