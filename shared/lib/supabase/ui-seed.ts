import type { Conversation } from '@/entities/chat';
import { MOCK_CONVERSATIONS } from '@/entities/chat/model/mock';
import type {
  CourseResource,
  Deadline,
  ProfessorCourse,
  StudentCourse,
  Week,
} from '@/entities/course';
import {
  MOCK_COURSE_RESOURCES,
  MOCK_COURSE_WEEKS,
  MOCK_DEADLINES,
  MOCK_PROFESSOR_COURSES,
  MOCK_STUDENT_COURSES,
} from '@/entities/course/model/mock';
import type { RubricCriterion, TestResult } from '@/entities/assignment';
import { MOCK_RUBRIC_CRITERIA, MOCK_TEST_RESULTS } from '@/entities/assignment/model/mock';
import type { Submission } from '@/entities/submission';
import { MOCK_SUBMISSIONS } from '@/entities/submission/model/mock';
import type { Professor, Student } from '@/entities/user';
import { MOCK_CURRENT_PROFESSOR, MOCK_CURRENT_STUDENT } from '@/entities/user/model/mock';
import {
  LANDING_FAQ,
  LANDING_FEATURES,
  LANDING_STATS,
  LANDING_TEAM,
} from '@/shared/config/landing';
import { getSupabaseServerClient } from './server';

interface SeedRow {
  payload: unknown;
}

async function getSeed<T>(key: string, fallback: T): Promise<T> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return fallback;
  }

  const { data, error } = await supabase
    .from('ui_seed_data')
    .select('payload')
    .eq('key', key)
    .single<SeedRow>();

  if (error || !data?.payload) {
    return fallback;
  }

  return data.payload as T;
}

export interface ProfessorAssignmentRecord {
  id: string;
  title: string;
  course: string;
  type: 'coding' | 'essay' | 'multiple-choice' | 'file';
  deadline: string;
  submitted: number;
  total: number;
  graded: number;
  status: 'active' | 'closed' | 'draft';
}

export interface ProfessorAnnouncementRecord {
  id: string;
  title: string;
  course: string;
  createdAt: string;
  views: number;
  pinned: boolean;
}

export interface StudentGradeRecord {
  id: string;
  course: string;
  assignment: string;
  score: number;
  maxScore: number;
  feedback: string;
  submittedAt: string;
  status: 'graded' | 'pending';
}

export interface LearningStatRecord {
  label: string;
  value: string;
  trend: string;
  trendColor: 'green' | 'red';
}

export interface CompletedCourseRecord {
  id: string;
  title: string;
  semester: string;
  grade: string;
}

export interface ProfessorDashboardStat {
  label: string;
  value: string;
  valueClassName?: string;
}

export interface ProfessorActivityRecord {
  color: string;
  text: string;
}

export interface StudentDashboardStat {
  label: string;
  value: string;
}

export interface LandingFeatureRecord {
  title: string;
  description: string;
}

export interface LandingStatRecord {
  value: string;
  label: string;
}

export interface LandingTeamRecord {
  name: string;
  role: string;
  description: string;
}

export interface LandingFaqRecord {
  question: string;
  answer: string;
}

export interface AdminDashboardStatRecord {
  label: string;
  value: string;
  trend: string | null;
  trendClassName: string;
}

export interface AdminUserDistributionRecord {
  role: string;
  count: string;
  percent: number;
  barClassName: string;
}

export interface AdminServerResourceRecord {
  label: string;
  value: number;
  barClassName: string;
  displayValue?: string;
}

export interface AdminAlertRecord {
  icon: string;
  bgClassName: string;
  message: string;
  time: string;
}

export interface AdminActivityLogRecord {
  time: string;
  type: 'login' | 'submit' | 'ai' | 'course';
  user: string;
  userRole: string;
  content: string;
  ip: string;
}

export interface AdminUserStatRecord {
  label: string;
  value: string;
}

export interface AdminUserRecord {
  id: number;
  name: string;
  email: string;
  role: '학생' | '교수';
  status: '활성' | '정지';
  joinedAt: string;
  lastLogin: string;
}

export interface AdminCourseStatRecord {
  label: string;
  value: string;
}

export interface AdminCourseRecord {
  id: number;
  name: string;
  professor: string;
  semester: string;
  studentCount: number;
  status: '진행중' | '종료' | '대기';
  createdAt: string;
}

export interface AdminLogStatRecord {
  label: string;
  value: string;
  valueClassName: string;
}

