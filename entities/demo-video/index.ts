export function isVideoDemoMode() {
  return process.env.EDURYDAY_VIDEO_DEMO === '1';
}

export const demoStudent = { name: '김민준' };

export const demoStudentCourses = [
  { id: 'algorithms-bfs', title: '알고리즘 실습', professor: '박서연 교수', progress: 74 },
  { id: 'data-structures', title: '자료구조', professor: '정하윤 교수', progress: 86 },
  { id: 'web-programming', title: '웹프로그래밍', professor: '이도현 교수', progress: 61 },
];

export const demoStudentStats = [
  { label: '수강중인 강좌', value: '3개' },
  { label: '제출대기 과제', value: '2개' },
  { label: '제출 완료', value: '7개' },
  { label: '평균 진도', value: '74%' },
];

export const demoStudentDeadlines = [
  {
    id: 'deadline-bfs',
    title: 'BFS 방문 순서 구현',
    course: '알고리즘 실습',
    dday: 'D-1',
    ddayUrgent: true,
    date: '6.15 23:59',
  },
  {
    id: 'deadline-stack',
    title: '스택/큐 응용 문제',
    course: '자료구조',
    dday: 'D-3',
    ddayUrgent: false,
    date: '6.17 23:59',
  },
  {
    id: 'deadline-react',
    title: 'React 상태 관리 리포트',
    course: '웹프로그래밍',
    dday: 'D-5',
    ddayUrgent: false,
    date: '6.19 18:00',
  },
];

export const demoCourse = {
  id: 'algorithms-bfs',
  title: '알고리즘 실습',
  professor: '박서연 교수',
  progress: 74,
};

export const demoCourseWeeks = [
  {
    id: 'week-1',
    number: 1,
    title: 'Python 기본 문법',
    status: 'done' as const,
    lessons: [
      { id: 'lesson-1-1', title: '입출력과 조건문', type: 'lecture' as const, completed: true },
      { id: 'lesson-1-2', title: '반복문 실습', type: 'practice' as const, completed: true },
    ],
  },
  {
    id: 'week-2',
    number: 2,
    title: '리스트와 딕셔너리',
    status: 'done' as const,
    lessons: [
      { id: 'lesson-2-1', title: '리스트 순회', type: 'lecture' as const, completed: true },
      { id: 'lesson-2-2', title: '딕셔너리 카운팅', type: 'practice' as const, completed: true },
    ],
  },
  {
    id: 'week-3',
    number: 3,
    title: '정렬 알고리즘',
    status: 'done' as const,
    lessons: [
      { id: 'lesson-3-1', title: '정렬 복잡도 비교', type: 'lecture' as const, completed: true },
      { id: 'lesson-3-2', title: '정렬 구현 과제', type: 'practice' as const, completed: true },
    ],
  },
  {
    id: 'week-4',
    number: 4,
    title: '그래프 탐색',
    status: 'in-progress' as const,
    lessons: [
      { id: 'lesson-4-1', title: 'BFS와 DFS 핵심 개념', type: 'lecture' as const, completed: true },
      { id: 'lesson-4-2', title: '인접 리스트 구현', type: 'practice' as const, completed: true, active: true },
      { id: 'lesson-4-3', title: '최단 경로 실습', type: 'practice' as const, completed: false },
    ],
  },
  {
    id: 'week-5',
    number: 5,
    title: '동적 계획법 입문',
    status: 'locked' as const,
    lessons: [
      { id: 'lesson-5-1', title: '메모이제이션', type: 'lecture' as const, completed: false },
    ],
  },
];

export const demoCourseResources = [
  { id: 'resource-1', title: '4주차 강의 노트: 그래프 탐색.pdf', completed: true, isPdf: true, file_url: '/demo/bfs.pdf' },
  { id: 'resource-2', title: 'BFS 시각화 영상', completed: true, isPdf: false, file_url: '/demo/bfs.mp4' },
  { id: 'resource-3', title: '테스트 케이스 해설 자료.pdf', completed: false, isPdf: true, file_url: '/demo/tests.pdf' },
];

