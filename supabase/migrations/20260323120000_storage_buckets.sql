-- Create storage buckets for assignment files, lesson materials, and submission files
-- NOTE: If this fails due to permissions, create buckets manually via Supabase dashboard:
--   Storage > New bucket > assignment-files (private), lesson-materials (private), submission-files (private)

insert into storage.buckets (id, name, public)
values
  ('assignment-files', 'assignment-files', false),
  ('lesson-materials', 'lesson-materials', false),
  ('submission-files', 'submission-files', false)
on conflict (id) do nothing;

-- Storage RLS policies
-- Students can upload/read their own submission files
drop policy if exists "student_upload_own_submissions" on storage.objects;
create policy "student_upload_own_submissions" on storage.objects
  for insert with check (
    bucket_id = 'submission-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "student_read_own_submissions" on storage.objects;
create policy "student_read_own_submissions" on storage.objects
  for select using (
    bucket_id = 'submission-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Professors/admins can read all submission files
drop policy if exists "staff_read_submissions" on storage.objects;
create policy "staff_read_submissions" on storage.objects
  for select using (
    bucket_id = 'submission-files'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('professor', 'admin')
    )
  );

-- Professors can upload lesson materials and assignment files
drop policy if exists "professor_upload_lessons" on storage.objects;
create policy "professor_upload_lessons" on storage.objects
  for insert with check (
    bucket_id in ('lesson-materials', 'assignment-files')
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('professor', 'admin')
    )
  );

drop policy if exists "professor_update_lessons" on storage.objects;
create policy "professor_update_lessons" on storage.objects
  for update using (
    bucket_id in ('lesson-materials', 'assignment-files')
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('professor', 'admin')
    )
  );

-- All authenticated users can read lesson materials and assignment files
drop policy if exists "authenticated_read_lessons" on storage.objects;
create policy "authenticated_read_lessons" on storage.objects
  for select using (
    bucket_id in ('lesson-materials', 'assignment-files')
    and auth.role() = 'authenticated'
  );
