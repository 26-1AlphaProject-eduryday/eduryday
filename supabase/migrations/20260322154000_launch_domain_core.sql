-- Launch domain core: enrollments, course_weeks, lessons
-- and launch fields on courses and submissions

-- Enrollments: tracks which students are enrolled in which courses
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  constraint enrollments_unique unique (course_id, student_id)
);

alter table public.enrollments enable row level security;

drop policy if exists enrollments_select_own on public.enrollments;
create policy enrollments_select_own
  on public.enrollments
  for select
  using (auth.uid() = student_id);

drop policy if exists enrollments_admin_manage on public.enrollments;
create policy enrollments_admin_manage
  on public.enrollments
  for all
  using ((auth.jwt() ->> 'email') = 'eduryday@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'eduryday@gmail.com');

-- Course weeks: weekly units within a course
create table if not exists public.course_weeks (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  week_number int not null,
  title text not null,
  status text not null default 'locked',
  created_at timestamptz not null default now(),
  constraint course_weeks_status_check check (status in ('done', 'in-progress', 'locked')),
  constraint course_weeks_unique unique (course_id, week_number)
);

alter table public.course_weeks enable row level security;

drop policy if exists course_weeks_select on public.course_weeks;
create policy course_weeks_select
  on public.course_weeks
  for select
  using (true);

-- Lessons: individual lesson items within a course week
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_week_id uuid not null references public.course_weeks(id) on delete cascade,
  title text not null,
  type text not null default 'lecture',
  completed boolean not null default false,
  active boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  constraint lessons_type_check check (type in ('lecture', 'practice', 'quiz'))
);

alter table public.lessons enable row level security;

drop policy if exists lessons_select on public.lessons;
create policy lessons_select
  on public.lessons
  for select
  using (true);

-- Add launch fields to courses if missing
alter table public.courses
  add column if not exists description text,
  add column if not exists thumbnail_url text,
  add column if not exists professor_id uuid references public.profiles(id);

-- Add launch fields to submissions if missing
alter table public.submissions
  add column if not exists ai_analysis_variant text,
  add column if not exists feedback text;