export const demoActiveAssignment = {
  id: 'assignment-bfs',
  title: 'BFS 방문 순서 구현',
  description:
    '그래프와 시작 정점이 주어질 때 너비 우선 탐색 순서대로 정점을 반환하세요.\n\n검증 기준은 큐 사용, 방문 중복 방지, 방문 순서, 시간 복잡도 설명입니다.',
  type: 'coding' as const,
  deadline: '2026-06-15T23:59:00+09:00',
};

export const demoAssignmentDraft = {
  title: 'BFS 방문 순서 구현',
  description:
    '그래프를 인접 리스트로 입력받아 시작 정점에서 너비 우선 탐색을 수행하세요.\n\n요구사항:\n1. 큐를 사용해 탐색 순서를 유지합니다.\n2. 큐에 넣는 시점에 visited 처리를 해 중복 방문을 방지합니다.\n3. 반환값은 방문한 정점 순서 배열입니다.\n4. 시간 복잡도 O(V + E)를 설명에 포함합니다.',
  deadline: '2026-06-15T23:59',
  type: 'coding' as const,
  rubric: [
    { id: 'rubric-1', description: '큐 기반 BFS 흐름을 정확히 구현했다.', weight: 35 },
    { id: 'rubric-2', description: 'visited 처리로 중복 방문을 방지했다.', weight: 30 },
    { id: 'rubric-3', description: '테스트 케이스와 시간 복잡도 설명이 충분하다.', weight: 35 },
  ],
  testCases: [
    {
      input: 'A: B C\nB: D\nC: D\nstart=A',
      expectedOutput: "['A', 'B', 'C', 'D']",
      weight: 40,
    },
    {
      input: '1: 2 3\n2: 4 5\n3: 6\nstart=1',
      expectedOutput: '[1, 2, 3, 4, 5, 6]',
      weight: 35,
    },
    {
      input: 'X: Y\nY: X Z\nZ:\nstart=X',
      expectedOutput: "['X', 'Y', 'Z']",
      weight: 25,
    },
  ],
};

export const demoIdeAssignment = {
  id: 'assignment-bfs',
  title: 'BFS 방문 순서 구현',
  description:
    '그래프를 인접 리스트로 표현하고 시작 정점에서 BFS를 수행합니다.\n\n입력 예시:\nA: B C\nB: D\nC: D\n\n출력은 방문 순서 배열이어야 합니다.',
  language: 'python',
};

export const demoStudentAssignments = [
  { id: 'assignment-bfs', title: 'BFS 방문 순서 구현', course: '알고리즘 실습', date: '2026-06-15 23:59', status: 'pending' as const, type: '코딩' as const },
  { id: 'assignment-dfs', title: 'DFS 경로 추적 과제', course: '알고리즘 실습', date: '2026-06-17 23:59', status: 'submitted' as const, type: '코딩' as const },
  { id: 'assignment-stack', title: '스택/큐 응용 문제', course: '자료구조', date: '2026-06-17 23:59', status: 'graded' as const, type: '코딩' as const, score: 88 },
  { id: 'assignment-react', title: 'React 상태 관리 리포트', course: '웹프로그래밍', date: '2026-06-19 18:00', status: 'graded' as const, type: '주관식' as const, score: 94 },
];

export const demoStudentGrades = [
  { id: 'grade-bfs', course: '알고리즘 실습', assignment: '정렬 알고리즘 구현', score: 92, maxScore: 100, feedback: '시간 복잡도 설명이 명확하고 테스트를 모두 통과했습니다.', submittedAt: '2026-06-10', status: 'graded' as const },
  { id: 'grade-stack', course: '자료구조', assignment: '스택/큐 응용 문제', score: 88, maxScore: 100, feedback: '예외 케이스 처리만 조금 더 보강하면 좋습니다.', submittedAt: '2026-06-11', status: 'graded' as const },
  { id: 'grade-react', course: '웹프로그래밍', assignment: 'React 상태 관리 리포트', score: 94, maxScore: 100, feedback: '컴포넌트 책임 분리가 좋고 근거가 충분합니다.', submittedAt: '2026-06-12', status: 'graded' as const },
  { id: 'grade-dfs', course: '알고리즘 실습', assignment: 'DFS 경로 추적 과제', score: 0, maxScore: 100, feedback: '', submittedAt: '2026-06-13', status: 'pending' as const },
];

