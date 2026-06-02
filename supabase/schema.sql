create table if not exists public.ui_seed_data (
  key text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.ui_seed_data enable row level security;

drop policy if exists anon_read_ui_seed_data on public.ui_seed_data;
create policy anon_read_ui_seed_data
  on public.ui_seed_data
  for select
  using (true);

insert into public.ui_seed_data (key, payload)
values
  (
    'current_student',
    '{"id":"student-1","name":"심준","email":"simjoon@kookmin.ac.kr"}'::jsonb
  ),
  (
    'current_professor',
    '{"id":"professor-1","name":"이현기","title":"교수님","email":"hyunki@kookmin.ac.kr"}'::jsonb
  ),
  (
    'student_courses',
    '[{"id":"1","title":"알고리즘 기초","professor":"이현기 교수님","progress":65},{"id":"2","title":"자료구조","professor":"김철수 교수님","progress":40},{"id":"3","title":"웹프로그래밍","professor":"박영희 교수님","progress":80}]'::jsonb
  ),
  (
    'professor_courses',
    '[{"id":"1","title":"알고리즘 기초","semester":"2026-1학기 01분반","students":45,"currentWeek":3,"totalWeeks":15},{"id":"2","title":"자료구조","semester":"2026-1학기 01분반","students":52,"currentWeek":3,"totalWeeks":15}]'::jsonb
  ),
  (
    'course_weeks',
    '[{"id":"w1","number":1,"title":"개요","status":"done"},{"id":"w2","number":2,"title":"시간복잡도","status":"done"},{"id":"w3","number":3,"title":"정렬","status":"in-progress","lessons":[{"id":"l1","title":"강의 1: 버블정렬","type":"lecture","completed":true},{"id":"l2","title":"강의 2: 선택정렬","type":"lecture","completed":true},{"id":"l3","title":"실습 1: 정렬 구현","type":"practice","completed":false,"active":true},{"id":"l4","title":"퀴즈","type":"quiz","completed":false}]},{"id":"w4","number":4,"title":"탐색","status":"locked"}]'::jsonb
  ),
  (
    'course_resources',
    '[{"id":"r1","title":"강의 1: 버블정렬","completed":true},{"id":"r2","title":"강의 2: 선택정렬","completed":true},{"id":"r3","title":"정렬 알고리즘 개념 정리.pdf","completed":false,"isPdf":true}]'::jsonb
  ),
  (
    'deadlines',
    '[{"id":"1","title":"실습 3: 정렬 알고리즘","course":"알고리즘 기초","dday":"D-2","ddayUrgent":true,"date":"1월 23일 23:59"},{"id":"2","title":"과제 2: 스택과 큐 구현","course":"자료구조","dday":"D-5","ddayUrgent":false,"date":"1월 26일 23:59"}]'::jsonb
  ),
  (
    'rubric_criteria',
    '[{"id":1,"weight":30,"description":"정렬이 올바르게 되었는지 확인해줘. 오름차순으로 정렬되어야 해.","aiResult":"assert output == sorted(input)"},{"id":2,"weight":30,"description":"시간 복잡도가 O(n log n) 이하인지 검사해줘. 대용량 데이터(10000개)에서 1초 이내.","aiResult":"runtime_limit(1.0s), test_with(generate_random(10000))"},{"id":3,"weight":20,"description":"변수명이 직관적이고 PEP8 규칙을 따르는지 확인해줘.","aiResult":"static_analysis(naming_convention)"},{"id":4,"weight":20,"description":"엣지 케이스를 처리했는지 확인해줘 (빈 배열, 단일 원소 등).","aiResult":"test_cases([[], [1], [-1, 0, 1]])"}]'::jsonb
  ),
  (
    'test_results',
    '[{"label":"테스트 1: 기본 케이스","status":"pass","detail":"12ms"},{"label":"테스트 2: 빈 배열","status":"pass","detail":"8ms"},{"label":"테스트 3: 대용량 데이터","status":"fail","detail":"시간 초과"}]'::jsonb
  ),
  (
    'submissions',
    '[{"id":"1","name":"김철수","studentId":"20223045","submittedAt":"01.21 14:32","autoScore":"85/100","testsPassed":"테스트 17/20 통과","aiAnalysis":"정상","aiAnalysisVariant":"green","finalScore":"85","status":"graded"},{"id":"2","name":"이영희","studentId":"20223067","submittedAt":"01.21 15:45","autoScore":"72/100","testsPassed":"테스트 14/20 통과","aiAnalysis":"검토 필요","aiAnalysisVariant":"yellow","aiSubNote":"표절 의심","finalScore":"72","status":"grading"},{"id":"3","name":"박민수","studentId":"20223089","submittedAt":"01.22 09:12","autoScore":"100/100","testsPassed":"테스트 20/20 통과","aiAnalysis":"우수","aiAnalysisVariant":"green","finalScore":"100","status":"graded"},{"id":"4","name":"최지원","studentId":"20223102","submittedAt":"-","autoScore":"-","testsPassed":"-","aiAnalysis":"-","aiAnalysisVariant":"red","finalScore":"0","status":"unsubmitted"}]'::jsonb
  ),
  (
    'conversations',
    '[{"id":"1","title":"정렬 알고리즘 질문","course":"알고리즘 기초 · 3주차","time":"방금 전","active":true},{"id":"2","title":"재귀 함수 이해","course":"알고리즘 기초 · 2주차","time":"어제"},{"id":"3","title":"시간복잡도 계산","course":"알고리즘 기초 · 2주차","time":"3일 전"},{"id":"4","title":"스택 구현 방법","course":"자료구조 · 5주차","time":"1주 전"}]'::jsonb
  ),
  (
    'professor_assignments',
    '[{"id":"1","title":"실습 3: 정렬 알고리즘 구현","course":"알고리즘 기초","type":"coding","deadline":"2026-03-06 23:59","submitted":38,"total":45,"graded":30,"status":"active"},{"id":"2","title":"과제 2: 스택과 큐 구현","course":"자료구조","type":"coding","deadline":"2026-03-09 23:59","submitted":25,"total":52,"graded":25,"status":"active"},{"id":"3","title":"주관식 에세이: 알고리즘 복잡도 분석","course":"알고리즘 기초","type":"essay","deadline":"2026-02-28 23:59","submitted":45,"total":45,"graded":45,"status":"closed"},{"id":"4","title":"중간고사 대비 퀴즈","course":"자료구조","type":"multiple-choice","deadline":"2026-02-20 23:59","submitted":52,"total":52,"graded":52,"status":"closed"},{"id":"5","title":"프로젝트 보고서 제출","course":"알고리즘 기초","type":"file","deadline":"2026-03-20 23:59","submitted":0,"total":45,"graded":0,"status":"draft"}]'::jsonb
  ),
  (
    'professor_announcements',
    '[{"id":"1","title":"3주차 실습 과제 제출 기한 연장 안내","course":"알고리즘 기초","createdAt":"2026-03-03","views":42,"pinned":true},{"id":"2","title":"중간고사 일정 및 범위 안내","course":"자료구조","createdAt":"2026-03-01","views":51,"pinned":true},{"id":"3","title":"강의 자료 업데이트 완료 (2주차)","course":"알고리즘 기초","createdAt":"2026-02-24","views":38,"pinned":false},{"id":"4","title":"수업 보강 일정 공지 (3/10 -> 3/15)","course":"자료구조","createdAt":"2026-02-20","views":47,"pinned":false}]'::jsonb
  ),
  (
    'student_grades',
    '[{"id":"g1","course":"알고리즘 기초","assignment":"퀴즈 1: 시간복잡도","score":92,"maxScore":100,"feedback":"시간복잡도 분석이 정확합니다. Big-O 표기법 사용이 훌륭합니다.","submittedAt":"2026-01-14","status":"graded"},{"id":"g2","course":"알고리즘 기초","assignment":"보고서: 알고리즘 분석","score":85,"maxScore":100,"feedback":"분석이 체계적이나 공간복잡도 논의가 부족합니다. 다음 과제에 반영하세요.","submittedAt":"2026-01-18","status":"graded"},{"id":"g3","course":"자료구조","assignment":"과제 1: 배열과 연결리스트","score":78,"maxScore":100,"feedback":"연결리스트 삭제 로직에 버그가 있습니다. 경계 케이스(빈 리스트)를 처리해주세요.","submittedAt":"2026-01-11","status":"graded"},{"id":"g4","course":"웹프로그래밍","assignment":"실습 1: HTML/CSS 레이아웃","score":95,"maxScore":100,"feedback":"시맨틱 HTML 구조가 우수하고 반응형 레이아웃이 잘 구현되었습니다.","submittedAt":"2026-01-09","status":"graded"},{"id":"g5","course":"자료구조","assignment":"과제 2: 스택과 큐 구현","score":0,"maxScore":100,"feedback":"","submittedAt":"—","status":"pending"}]'::jsonb
  ),
  (
    'learning_stats',
    '[{"label":"총 학습시간","value":"48시간","trend":"이번 달 +12시간","trendColor":"green"},{"label":"완료 강좌","value":"1개","trend":"수강 중 3개","trendColor":"green"},{"label":"평균 점수","value":"87.5점","trend":"상위 15%","trendColor":"green"}]'::jsonb
  ),
  (
    'completed_courses',
    '[{"id":"c0","title":"컴퓨터과학 개론","semester":"2025-2학기","grade":"A+"}]'::jsonb
  ),
  (
    'professor_dashboard_stats',
    '[{"label":"운영중인 강좌","value":"3개"},{"label":"전체 수강생","value":"127명"},{"label":"미채점 과제","value":"12건","valueClassName":"text-red-500"},{"label":"이번주 질문","value":"34건"}]'::jsonb
  ),
  (
    'professor_activities',
    '[{"color":"bg-blue-500","text":"실습3 제출 마감 D-2"},{"color":"bg-red-500","text":"12건 미채점 과제"},{"color":"bg-yellow-400","text":"학생 질문 5건 대기"},{"color":"bg-green-500","text":"자동 채점 완료"}]'::jsonb
  ),
  (
    'student_dashboard_stats',
    '[{"label":"수강중인 강좌","value":"4개"},{"label":"제출대기 과제","value":"3개"},{"label":"이번주 학습시간","value":"12시간"},{"label":"평균점수","value":"87점"}]'::jsonb
  ),
  (
    'landing_features',
    '[{"title":"Split-View IDE","description":"강의와 코드 에디터를 한 화면에서. 창 전환 없이 집중 학습."},{"title":"AI 튜터","description":"24시간 질문 가능. 정답이 아닌 힌트로 사고력 향상."},{"title":"No-Code 채점","description":"자연어로 채점 기준 설정. 코드 작성 없이 자동 채점."}]'::jsonb
  ),
  (
    'landing_stats',
    '[{"value":"90%+","label":"채점 시간 절감"},{"value":"3초","label":"평균 피드백 응답"},{"value":"24/7","label":"AI 튜터 지원"},{"value":"100%","label":"공정한 학습 기회"}]'::jsonb
  ),
  (
    'landing_team',
    '[{"name":"심준","role":"팀장·PM","description":"프론트엔드, MLOps 설계"},{"name":"남호현","role":"MLOps","description":"백엔드 아키텍처, API"},{"name":"목진협","role":"풀스택","description":"Supabase, DevOps"},{"name":"신태환","role":"프론트엔드","description":"UI 구현, API 연동"},{"name":"오세웅","role":"PM·QA","description":"일정 관리, 테스트"}]'::jsonb
  ),
  (
    'landing_faq',
    '[{"question":"EduRyday는 누가 사용할 수 있나요?","answer":"현재 국민대학교 소프트웨어학과 학생과 교수님을 대상으로 운영됩니다. 향후 전체 학교로 확대할 예정입니다."},{"question":"AI 튜터는 어떻게 작동하나요?","answer":"RAG(Retrieval-Augmented Generation) 기술을 활용하여 강의 자료 기반으로 답변합니다. 힌트 중심으로 사고력을 키울 수 있도록 설계되어 있습니다."},{"question":"No-Code 채점은 무엇인가요?","answer":"교수님이 자연어로 채점 기준을 입력하면 AI가 자동으로 채점 로직을 생성합니다."},{"question":"코딩 실습은 어떤 언어를 지원하나요?","answer":"현재 Python, Java, C++, JavaScript를 지원하며, 추후 더 많은 언어를 지원할 예정입니다."},{"question":"무료로 사용할 수 있나요?","answer":"국민대학교 구성원이라면 무료로 이용 가능합니다. 학교 이메일(@kookmin.ac.kr) 또는 학교 계정으로 로그인하시면 됩니다."}]'::jsonb
  ),
  (
    'admin_dashboard_stats',
    '[{"label":"전체 사용자","value":"1,245","trend":"+12% 이번 주","trendClassName":"text-green-600"},{"label":"활성 강좌","value":"47","trend":null,"trendClassName":""},{"label":"오늘 접속자","value":"382","trend":"+8%","trendClassName":"text-green-600"},{"label":"AI 요청 수","value":"2,847","trend":null,"trendClassName":""},{"label":"서버 응답","value":"142ms","trend":null,"trendClassName":""}]'::jsonb
  ),
  (
    'admin_user_distribution',
    '[{"role":"학생","count":"1,180명","percent":95,"barClassName":"bg-blue-500"},{"role":"교수","count":"52명","percent":4,"barClassName":"bg-green-500"},{"role":"관리자","count":"13명","percent":1,"barClassName":"bg-red-500"}]'::jsonb
  ),
  (
    'admin_server_resources',
    '[{"label":"CPU","value":34,"barClassName":"bg-green-500"},{"label":"메모리","value":62,"barClassName":"bg-yellow-400"},{"label":"저장공간","value":45,"barClassName":"bg-green-500"},{"label":"DB 연결","value":28,"displayValue":"28/100","barClassName":"bg-green-500"}]'::jsonb
  ),
  (
    'admin_alerts',
    '[{"icon":"⚠","bgClassName":"bg-yellow-50 border-yellow-200","message":"AI API 응답 지연","time":"10분 전"},{"icon":"✓","bgClassName":"bg-green-50 border-green-200","message":"백업 완료","time":"1시간 전"},{"icon":"ℹ","bgClassName":"bg-blue-50 border-blue-200","message":"신규 강좌 생성 요청","time":"2시간 전"},{"icon":"✓","bgClassName":"bg-green-50 border-green-200","message":"시스템 업데이트 완료","time":"어제"}]'::jsonb
  ),
  (
    'admin_activity_logs',
    '[{"time":"15:28:42","type":"login","user":"김철수","userRole":"학생","content":"로그인 성공","ip":"192.168.1.42"},{"time":"15:26:18","type":"submit","user":"이영희","userRole":"학생","content":"알고리즘 기초 실습3 제출","ip":"192.168.1.87"},{"time":"15:24:55","type":"ai","user":"박민수","userRole":"학생","content":"AI튜터 질문 (자료구조)","ip":"192.168.1.31"},{"time":"15:20:33","type":"course","user":"이현기","userRole":"교수","content":"새 강좌 생성: 고급 알고리즘","ip":"192.168.1.15"}]'::jsonb
  ),
  (
    'admin_user_stats',
    '[{"label":"전체 사용자","value":"342명"},{"label":"학생","value":"298명"},{"label":"교수","value":"44명"},{"label":"오늘 접속","value":"127명"}]'::jsonb
  ),
  (
    'admin_users',
    '[{"id":1,"name":"김철수","email":"chulsoo.kim@university.ac.kr","role":"학생","status":"활성","joinedAt":"2026-03-02","lastLogin":"2026-03-04 14:23"},{"id":2,"name":"이영희","email":"younghee.lee@university.ac.kr","role":"학생","status":"활성","joinedAt":"2026-03-02","lastLogin":"2026-03-04 09:15"},{"id":3,"name":"박민수","email":"minsu.park@university.ac.kr","role":"학생","status":"정지","joinedAt":"2026-03-01","lastLogin":"2026-03-03 18:42"},{"id":4,"name":"이현기","email":"hyungi.lee@university.ac.kr","role":"교수","status":"활성","joinedAt":"2026-02-28","lastLogin":"2026-03-04 11:05"},{"id":5,"name":"정소연","email":"soyeon.jung@university.ac.kr","role":"교수","status":"활성","joinedAt":"2026-02-27","lastLogin":"2026-03-04 08:50"}]'::jsonb
  ),
  (
    'admin_course_stats',
    '[{"label":"전체 강좌","value":"12개"},{"label":"진행중","value":"8개"},{"label":"종료","value":"3개"},{"label":"대기","value":"1개"}]'::jsonb
  ),
  (
    'admin_courses',
    '[{"id":1,"name":"알고리즘 기초","professor":"이현기","semester":"2026-1","studentCount":48,"status":"진행중","createdAt":"2026-02-28"},{"id":2,"name":"데이터구조와 알고리즘","professor":"정소연","semester":"2026-1","studentCount":52,"status":"진행중","createdAt":"2026-02-27"},{"id":3,"name":"웹 프로그래밍","professor":"이현기","semester":"2026-1","studentCount":45,"status":"진행중","createdAt":"2026-03-01"},{"id":4,"name":"운영체제","professor":"정소연","semester":"2025-2","studentCount":60,"status":"종료","createdAt":"2025-09-01"},{"id":5,"name":"고급 알고리즘","professor":"이현기","semester":"2026-1","studentCount":0,"status":"대기","createdAt":"2026-03-04"}]'::jsonb
  ),
  (
    'admin_log_stats',
    '[{"label":"오늘 오류","value":"3건","valueClassName":"text-red-600"},{"label":"채점 완료","value":"47건","valueClassName":"text-green-600"},{"label":"API 호출","value":"1,234건","valueClassName":"text-gray-900"},{"label":"활성 세션","value":"89명","valueClassName":"text-gray-900"}]'::jsonb
  ),
  (
    'admin_logs',
    '[{"id":1,"timestamp":"2026-03-04 15:28:42","type":"error","user":"시스템","message":"Docker 채점 컨테이너 타임아웃 (과제 ID: 204)"},{"id":2,"timestamp":"2026-03-04 15:26:18","type":"access","user":"김철수","message":"로그인 성공 — 192.168.1.42"},{"id":3,"timestamp":"2026-03-04 15:24:55","type":"ai","user":"이영희","message":"AI 튜터 질문 — 피보나치 수열 힌트 요청"},{"id":4,"timestamp":"2026-03-04 15:22:30","type":"grading","user":"박민수","message":"알고리즘 기초 실습3 자동 채점 완료 — 85점"},{"id":5,"timestamp":"2026-03-04 15:18:11","type":"error","user":"시스템","message":"AI API 응답 지연 (3,200ms) — 재시도 성공"},{"id":6,"timestamp":"2026-03-04 15:15:04","type":"access","user":"이현기","message":"교수 로그인 — 강좌 관리 페이지 접근"},{"id":7,"timestamp":"2026-03-04 15:10:47","type":"grading","user":"최지훈","message":"웹 프로그래밍 과제1 자동 채점 완료 — 92점"},{"id":8,"timestamp":"2026-03-04 15:05:33","type":"error","user":"시스템","message":"DB 쿼리 응답 지연 (2,800ms) — 슬로우 쿼리 감지"}]'::jsonb
  ),
  (
    'professor_analytics_stat_cards',
    '[{"label":"평균 점수","value":"76.2점","trend":"지난 학기 대비 +3.1점","trendColor":"green"},{"label":"출석률","value":"91%","trend":"지난 주 대비 -1%","trendColor":"red"},{"label":"AI 질문 수","value":"287건","trend":"이번 주 누적","trendColor":"green"},{"label":"과제 완료율","value":"84%","trend":"전체 과제 기준","trendColor":"green"}]'::jsonb
  ),
  (
    'professor_misconceptions',
    '[{"rank":1,"concept":"재귀 함수의 기저 조건(base case) 설정","count":24,"course":"알고리즘 기초","severity":"high"},{"rank":2,"concept":"시간 복잡도 Big-O 계산 방법","count":19,"course":"알고리즘 기초","severity":"high"},{"rank":3,"concept":"스택과 큐의 동작 차이","count":15,"course":"자료구조","severity":"medium"},{"rank":4,"concept":"포인터와 참조 개념","count":11,"course":"자료구조","severity":"medium"},{"rank":5,"concept":"동적 프로그래밍 메모이제이션","count":8,"course":"알고리즘 기초","severity":"low"}]'::jsonb
  ),
  (
    'professor_weekly_participation',
    '[{"week":"1주","rate":95,"questions":12},{"week":"2주","rate":92,"questions":18},{"week":"3주","rate":89,"questions":34},{"week":"4주","rate":91,"questions":28},{"week":"5주","rate":88,"questions":41}]'::jsonb
  ),
  (
    'professor_question_patterns',
    '[{"category":"개념 이해","count":98,"percentage":34,"variant":"blue"},{"category":"코드 디버깅","count":87,"percentage":30,"variant":"red"},{"category":"과제 힌트 요청","count":65,"percentage":23,"variant":"yellow"},{"category":"기타","count":37,"percentage":13,"variant":"default"}]'::jsonb
  )
on conflict (key)
do update set
  payload = excluded.payload,
  updated_at = now();
