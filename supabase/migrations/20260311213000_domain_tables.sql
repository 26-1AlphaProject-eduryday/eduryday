create extension if not exists pgcrypto;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  professor_name text not null,
  semester text not null,
  section text,
  student_count int not null default 0,
  current_week int not null default 1,
  total_weeks int not null default 15,
  status text not null default 'active',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint courses_status_check check (status in ('active', 'closed', 'draft', 'pending'))
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  type text not null default 'coding',
  deadline timestamptz,
  rubric jsonb not null default '[]'::jsonb,
  max_score int not null default 100,
  status text not null default 'draft',
  submitted_count int not null default 0,
  graded_count int not null default 0,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint assignments_type_check check (type in ('coding', 'essay', 'multiple-choice', 'file')),
  constraint assignments_status_check check (status in ('draft', 'active', 'closed'))
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  content text not null,
  pinned boolean not null default false,
  views int not null default 0,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid references public.profiles(id),
  student_name text not null,
  student_number text,
  content text,
  auto_score int,
  final_score int,
  tests_passed text,
  ai_analysis text,
  ai_analysis_variant text not null default 'green',
  ai_sub_note text,
  status text not null default 'submitted',
  submitted_at timestamptz not null default now(),
  graded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint submissions_status_check check (status in ('submitted', 'reviewing', 'complete', 'unsubmitted'))
);

create table if not exists public.activity_logs (
  id bigserial primary key,
  type text not null,
  user_name text not null,
  user_role text,
  message text not null,
  ip text,
  created_at timestamptz not null default now(),
  constraint activity_logs_type_check check (type in ('login', 'submit', 'ai', 'course', 'error', 'grading', 'access'))
);

alter table public.courses enable row level security;
alter table public.assignments enable row level security;
alter table public.announcements enable row level security;
alter table public.submissions enable row level security;
alter table public.activity_logs enable row level security;

drop policy if exists courses_select_all on public.courses;
create policy courses_select_all on public.courses for select using (true);

drop policy if exists courses_write_prof_or_admin on public.courses;
create policy courses_write_prof_or_admin
  on public.courses
  for all
  using ((auth.jwt() ->> 'email') = 'eduryday@gmail.com' or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'professor' and p.status = 'active'
  ))
  with check ((auth.jwt() ->> 'email') = 'eduryday@gmail.com' or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'professor' and p.status = 'active'
  ));

drop policy if exists assignments_select_all on public.assignments;
create policy assignments_select_all on public.assignments for select using (true);

drop policy if exists assignments_write_prof_or_admin on public.assignments;
create policy assignments_write_prof_or_admin
  on public.assignments
  for all
  using ((auth.jwt() ->> 'email') = 'eduryday@gmail.com' or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'professor' and p.status = 'active'
  ))
  with check ((auth.jwt() ->> 'email') = 'eduryday@gmail.com' or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'professor' and p.status = 'active'
  ));

drop policy if exists announcements_select_all on public.announcements;
create policy announcements_select_all on public.announcements for select using (true);

drop policy if exists announcements_write_prof_or_admin on public.announcements;
create policy announcements_write_prof_or_admin
  on public.announcements
  for all
  using ((auth.jwt() ->> 'email') = 'eduryday@gmail.com' or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'professor' and p.status = 'active'
  ))
  with check ((auth.jwt() ->> 'email') = 'eduryday@gmail.com' or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'professor' and p.status = 'active'
  ));

drop policy if exists submissions_select_all on public.submissions;
create policy submissions_select_all on public.submissions for select using (true);

drop policy if exists submissions_write_all on public.submissions;
create policy submissions_write_all on public.submissions for all using (true) with check (true);

drop policy if exists logs_select_admin on public.activity_logs;
create policy logs_select_admin
  on public.activity_logs
  for select
  using ((auth.jwt() ->> 'email') = 'eduryday@gmail.com');

drop policy if exists logs_insert_all on public.activity_logs;
create policy logs_insert_all on public.activity_logs for insert with check (true);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_courses_touch_updated_at on public.courses;
create trigger trg_courses_touch_updated_at before update on public.courses for each row execute function public.touch_updated_at();

drop trigger if exists trg_assignments_touch_updated_at on public.assignments;
create trigger trg_assignments_touch_updated_at before update on public.assignments for each row execute function public.touch_updated_at();

drop trigger if exists trg_announcements_touch_updated_at on public.announcements;
create trigger trg_announcements_touch_updated_at before update on public.announcements for each row execute function public.touch_updated_at();

drop trigger if exists trg_submissions_touch_updated_at on public.submissions;
create trigger trg_submissions_touch_updated_at before update on public.submissions for each row execute function public.touch_updated_at();

insert into public.courses (id, title, professor_name, semester, section, student_count, current_week, total_weeks, status)
values
  ('11111111-1111-1111-1111-111111111111', '알고리즘 기초', '이현기', '2026-1', '01분반', 45, 3, 15, 'active'),
  ('22222222-2222-2222-2222-222222222222', '자료구조', '정소연', '2026-1', '01분반', 52, 3, 15, 'active'),
  ('33333333-3333-3333-3333-333333333333', '웹 프로그래밍', '이현기', '2026-1', '01분반', 45, 3, 15, 'active')
on conflict (id) do nothing;

insert into public.assignments (id, course_id, title, type, deadline, status, submitted_count, graded_count)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', '실습 3: 정렬 알고리즘 구현', 'coding', '2026-03-06 23:59+09', 'active', 38, 30),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '22222222-2222-2222-2222-222222222222', '과제 2: 스택과 큐 구현', 'coding', '2026-03-09 23:59+09', 'active', 25, 25),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '11111111-1111-1111-1111-111111111111', '프로젝트 보고서 제출', 'file', '2026-03-20 23:59+09', 'draft', 0, 0)
on conflict (id) do nothing;

insert into public.announcements (id, course_id, title, content, pinned, views)
values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '11111111-1111-1111-1111-111111111111', '3주차 실습 과제 제출 기한 연장 안내', '제출 마감이 2일 연장되었습니다.', true, 42),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '22222222-2222-2222-2222-222222222222', '중간고사 일정 및 범위 안내', '중간고사는 4월 첫째주에 진행됩니다.', true, 51)
on conflict (id) do nothing;

insert into public.submissions (id, assignment_id, student_name, student_number, auto_score, final_score, tests_passed, ai_analysis, ai_analysis_variant, status)
values
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '김철수', '20223045', 85, 85, '테스트 17/20 통과', '정상', 'green', 'complete'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '이영희', '20223067', 72, 72, '테스트 14/20 통과', '검토 필요', 'yellow', 'reviewing'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '최지원', '20223102', null, 0, '-', '-', 'red', 'unsubmitted')
on conflict (id) do nothing;

insert into public.activity_logs (type, user_name, user_role, message, ip)
values
  ('login', '김철수', '학생', '로그인 성공', '192.168.1.42'),
  ('submit', '이영희', '학생', '알고리즘 기초 실습3 제출', '192.168.1.87'),
  ('ai', '박민수', '학생', 'AI튜터 질문 (자료구조)', '192.168.1.31'),
  ('course', '이현기', '교수', '새 강좌 생성: 고급 알고리즘', '192.168.1.15')
on conflict do nothing;