export const demoProfessor = { name: '박서연', title: '교수님' };

export const demoProfessorCourses = [
  { id: 'algorithms-bfs', title: '알고리즘 실습', semester: '2026-1 · 컴퓨터공학과', students: 46, currentWeek: 4, totalWeeks: 15 },
  { id: 'data-structures', title: '자료구조', semester: '2026-1 · 소프트웨어학부', students: 52, currentWeek: 6, totalWeeks: 15 },
  { id: 'web-programming', title: '웹프로그래밍', semester: '2026-1 · 전공선택', students: 38, currentWeek: 5, totalWeeks: 15 },
];

export const demoProfessorStats = [
  { label: '운영중인 강좌', value: '3개' },
  { label: '전체 수강생', value: '136명' },
  { label: '검토중 제출', value: '18건', valueClassName: 'text-red-500' },
  { label: '채점 완료', value: '74건' },
];

export const demoProfessorActivities = [
  { color: 'bg-blue-500', text: '알고리즘 실습 BFS 과제 제출 31건 도착' },
  { color: 'bg-red-500', text: '위험 학생 4명: 2주 연속 미제출' },
  { color: 'bg-yellow-400', text: '루브릭 자동 생성 초안 2건 검토 필요' },
  { color: 'bg-green-500', text: '자동 채점 결과 74건 반영 완료' },
];

export const demoSubmissionSummary = [
  { label: '알고리즘 실습', submitted: 31, graded: 22, pending: 9 },
  { label: '자료구조', submitted: 44, graded: 38, pending: 6 },
  { label: '웹프로그래밍', submitted: 29, graded: 14, pending: 15 },
];

export const demoGradingRows = [
  { id: 'sub-1', name: '김민준', studentId: '20223045', submittedAt: '2026-06-14 09:21', autoScore: '92점', testsPassed: '테스트 12/12 통과', aiAnalysis: '정상', aiAnalysisVariant: 'green' as const, finalScore: '92', feedback: '큐 사용과 방문 처리가 안정적입니다.', status: 'graded' as const },
  { id: 'sub-2', name: '이서연', studentId: '20223067', submittedAt: '2026-06-14 09:45', autoScore: '78점', testsPassed: '테스트 9/12 통과', aiAnalysis: '검토 필요', aiAnalysisVariant: 'yellow' as const, finalScore: '80', feedback: '중복 방문 방지 로직을 확인하세요.', status: 'grading' as const },
  { id: 'sub-3', name: '박지호', studentId: '20223102', submittedAt: '2026-06-14 10:02', autoScore: '88점', testsPassed: '테스트 11/12 통과', aiAnalysis: '정상', aiAnalysisVariant: 'green' as const, finalScore: '88', feedback: '복잡도 설명을 한 줄 더 보강하세요.', status: 'submitted' as const },
  { id: 'sub-4', name: '최유진', studentId: '20223118', submittedAt: '-', autoScore: '-', testsPassed: '-', aiAnalysis: '위험', aiAnalysisVariant: 'red' as const, finalScore: '0', feedback: '', status: 'unsubmitted' as const },
];

