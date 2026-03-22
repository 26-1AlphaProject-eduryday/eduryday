-- AI Tutor conversation storage
create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) not null,
  course_id uuid references public.courses(id),
  title text not null default '새 대화',
  messages jsonb not null default '[]'::jsonb,
  message_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.ai_conversations enable row level security;

create policy ai_conversations_student_select on public.ai_conversations
  for select using (auth.uid() = student_id);

create policy ai_conversations_student_insert on public.ai_conversations
  for insert with check (auth.uid() = student_id);

create policy ai_conversations_student_update on public.ai_conversations
  for update using (auth.uid() = student_id);

create policy ai_conversations_student_delete on public.ai_conversations
  for delete using (auth.uid() = student_id);

-- Indexes
create index idx_ai_conversations_student on public.ai_conversations(student_id);
create index idx_ai_conversations_course on public.ai_conversations(course_id);
create index idx_ai_conversations_updated on public.ai_conversations(updated_at desc);
