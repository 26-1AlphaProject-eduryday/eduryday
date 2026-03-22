create table if not exists public.ui_seed_data (
  key text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.ui_seed_data enable row level security;

drop policy if exists anon_read_ui_seed_data on public.ui_seed_data;
drop policy if exists ui_seed_data_public_read on public.ui_seed_data;
create policy ui_seed_data_public_read
  on public.ui_seed_data
  for select
  to anon, authenticated
  using (true);

drop trigger if exists trg_ui_seed_data_touch_updated_at on public.ui_seed_data;
create trigger trg_ui_seed_data_touch_updated_at
before update on public.ui_seed_data
for each row
execute function public.touch_updated_at();

insert into public.ui_seed_data (key, payload)
select key, payload
from (
  values
    ('landing_features', '[{"title":"Split-View IDE","description":"강의와 코드 에디터를 한 화면에서. 창 전환 없이 집중 학습."},{"title":"AI 튜터","description":"24시간 질문 가능. 정답이 아닌 힌트로 사고력 향상."},{"title":"No-Code 채점","description":"자연어로 채점 기준 설정. 코드 작성 없이 자동 채점."}]'::jsonb),
    ('landing_stats', '[{"value":"90%+","label":"채점 시간 절감"},{"value":"3초","label":"평균 피드백 응답"},{"value":"24/7","label":"AI 튜터 지원"},{"value":"100%","label":"공정한 학습 기회"}]'::jsonb),
    ('landing_team', '[{"name":"심준","role":"팀장·PM","description":"프론트엔드, MLOps 설계"},{"name":"남호현","role":"MLOps","description":"백엔드 아키텍처, API"},{"name":"목진협","role":"풀스택","description":"Supabase, DevOps"},{"name":"신태환","role":"프론트엔드","description":"UI 구현, API 연동"},{"name":"오세웅","role":"PM·QA","description":"일정 관리, 테스트"}]'::jsonb),
    ('landing_faq', '[{"question":"EduRyday는 누가 사용할 수 있나요?","answer":"현재 국민대학교 소프트웨어학과 학생과 교수님을 대상으로 운영됩니다. 향후 전체 학교로 확대할 예정입니다."},{"question":"AI 튜터는 어떻게 작동하나요?","answer":"RAG(Retrieval-Augmented Generation) 기술을 활용하여 강의 자료 기반으로 답변합니다. 힌트 중심으로 사고력을 키울 수 있도록 설계되어 있습니다."},{"question":"No-Code 채점은 무엇인가요?","answer":"교수님이 자연어로 채점 기준을 입력하면 AI가 자동으로 채점 로직을 생성합니다."},{"question":"코딩 실습은 어떤 언어를 지원하나요?","answer":"현재 Python, Java, C++, JavaScript를 지원하며, 추후 더 많은 언어를 지원할 예정입니다."},{"question":"무료로 사용할 수 있나요?","answer":"국민대학교 구성원이라면 무료로 이용 가능합니다. 학교 이메일(@kookmin.ac.kr) 또는 학교 계정으로 로그인하시면 됩니다."}]'::jsonb)
) as seed_data(key, payload)
on conflict (key)
do update set
  payload = excluded.payload;

delete from public.ui_seed_data
where key not in (
  'landing_features',
  'landing_stats',
  'landing_team',
  'landing_faq'
);