export const demoAnalytics = {
  statCards: [
    { label: '평균 점수', value: '86점', trend: '+4점 개선', trendColor: 'green' as const },
    { label: '수강생 수', value: '136명', trend: '3개 강좌', trendColor: 'green' as const },
    { label: 'AI 질문 수', value: '287건', trend: '전주 대비 +18%', trendColor: 'green' as const },
    { label: '제출률', value: '82%', trend: '위험 학생 4명', trendColor: 'red' as const },
  ],
  topMisconceptions: [
    { rank: 1, concept: 'visited 처리 시점', count: 42, course: '알고리즘 실습', severity: 'high' as const },
    { rank: 2, concept: '큐와 스택 사용 구분', count: 31, course: '자료구조', severity: 'medium' as const },
    { rank: 3, concept: '시간 복잡도 표기', count: 27, course: '알고리즘 실습', severity: 'medium' as const },
    { rank: 4, concept: '상태 끌어올리기', count: 19, course: '웹프로그래밍', severity: 'low' as const },
    { rank: 5, concept: '비동기 제출 처리', count: 16, course: '웹프로그래밍', severity: 'low' as const },
  ],
  weeklyParticipation: [
    { week: '1주', rate: 74, questions: 22 },
    { week: '2주', rate: 78, questions: 31 },
    { week: '3주', rate: 81, questions: 46 },
    { week: '4주', rate: 86, questions: 58 },
    { week: '5주', rate: 82, questions: 49 },
  ],
  questionPatterns: [
    { category: '개념 질문', count: 118, percentage: 41, variant: 'blue' as const },
    { category: '코드 오류', count: 84, percentage: 29, variant: 'red' as const },
    { category: '힌트 요청', count: 61, percentage: 21, variant: 'yellow' as const },
    { category: '복습', count: 24, percentage: 9, variant: 'default' as const },
  ],
};

export const demoProfessorGrades = {
  courses: demoProfessorCourses.map((course) => ({
    id: course.id,
    title: course.title,
    semester: course.semester,
  })),
  rows: [
    { id: 'grade-1', courseId: 'algorithms-bfs', courseTitle: '알고리즘 실습', assignmentTitle: 'BFS 방문 순서 구현', name: '김민준', studentId: '20223045', submittedAt: '2026-06-14 09:21', autoScore: 92, finalScore: 92, status: 'graded' as const },
    { id: 'grade-2', courseId: 'algorithms-bfs', courseTitle: '알고리즘 실습', assignmentTitle: 'BFS 방문 순서 구현', name: '이서연', studentId: '20223067', submittedAt: '2026-06-14 09:45', autoScore: 78, finalScore: 80, status: 'grading' as const },
    { id: 'grade-3', courseId: 'data-structures', courseTitle: '자료구조', assignmentTitle: '스택/큐 응용 문제', name: '박지호', studentId: '20223102', submittedAt: '2026-06-13 18:12', autoScore: 88, finalScore: 88, status: 'graded' as const },
    { id: 'grade-4', courseId: 'web-programming', courseTitle: '웹프로그래밍', assignmentTitle: 'React 상태 관리 리포트', name: '최유진', studentId: '20223118', submittedAt: '-', autoScore: null, finalScore: null, status: 'unsubmitted' as const },
  ],
};

