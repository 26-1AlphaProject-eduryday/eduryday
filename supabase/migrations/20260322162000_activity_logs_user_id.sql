-- Add user_id FK to activity_logs for reliable user tracking
alter table public.activity_logs
  add column if not exists user_id uuid references public.profiles(id);

-- Index for efficient lookups
create index if not exists idx_activity_logs_user_id on public.activity_logs(user_id);
