-- Tighten submissions RLS: students can only insert their own, professors/admins manage all
-- Drop the overly permissive write policy
drop policy if exists submissions_write_all on public.submissions;

-- Students can INSERT their own submissions only
create policy submissions_student_insert on public.submissions
  for insert
  with check (auth.uid() = student_id);

-- Students can SELECT their own submissions
drop policy if exists submissions_select_all on public.submissions;
create policy submissions_select_own on public.submissions
  for select
  using (
    auth.uid() = student_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('professor', 'admin')
    )
  );

-- Professors and admins can UPDATE submissions (for grading)
create policy submissions_staff_update on public.submissions
  for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('professor', 'admin')
    )
  );

-- Only admins can DELETE submissions
create policy submissions_admin_delete on public.submissions
  for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
