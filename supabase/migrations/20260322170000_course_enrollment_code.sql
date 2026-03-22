-- Add enrollment code for student self-enrollment
alter table public.courses
  add column if not exists enrollment_code text;

-- Unique index on enrollment_code (only for non-null values)
create unique index if not exists idx_courses_enrollment_code
  on public.courses(enrollment_code)
  where enrollment_code is not null;
