-- Seed data for development/staging environments.
-- Run AFTER migrations: psql $DATABASE_URL -f scripts/seed.sql
-- Safe to re-run (uses ON CONFLICT DO NOTHING).

insert into public.courses (id, title, professor_name, semester, section, student_count, current_week, total_weeks, status)
values
  ('11111111-1111-1111-1111-111111111111', '알고리즘 기초', '이현기', '2026-1', '01분반', 45, 3, 15, 'active'),
  ('22222222-2222-2222-2222-222222222222', '자료구조', '정소연', '2026-1', '01분반', 52, 3, 15, 'active'),
  ('33333333-3333-3333-3333-333333333333', '웹 프로그래밍', '이현기', '2026-1', '01분반', 45, 3, 15, 'active')
on conflict (id) do nothing;

insert into public.assignments (id, course_id, title, type, deadline, status, submitted_count, graded_count)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', '실습 3: 정렬 알고리즘 구현', 'coding', '2026-03-06 23:59+09', 'active', 38, 30),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '22222222-2222-2222-2222-222222222222', '과제 2: 스택과 큐 구현', 'coding', '2026-03-09 23:59+09', 'active', 25, 25),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '11111111-1111-1111-1111-111111111111', '프로젝트 보고서 제출', 'file', '2026-03-20 23:59+09', 'draft', 0, 0)
on conflict (id) do nothing;

insert into public.announcements (id, course_id, title, content, pinned, views)
values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '11111111-1111-1111-1111-111111111111', '3주차 실습 과제 제출 기한 연장 안내', '제출 마감이 2일 연장되었습니다.', true, 42),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '22222222-2222-2222-2222-222222222222', '중간고사 일정 및 범위 안내', '중간고사는 4월 첫째주에 진행됩니다.', true, 51)
on conflict (id) do nothing;

insert into public.submissions (id, assignment_id, student_name, student_number, auto_score, final_score, tests_passed, ai_analysis, ai_analysis_variant, status)
values
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '김철수', '20223045', 85, 85, '테스트 17/20 통과', '정상', 'green', 'graded'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '이영희', '20223067', 72, 72, '테스트 14/20 통과', '검토 필요', 'yellow', 'grading'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '최지원', '20223102', null, 0, '-', '-', 'red', 'unsubmitted')
on conflict (id) do nothing;

insert into public.activity_logs (type, user_name, user_role, message, ip)
values
  ('login', '김철수', '학생', '로그인 성공', '192.168.1.42'),
  ('submit', '이영희', '학생', '알고리즘 기초 실습3 제출', '192.168.1.87'),
  ('ai', '박민수', '학생', 'AI튜터 질문 (자료구조)', '192.168.1.31'),
  ('course', '이현기', '교수', '새 강좌 생성: 고급 알고리즘', '192.168.1.15')
on conflict do nothing;
