alter table public.lessons drop constraint if exists lessons_type_check;

alter table public.lessons add constraint lessons_type_check
  check (type in ('lecture', 'practice', 'quiz', 'document'));
