create or replace function public.is_active_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
      and p.status = 'active'
  );
$$;

create or replace function public.is_active_professor()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'professor'
      and p.status = 'active'
  );
$$;

create or replace function public.owns_course(target_course_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.courses c
    where c.id = target_course_id
      and (
        c.created_by = auth.uid()
        or c.professor_id = auth.uid()
      )
  );
$$;

create or replace function public.can_manage_course(target_course_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_active_admin()
    or (
      public.is_active_professor()
      and public.owns_course(target_course_id)
    );
$$;

create or replace function public.can_manage_assignment(target_assignment_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.assignments a
    where a.id = target_assignment_id
      and public.can_manage_course(a.course_id)
  );
$$;

create or replace function public.is_enrolled_in_course(target_course_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.enrollments e
    where e.course_id = target_course_id
      and e.student_id = auth.uid()
  );
$$;

grant execute on function public.is_active_admin() to authenticated;
grant execute on function public.is_active_professor() to authenticated;
grant execute on function public.owns_course(uuid) to authenticated;
grant execute on function public.can_manage_course(uuid) to authenticated;
grant execute on function public.can_manage_assignment(uuid) to authenticated;
grant execute on function public.is_enrolled_in_course(uuid) to authenticated;

drop policy if exists profiles_admin_manage on public.profiles;
create policy profiles_admin_manage
  on public.profiles
  for all
  using (public.is_active_admin())
  with check (public.is_active_admin());

drop policy if exists courses_select_all on public.courses;
create policy courses_select_readable
  on public.courses
  for select
  using (
    public.is_active_admin()
    or public.owns_course(id)
    or public.is_enrolled_in_course(id)
  );

drop policy if exists courses_write_prof_or_admin on public.courses;
create policy courses_insert_staff
  on public.courses
  for insert
  with check (
    public.is_active_admin()
    or (
      public.is_active_professor()
      and (
        created_by = auth.uid()
        or professor_id = auth.uid()
      )
    )
  );

create policy courses_update_owner
  on public.courses
  for update
  using (public.can_manage_course(id))
  with check (public.can_manage_course(id));

create policy courses_delete_owner
  on public.courses
  for delete
  using (public.can_manage_course(id));

drop policy if exists assignments_select_all on public.assignments;
create policy assignments_select_readable
  on public.assignments
  for select
  using (
    public.can_manage_course(course_id)
    or public.is_enrolled_in_course(course_id)
  );

drop policy if exists assignments_write_prof_or_admin on public.assignments;
create policy assignments_write_owner
  on public.assignments
  for all
  using (public.can_manage_course(course_id))
  with check (public.can_manage_course(course_id));

drop policy if exists announcements_select_all on public.announcements;
create policy announcements_select_readable
  on public.announcements
  for select
  using (
    public.can_manage_course(course_id)
    or public.is_enrolled_in_course(course_id)
  );

drop policy if exists announcements_write_prof_or_admin on public.announcements;
create policy announcements_write_owner
  on public.announcements
  for all
  using (public.can_manage_course(course_id))
  with check (public.can_manage_course(course_id));

drop policy if exists submissions_select_all on public.submissions;
create policy submissions_select_readable
  on public.submissions
  for select
  using (
    student_id = auth.uid()
    or exists (
      select 1
      from public.assignments a
      where a.id = submissions.assignment_id
        and public.can_manage_course(a.course_id)
    )
  );

drop policy if exists submissions_write_all on public.submissions;
create policy submissions_insert_student
  on public.submissions
  for insert
  with check (
    student_id = auth.uid()
    and exists (
      select 1
      from public.assignments a
      where a.id = submissions.assignment_id
        and public.is_enrolled_in_course(a.course_id)
    )
  );

create policy submissions_update_staff
  on public.submissions
  for update
  using (public.can_manage_assignment(assignment_id))
  with check (public.can_manage_assignment(assignment_id));

create policy submissions_delete_staff
  on public.submissions
  for delete
  using (public.can_manage_assignment(assignment_id));

drop policy if exists logs_select_admin on public.activity_logs;
create policy logs_select_admin
  on public.activity_logs
  for select
  using (public.is_active_admin());

drop policy if exists enrollments_select_own_or_staff on public.enrollments;
create policy enrollments_select_readable
  on public.enrollments
  for select
  using (
    student_id = auth.uid()
    or public.can_manage_course(course_id)
  );

drop policy if exists enrollments_write_staff on public.enrollments;
create policy enrollments_write_owner
  on public.enrollments
  for all
  using (public.can_manage_course(course_id))
  with check (public.can_manage_course(course_id));

drop policy if exists course_weeks_select_enrolled_or_staff on public.course_weeks;
create policy course_weeks_select_readable
  on public.course_weeks
  for select
  using (
    public.can_manage_course(course_id)
    or public.is_enrolled_in_course(course_id)
  );

drop policy if exists course_weeks_write_staff on public.course_weeks;
create policy course_weeks_write_owner
  on public.course_weeks
  for all
  using (public.can_manage_course(course_id))
  with check (public.can_manage_course(course_id));

drop policy if exists lessons_select_enrolled_or_staff on public.lessons;
create policy lessons_select_readable
  on public.lessons
  for select
  using (
    exists (
      select 1
      from public.course_weeks cw
      where cw.id = lessons.week_id
        and public.can_manage_course(cw.course_id)
    )
    or exists (
      select 1
      from public.course_weeks cw
      where cw.id = lessons.week_id
        and public.is_enrolled_in_course(cw.course_id)
    )
  );

drop policy if exists lessons_write_staff on public.lessons;
create policy lessons_write_owner
  on public.lessons
  for all
  using (
    exists (
      select 1
      from public.course_weeks cw
      where cw.id = lessons.week_id
        and public.can_manage_course(cw.course_id)
    )
  )
  with check (
    exists (
      select 1
      from public.course_weeks cw
      where cw.id = lessons.week_id
        and public.can_manage_course(cw.course_id)
    )
  );
