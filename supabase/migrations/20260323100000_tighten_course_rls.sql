-- Tighten RLS on courses, assignments, announcements
-- Students see only enrolled courses; professors see own; admin sees all

-- COURSES
drop policy if exists courses_select_all on public.courses;
drop policy if exists courses_select_own on public.courses;
create policy courses_select_own on public.courses
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
    or created_by = auth.uid()
    or exists (
      select 1 from public.enrollments e
      where e.course_id = public.courses.id and e.student_id = auth.uid()
    )
  );

-- ASSIGNMENTS
drop policy if exists assignments_select_all on public.assignments;
drop policy if exists assignments_select_scoped on public.assignments;
create policy assignments_select_scoped on public.assignments
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'professor')
    )
    or exists (
      select 1 from public.enrollments e
      where e.course_id = public.assignments.course_id and e.student_id = auth.uid()
    )
  );

-- ANNOUNCEMENTS
drop policy if exists announcements_select_all on public.announcements;
drop policy if exists announcements_select_scoped on public.announcements;
create policy announcements_select_scoped on public.announcements
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'professor')
    )
    or exists (
      select 1 from public.enrollments e
      where e.course_id = public.announcements.course_id and e.student_id = auth.uid()
    )
  );
