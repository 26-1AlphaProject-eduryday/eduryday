-- Drop existing check constraint FIRST so updates don't violate it
alter table public.submissions drop constraint if exists submissions_status_check;

-- Normalize submission status values: reviewing→grading, complete→graded
update public.submissions set status = 'grading' where status = 'reviewing';
update public.submissions set status = 'graded' where status = 'complete';

-- Re-add check constraint with new values
alter table public.submissions add constraint submissions_status_check
  check (status in ('submitted', 'grading', 'graded', 'unsubmitted'));