export const demoAdminDashboard = {
  stats: [
    { label: '전체 사용자', value: '1,286', trend: '1,214명 활성', trendClassName: 'text-green-600' },
    { label: '승인 대기', value: '18', trend: '신규 가입 검토', trendClassName: 'text-yellow-600' },
    { label: '활성 강좌', value: '42', trend: '이번 학기 운영', trendClassName: 'text-blue-600' },
    { label: '최근 로그', value: '128건', trend: '24시간 기준', trendClassName: 'text-gray-600' },
    { label: '관리자 계정', value: '4', trend: '권한 점검 완료', trendClassName: 'text-green-600' },
  ],
  userDistribution: [
    { role: '학생', count: '1,087명', percent: 85, barClassName: 'bg-blue-500' },
    { role: '교수', count: '195명', percent: 15, barClassName: 'bg-green-500' },
    { role: '관리자', count: '4명', percent: 2, barClassName: 'bg-red-500' },
  ],
  serverResources: [
    { label: 'API 성공률', value: 99, displayValue: '99.8%', barClassName: 'bg-green-500' },
    { label: '자동 채점 큐', value: 64, displayValue: '64%', barClassName: 'bg-blue-500' },
    { label: 'AI 응답 지연', value: 38, displayValue: '1.8s', barClassName: 'bg-yellow-400' },
  ],
  alerts: [
    { icon: 'ℹ', bgClassName: 'bg-blue-50 border-blue-200', message: '승인 대기 사용자 18명', time: '방금 전' },
    { icon: '✓', bgClassName: 'bg-green-50 border-green-200', message: 'API 상태 정상', time: '1분 전' },
    { icon: '!', bgClassName: 'bg-yellow-50 border-yellow-200', message: '채점 큐 사용량 증가', time: '5분 전' },
  ],
  activityLogs: [
    { time: '09:02:14', type: 'login' as const, user: '김민준', userRole: '학생', content: '로그인 성공', ip: '192.168.1.42' },
    { time: '09:18:30', type: 'submit' as const, user: '이서연', userRole: '학생', content: 'BFS 방문 순서 구현 제출', ip: '192.168.1.87' },
    { time: '09:41:02', type: 'ai' as const, user: '박지호', userRole: '학생', content: 'AI 튜터 질문 생성', ip: '192.168.1.31' },
    { time: '10:05:44', type: 'course' as const, user: '박서연', userRole: '교수', content: '그래프 탐색 과제 게시', ip: '192.168.1.15' },
  ],
  dailyActivity: [
    { day: '월', logins: 240, submissions: 81, aiQuestions: 92 },
    { day: '화', logins: 268, submissions: 96, aiQuestions: 118 },
    { day: '수', logins: 251, submissions: 87, aiQuestions: 104 },
    { day: '목', logins: 304, submissions: 121, aiQuestions: 136 },
    { day: '금', logins: 286, submissions: 113, aiQuestions: 128 },
    { day: '토', logins: 178, submissions: 66, aiQuestions: 74 },
    { day: '일', logins: 194, submissions: 72, aiQuestions: 81 },
  ],
};

export const demoAdminUsers = {
  users: [
    { id: 'user-1', name: '김민준', email: 'student@eduryday.app', role: '학생' as const, status: '활성' as const, joinedAt: '2026-03-02', lastLogin: '2026-06-14 09:02' },
    { id: 'user-2', name: '박서연', email: 'professor@eduryday.app', role: '교수' as const, status: '활성' as const, joinedAt: '2026-02-20', lastLogin: '2026-06-14 10:05' },
    { id: 'user-3', name: '이서연', email: 'seoyeon@student.ac.kr', role: '학생' as const, status: '승인대기' as const, joinedAt: '2026-06-13', lastLogin: '-' },
    { id: 'user-4', name: '운영 관리자', email: 'admin@eduryday.app', role: '관리자' as const, status: '활성' as const, joinedAt: '2026-01-11', lastLogin: '2026-06-14 08:55' },
  ],
  total: 1286,
  page: 1,
  pageSize: 10,
  stats: { totalUsers: 1286, students: 1087, professors: 195, active: 1214 },
};

export const demoAdminLogs = {
  logs: [
    { id: 1, timestamp: '2026-06-14 10:05:44', type: 'course' as const, user: '박서연', message: '그래프 탐색 과제 게시' },
    { id: 2, timestamp: '2026-06-14 09:41:02', type: 'ai' as const, user: '박지호', message: 'AI 튜터 질문 생성: visited 처리 시점' },
    { id: 3, timestamp: '2026-06-14 09:18:30', type: 'submit' as const, user: '이서연', message: 'BFS 방문 순서 구현 제출' },
    { id: 4, timestamp: '2026-06-14 09:02:14', type: 'login' as const, user: '김민준', message: '로그인 성공' },
    { id: 5, timestamp: '2026-06-14 08:51:08', type: 'grading' as const, user: '자동채점', message: '테스트 케이스 12개 실행 완료' },
  ],
  total: 128,
  page: 1,
  pageSize: 10,
};
