alter table public.assignments
  add column if not exists test_cases jsonb default '[]'::jsonb;
