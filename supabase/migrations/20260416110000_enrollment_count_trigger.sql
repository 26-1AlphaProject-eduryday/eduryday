-- Auto-sync courses.student_count on enrollment changes
create or replace function public.sync_student_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.courses
    set student_count = (select count(*) from public.enrollments where course_id = NEW.course_id)
    where id = NEW.course_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.courses
    set student_count = (select count(*) from public.enrollments where course_id = OLD.course_id)
    where id = OLD.course_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_sync_student_count on public.enrollments;
create trigger trg_sync_student_count
  after insert or delete on public.enrollments
  for each row execute function public.sync_student_count();