export interface AdminLogRecord {
  id: number;
  timestamp: string;
  type: 'error' | 'access' | 'grading' | 'ai';
  user: string;
  message: string;
}

export interface ProfessorAnalyticsStatCard {
  label: string;
  value: string;
  trend: string;
  trendColor: 'green' | 'red';
}

export interface ProfessorMisconceptionRecord {
  rank: number;
  concept: string;
  count: number;
  course: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ProfessorWeeklyParticipationRecord {
  week: string;
  rate: number;
  questions: number;
}

export interface ProfessorQuestionPatternRecord {
  category: string;
  count: number;
  percentage: number;
  variant: 'blue' | 'red' | 'yellow' | 'default';
}

const FALLBACK_PROFESSOR_ASSIGNMENTS: ProfessorAssignmentRecord[] = [
  { id: '1', title: '실습 3: 정렬 알고리즘 구현', course: '알고리즘 기초', type: 'coding', deadline: '2026-03-06 23:59', submitted: 38, total: 45, graded: 30, status: 'active' },
  { id: '2', title: '과제 2: 스택과 큐 구현', course: '자료구조', type: 'coding', deadline: '2026-03-09 23:59', submitted: 25, total: 52, graded: 25, status: 'active' },
  { id: '3', title: '주관식 에세이: 알고리즘 복잡도 분석', course: '알고리즘 기초', type: 'essay', deadline: '2026-02-28 23:59', submitted: 45, total: 45, graded: 45, status: 'closed' },
  { id: '4', title: '중간고사 대비 퀴즈', course: '자료구조', type: 'multiple-choice', deadline: '2026-02-20 23:59', submitted: 52, total: 52, graded: 52, status: 'closed' },
  { id: '5', title: '프로젝트 보고서 제출', course: '알고리즘 기초', type: 'file', deadline: '2026-03-20 23:59', submitted: 0, total: 45, graded: 0, status: 'draft' },
];

const FALLBACK_PROFESSOR_ANNOUNCEMENTS: ProfessorAnnouncementRecord[] = [
  { id: '1', title: '3주차 실습 과제 제출 기한 연장 안내', course: '알고리즘 기초', createdAt: '2026-03-03', views: 42, pinned: true },
  { id: '2', title: '중간고사 일정 및 범위 안내', course: '자료구조', createdAt: '2026-03-01', views: 51, pinned: true },
  { id: '3', title: '강의 자료 업데이트 완료 (2주차)', course: '알고리즘 기초', createdAt: '2026-02-24', views: 38, pinned: false },
  { id: '4', title: '수업 보강 일정 공지 (3/10 -> 3/15)', course: '자료구조', createdAt: '2026-02-20', views: 47, pinned: false },
];

const FALLBACK_STUDENT_GRADES: StudentGradeRecord[] = [
  { id: 'g1', course: '알고리즘 기초', assignment: '퀴즈 1: 시간복잡도', score: 92, maxScore: 100, feedback: '시간복잡도 분석이 정확합니다. Big-O 표기법 사용이 훌륭합니다.', submittedAt: '2026-01-14', status: 'graded' },
  { id: 'g2', course: '알고리즘 기초', assignment: '보고서: 알고리즘 분석', score: 85, maxScore: 100, feedback: '분석이 체계적이나 공간복잡도 논의가 부족합니다. 다음 과제에 반영하세요.', submittedAt: '2026-01-18', status: 'graded' },
  { id: 'g3', course: '자료구조', assignment: '과제 1: 배열과 연결리스트', score: 78, maxScore: 100, feedback: '연결리스트 삭제 로직에 버그가 있습니다. 경계 케이스(빈 리스트)를 처리해주세요.', submittedAt: '2026-01-11', status: 'graded' },
  { id: 'g4', course: '웹프로그래밍', assignment: '실습 1: HTML/CSS 레이아웃', score: 95, maxScore: 100, feedback: '시맨틱 HTML 구조가 우수하고 반응형 레이아웃이 잘 구현되었습니다.', submittedAt: '2026-01-09', status: 'graded' },
  { id: 'g5', course: '자료구조', assignment: '과제 2: 스택과 큐 구현', score: 0, maxScore: 100, feedback: '', submittedAt: '—', status: 'pending' },
];

const FALLBACK_LEARNING_STATS: LearningStatRecord[] = [
  { label: '총 학습시간', value: '48시간', trend: '이번 달 +12시간', trendColor: 'green' },
  { label: '완료 강좌', value: '1개', trend: '수강 중 3개', trendColor: 'green' },
  { label: '평균 점수', value: '87.5점', trend: '상위 15%', trendColor: 'green' },
];

const FALLBACK_COMPLETED_COURSES: CompletedCourseRecord[] = [
  { id: 'c0', title: '컴퓨터과학 개론', semester: '2025-2학기', grade: 'A+' },
];

const FALLBACK_PROFESSOR_DASHBOARD_STATS: ProfessorDashboardStat[] = [
  { label: '운영중인 강좌', value: '3개' },
  { label: '전체 수강생', value: '127명' },
  { label: '미채점 과제', value: '12건', valueClassName: 'text-red-500' },
  { label: '이번주 질문', value: '34건' },
];

const FALLBACK_PROFESSOR_ACTIVITIES: ProfessorActivityRecord[] = [
  { color: 'bg-blue-500', text: '실습3 제출 마감 D-2' },
  { color: 'bg-red-500', text: '12건 미채점 과제' },
  { color: 'bg-yellow-400', text: '학생 질문 5건 대기' },
  { color: 'bg-green-500', text: '자동 채점 완료' },
];

const FALLBACK_STUDENT_DASHBOARD_STATS: StudentDashboardStat[] = [
  { label: '수강중인 강좌', value: '4개' },
  { label: '제출대기 과제', value: '3개' },
  { label: '이번주 학습시간', value: '12시간' },
  { label: '평균점수', value: '87점' },
];

const FALLBACK_LANDING_FEATURES: LandingFeatureRecord[] = [...LANDING_FEATURES];
const FALLBACK_LANDING_STATS: LandingStatRecord[] = [...LANDING_STATS];
const FALLBACK_LANDING_TEAM: LandingTeamRecord[] = [...LANDING_TEAM];
const FALLBACK_LANDING_FAQ: LandingFaqRecord[] = [...LANDING_FAQ];

const FALLBACK_ADMIN_DASHBOARD_STATS: AdminDashboardStatRecord[] = [
  { label: '전체 사용자', value: '1,245', trend: '+12% 이번 주', trendClassName: 'text-green-600' },
  { label: '활성 강좌', value: '47', trend: null, trendClassName: '' },
  { label: '오늘 접속자', value: '382', trend: '+8%', trendClassName: 'text-green-600' },
  { label: 'AI 요청 수', value: '2,847', trend: null, trendClassName: '' },
  { label: '서버 응답', value: '142ms', trend: null, trendClassName: '' },
];

const FALLBACK_ADMIN_USER_DISTRIBUTION: AdminUserDistributionRecord[] = [
  { role: '학생', count: '1,180명', percent: 95, barClassName: 'bg-blue-500' },
  { role: '교수', count: '52명', percent: 4, barClassName: 'bg-green-500' },
  { role: '관리자', count: '13명', percent: 1, barClassName: 'bg-red-500' },
];

const FALLBACK_ADMIN_SERVER_RESOURCES: AdminServerResourceRecord[] = [
  { label: 'CPU', value: 34, barClassName: 'bg-green-500' },
  { label: '메모리', value: 62, barClassName: 'bg-yellow-400' },
  { label: '저장공간', value: 45, barClassName: 'bg-green-500' },
  { label: 'DB 연결', value: 28, displayValue: '28/100', barClassName: 'bg-green-500' },
];

const FALLBACK_ADMIN_ALERTS: AdminAlertRecord[] = [
  { icon: '⚠', bgClassName: 'bg-yellow-50 border-yellow-200', message: 'AI API 응답 지연', time: '10분 전' },
  { icon: '✓', bgClassName: 'bg-green-50 border-green-200', message: '백업 완료', time: '1시간 전' },
  { icon: 'ℹ', bgClassName: 'bg-blue-50 border-blue-200', message: '신규 강좌 생성 요청', time: '2시간 전' },
  { icon: '✓', bgClassName: 'bg-green-50 border-green-200', message: '시스템 업데이트 완료', time: '어제' },
];

const FALLBACK_ADMIN_ACTIVITY_LOGS: AdminActivityLogRecord[] = [
  { time: '15:28:42', type: 'login', user: '김철수', userRole: '학생', content: '로그인 성공', ip: '192.168.1.42' },
  { time: '15:26:18', type: 'submit', user: '이영희', userRole: '학생', content: '알고리즘 기초 실습3 제출', ip: '192.168.1.87' },
  { time: '15:24:55', type: 'ai', user: '박민수', userRole: '학생', content: 'AI튜터 질문 (자료구조)', ip: '192.168.1.31' },
  { time: '15:20:33', type: 'course', user: '이현기', userRole: '교수', content: '새 강좌 생성: 고급 알고리즘', ip: '192.168.1.15' },
];

const FALLBACK_ADMIN_USER_STATS: AdminUserStatRecord[] = [
  { label: '전체 사용자', value: '342명' },
  { label: '학생', value: '298명' },
  { label: '교수', value: '44명' },
  { label: '오늘 접속', value: '127명' },
];

const FALLBACK_ADMIN_USERS: AdminUserRecord[] = [
  { id: 1, name: '김철수', email: 'chulsoo.kim@university.ac.kr', role: '학생', status: '활성', joinedAt: '2026-03-02', lastLogin: '2026-03-04 14:23' },
  { id: 2, name: '이영희', email: 'younghee.lee@university.ac.kr', role: '학생', status: '활성', joinedAt: '2026-03-02', lastLogin: '2026-03-04 09:15' },
  { id: 3, name: '박민수', email: 'minsu.park@university.ac.kr', role: '학생', status: '정지', joinedAt: '2026-03-01', lastLogin: '2026-03-03 18:42' },
  { id: 4, name: '이현기', email: 'hyungi.lee@university.ac.kr', role: '교수', status: '활성', joinedAt: '2026-02-28', lastLogin: '2026-03-04 11:05' },
  { id: 5, name: '정소연', email: 'soyeon.jung@university.ac.kr', role: '교수', status: '활성', joinedAt: '2026-02-27', lastLogin: '2026-03-04 08:50' },
];

const FALLBACK_ADMIN_COURSE_STATS: AdminCourseStatRecord[] = [
  { label: '전체 강좌', value: '12개' },
  { label: '진행중', value: '8개' },
  { label: '종료', value: '3개' },
  { label: '대기', value: '1개' },
];

const FALLBACK_ADMIN_COURSES: AdminCourseRecord[] = [
  { id: 1, name: '알고리즘 기초', professor: '이현기', semester: '2026-1', studentCount: 48, status: '진행중', createdAt: '2026-02-28' },
  { id: 2, name: '데이터구조와 알고리즘', professor: '정소연', semester: '2026-1', studentCount: 52, status: '진행중', createdAt: '2026-02-27' },
  { id: 3, name: '웹 프로그래밍', professor: '이현기', semester: '2026-1', studentCount: 45, status: '진행중', createdAt: '2026-03-01' },
  { id: 4, name: '운영체제', professor: '정소연', semester: '2025-2', studentCount: 60, status: '종료', createdAt: '2025-09-01' },
  { id: 5, name: '고급 알고리즘', professor: '이현기', semester: '2026-1', studentCount: 0, status: '대기', createdAt: '2026-03-04' },
];

const FALLBACK_ADMIN_LOG_STATS: AdminLogStatRecord[] = [
  { label: '오늘 오류', value: '3건', valueClassName: 'text-red-600' },
  { label: '채점 완료', value: '47건', valueClassName: 'text-green-600' },
  { label: 'API 호출', value: '1,234건', valueClassName: 'text-gray-900' },
  { label: '활성 세션', value: '89명', valueClassName: 'text-gray-900' },
];

const FALLBACK_ADMIN_LOGS: AdminLogRecord[] = [
  { id: 1, timestamp: '2026-03-04 15:28:42', type: 'error', user: '시스템', message: 'Docker 채점 컨테이너 타임아웃 (과제 ID: 204)' },
  { id: 2, timestamp: '2026-03-04 15:26:18', type: 'access', user: '김철수', message: '로그인 성공 — 192.168.1.42' },
  { id: 3, timestamp: '2026-03-04 15:24:55', type: 'ai', user: '이영희', message: 'AI 튜터 질문 — 피보나치 수열 힌트 요청' },
  { id: 4, timestamp: '2026-03-04 15:22:30', type: 'grading', user: '박민수', message: '알고리즘 기초 실습3 자동 채점 완료 — 85점' },
  { id: 5, timestamp: '2026-03-04 15:18:11', type: 'error', user: '시스템', message: 'Claude API 응답 지연 (3,200ms) — 재시도 성공' },
  { id: 6, timestamp: '2026-03-04 15:15:04', type: 'access', user: '이현기', message: '교수 로그인 — 강좌 관리 페이지 접근' },
  { id: 7, timestamp: '2026-03-04 15:10:47', type: 'grading', user: '최지훈', message: '웹 프로그래밍 과제1 자동 채점 완료 — 92점' },
  { id: 8, timestamp: '2026-03-04 15:05:33', type: 'error', user: '시스템', message: 'DB 쿼리 응답 지연 (2,800ms) — 슬로우 쿼리 감지' },
];

const FALLBACK_PROFESSOR_ANALYTICS_STAT_CARDS: ProfessorAnalyticsStatCard[] = [
  { label: '평균 점수', value: '76.2점', trend: '지난 학기 대비 +3.1점', trendColor: 'green' },
  { label: '출석률', value: '91%', trend: '지난 주 대비 -1%', trendColor: 'red' },
  { label: 'AI 질문 수', value: '287건', trend: '이번 주 누적', trendColor: 'green' },
  { label: '과제 완료율', value: '84%', trend: '전체 과제 기준', trendColor: 'green' },
];

const FALLBACK_PROFESSOR_MISCONCEPTIONS: ProfessorMisconceptionRecord[] = [
  { rank: 1, concept: '재귀 함수의 기저 조건(base case) 설정', count: 24, course: '알고리즘 기초', severity: 'high' },
  { rank: 2, concept: '시간 복잡도 Big-O 계산 방법', count: 19, course: '알고리즘 기초', severity: 'high' },
  { rank: 3, concept: '스택과 큐의 동작 차이', count: 15, course: '자료구조', severity: 'medium' },
  { rank: 4, concept: '포인터와 참조 개념', count: 11, course: '자료구조', severity: 'medium' },
  { rank: 5, concept: '동적 프로그래밍 메모이제이션', count: 8, course: '알고리즘 기초', severity: 'low' },
];

const FALLBACK_PROFESSOR_WEEKLY_PARTICIPATION: ProfessorWeeklyParticipationRecord[] = [
  { week: '1주', rate: 95, questions: 12 },
  { week: '2주', rate: 92, questions: 18 },
  { week: '3주', rate: 89, questions: 34 },
  { week: '4주', rate: 91, questions: 28 },
  { week: '5주', rate: 88, questions: 41 },
];

const FALLBACK_PROFESSOR_QUESTION_PATTERNS: ProfessorQuestionPatternRecord[] = [
  { category: '개념 이해', count: 98, percentage: 34, variant: 'blue' },
  { category: '코드 디버깅', count: 87, percentage: 30, variant: 'red' },
  { category: '과제 힌트 요청', count: 65, percentage: 23, variant: 'yellow' },
  { category: '기타', count: 37, percentage: 13, variant: 'default' },
];

export async function getCurrentStudent() {
  return getSeed<Student>('current_student', MOCK_CURRENT_STUDENT);
}

export async function getCurrentProfessor() {
  return getSeed<Professor>('current_professor', MOCK_CURRENT_PROFESSOR);
}

export async function getStudentCourses() {
  return getSeed<StudentCourse[]>('student_courses', MOCK_STUDENT_COURSES);
}

export async function getProfessorCourses() {
  return getSeed<ProfessorCourse[]>('professor_courses', MOCK_PROFESSOR_COURSES);
}

export async function getCourseWeeks() {
  return getSeed<Week[]>('course_weeks', MOCK_COURSE_WEEKS);
}

export async function getCourseResources() {
  return getSeed<CourseResource[]>('course_resources', MOCK_COURSE_RESOURCES);
}

export async function getDeadlines() {
  return getSeed<Deadline[]>('deadlines', MOCK_DEADLINES);
}

export async function getRubricCriteria() {
  return getSeed<RubricCriterion[]>('rubric_criteria', MOCK_RUBRIC_CRITERIA);
}

export async function getTestResults() {
  return getSeed<TestResult[]>('test_results', MOCK_TEST_RESULTS);
}

export async function getSubmissions() {
  return getSeed<Submission[]>('submissions', MOCK_SUBMISSIONS);
}

export async function getConversations() {
  return getSeed<Conversation[]>('conversations', MOCK_CONVERSATIONS);
}

export async function getProfessorAssignments() {
  return getSeed<ProfessorAssignmentRecord[]>('professor_assignments', FALLBACK_PROFESSOR_ASSIGNMENTS);
}

export async function getProfessorAnnouncements() {
  return getSeed<ProfessorAnnouncementRecord[]>('professor_announcements', FALLBACK_PROFESSOR_ANNOUNCEMENTS);
}

export async function getStudentGrades() {
  return getSeed<StudentGradeRecord[]>('student_grades', FALLBACK_STUDENT_GRADES);
}

export async function getLearningStats() {
  return getSeed<LearningStatRecord[]>('learning_stats', FALLBACK_LEARNING_STATS);
}

export async function getCompletedCourses() {
  return getSeed<CompletedCourseRecord[]>('completed_courses', FALLBACK_COMPLETED_COURSES);
}

export async function getProfessorDashboardStats() {
  return getSeed<ProfessorDashboardStat[]>('professor_dashboard_stats', FALLBACK_PROFESSOR_DASHBOARD_STATS);
}

export async function getProfessorActivities() {
  return getSeed<ProfessorActivityRecord[]>('professor_activities', FALLBACK_PROFESSOR_ACTIVITIES);
}

export async function getStudentDashboardStats() {
  return getSeed<StudentDashboardStat[]>('student_dashboard_stats', FALLBACK_STUDENT_DASHBOARD_STATS);
}

export async function getLandingFeatures() {
  return getSeed<LandingFeatureRecord[]>('landing_features', FALLBACK_LANDING_FEATURES);
}

export async function getLandingStats() {
  return getSeed<LandingStatRecord[]>('landing_stats', FALLBACK_LANDING_STATS);
}

export async function getLandingTeam() {
  return getSeed<LandingTeamRecord[]>('landing_team', FALLBACK_LANDING_TEAM);
}

export async function getLandingFaq() {
  return getSeed<LandingFaqRecord[]>('landing_faq', FALLBACK_LANDING_FAQ);
}

export async function getAdminDashboardStats() {
  return getSeed<AdminDashboardStatRecord[]>('admin_dashboard_stats', FALLBACK_ADMIN_DASHBOARD_STATS);
}

export async function getAdminUserDistribution() {
  return getSeed<AdminUserDistributionRecord[]>('admin_user_distribution', FALLBACK_ADMIN_USER_DISTRIBUTION);
}

export async function getAdminServerResources() {
  return getSeed<AdminServerResourceRecord[]>('admin_server_resources', FALLBACK_ADMIN_SERVER_RESOURCES);
}

export async function getAdminAlerts() {
  return getSeed<AdminAlertRecord[]>('admin_alerts', FALLBACK_ADMIN_ALERTS);
}

export async function getAdminActivityLogs() {
  return getSeed<AdminActivityLogRecord[]>('admin_activity_logs', FALLBACK_ADMIN_ACTIVITY_LOGS);
}

export async function getAdminUserStats() {
  return getSeed<AdminUserStatRecord[]>('admin_user_stats', FALLBACK_ADMIN_USER_STATS);
}

export async function getAdminUsers() {
  return getSeed<AdminUserRecord[]>('admin_users', FALLBACK_ADMIN_USERS);
}

export async function getAdminCourseStats() {
  return getSeed<AdminCourseStatRecord[]>('admin_course_stats', FALLBACK_ADMIN_COURSE_STATS);
}

export async function getAdminCourses() {
  return getSeed<AdminCourseRecord[]>('admin_courses', FALLBACK_ADMIN_COURSES);
}

export async function getAdminLogStats() {
  return getSeed<AdminLogStatRecord[]>('admin_log_stats', FALLBACK_ADMIN_LOG_STATS);
}

export async function getAdminLogs() {
  return getSeed<AdminLogRecord[]>('admin_logs', FALLBACK_ADMIN_LOGS);
}

export async function getProfessorAnalyticsStatCards() {
  return getSeed<ProfessorAnalyticsStatCard[]>('professor_analytics_stat_cards', FALLBACK_PROFESSOR_ANALYTICS_STAT_CARDS);
}

export async function getProfessorMisconceptions() {
  return getSeed<ProfessorMisconceptionRecord[]>('professor_misconceptions', FALLBACK_PROFESSOR_MISCONCEPTIONS);
}

export async function getProfessorWeeklyParticipation() {
  return getSeed<ProfessorWeeklyParticipationRecord[]>('professor_weekly_participation', FALLBACK_PROFESSOR_WEEKLY_PARTICIPATION);
}

export async function getProfessorQuestionPatterns() {
  return getSeed<ProfessorQuestionPatternRecord[]>('professor_question_patterns', FALLBACK_PROFESSOR_QUESTION_PATTERNS);
}
