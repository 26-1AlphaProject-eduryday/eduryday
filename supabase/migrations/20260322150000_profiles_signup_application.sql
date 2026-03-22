-- Add student_id and department columns to profiles for signup application form
alter table public.profiles
  add column if not exists student_id text,
  add column if not exists department text;
