import type { Conversation } from '@/entities/chat';
import type {
  CourseResource,
  Deadline,
  ProfessorCourse,
  StudentCourse,
  Week,
} from '@/entities/course';
import type { RubricCriterion, TestResult } from '@/entities/assignment';
import type { Submission } from '@/entities/submission';
import type { Professor, Student } from '@/entities/user';
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

const EMPTY_STUDENT: Student = {
  id: '',
  name: '학생',
  email: '',
};

const EMPTY_PROFESSOR: Professor = {
  id: '',
  name: '교수',
  title: '님',
  email: '',
};

export async function getCurrentStudent() {
  return getSeed<Student>('current_student', EMPTY_STUDENT);
}

export async function getCurrentProfessor() {
  return getSeed<Professor>('current_professor', EMPTY_PROFESSOR);
}

export async function getStudentCourses() {
  return getSeed<StudentCourse[]>('student_courses', []);
}

export async function getProfessorCourses() {
  return getSeed<ProfessorCourse[]>('professor_courses', []);
}

export async function getCourseWeeks() {
  return getSeed<Week[]>('course_weeks', []);
}

export async function getCourseResources() {
  return getSeed<CourseResource[]>('course_resources', []);
}

export async function getDeadlines() {
  return getSeed<Deadline[]>('deadlines', []);
}

export async function getRubricCriteria() {
  return getSeed<RubricCriterion[]>('rubric_criteria', []);
}

export async function getTestResults() {
  return getSeed<TestResult[]>('test_results', []);
}

export async function getSubmissions() {
  return getSeed<Submission[]>('submissions', []);
}

export async function getConversations() {
  return getSeed<Conversation[]>('conversations', []);
}

export async function getProfessorAssignments() {
  return getSeed<ProfessorAssignmentRecord[]>('professor_assignments', []);
}

export async function getProfessorAnnouncements() {
  return getSeed<ProfessorAnnouncementRecord[]>('professor_announcements', []);
}

export async function getStudentGrades() {
  return getSeed<StudentGradeRecord[]>('student_grades', []);
}

export async function getLearningStats() {
  return getSeed<LearningStatRecord[]>('learning_stats', []);
}

export async function getCompletedCourses() {
  return getSeed<CompletedCourseRecord[]>('completed_courses', []);
}

export async function getProfessorDashboardStats() {
  return getSeed<ProfessorDashboardStat[]>('professor_dashboard_stats', []);
}

export async function getProfessorActivities() {
  return getSeed<ProfessorActivityRecord[]>('professor_activities', []);
}

export async function getStudentDashboardStats() {
  return getSeed<StudentDashboardStat[]>('student_dashboard_stats', []);
}

export async function getLandingFeatures() {
  return getSeed<LandingFeatureRecord[]>('landing_features', []);
}

export async function getLandingStats() {
  return getSeed<LandingStatRecord[]>('landing_stats', []);
}

export async function getLandingTeam() {
  return getSeed<LandingTeamRecord[]>('landing_team', []);
}

export async function getLandingFaq() {
  return getSeed<LandingFaqRecord[]>('landing_faq', []);
}

export async function getAdminDashboardStats() {
  return getSeed<AdminDashboardStatRecord[]>('admin_dashboard_stats', []);
}

export async function getAdminUserDistribution() {
  return getSeed<AdminUserDistributionRecord[]>('admin_user_distribution', []);
}

export async function getAdminServerResources() {
  return getSeed<AdminServerResourceRecord[]>('admin_server_resources', []);
}

export async function getAdminAlerts() {
  return getSeed<AdminAlertRecord[]>('admin_alerts', []);
}

export async function getAdminActivityLogs() {
  return getSeed<AdminActivityLogRecord[]>('admin_activity_logs', []);
}

export async function getAdminUserStats() {
  return getSeed<AdminUserStatRecord[]>('admin_user_stats', []);
}

export async function getAdminUsers() {
  return getSeed<AdminUserRecord[]>('admin_users', []);
}

export async function getAdminCourseStats() {
  return getSeed<AdminCourseStatRecord[]>('admin_course_stats', []);
}

export async function getAdminCourses() {
  return getSeed<AdminCourseRecord[]>('admin_courses', []);
}

export async function getAdminLogStats() {
  return getSeed<AdminLogStatRecord[]>('admin_log_stats', []);
}

export async function getAdminLogs() {
  return getSeed<AdminLogRecord[]>('admin_logs', []);
}

export async function getProfessorAnalyticsStatCards() {
  return getSeed<ProfessorAnalyticsStatCard[]>('professor_analytics_stat_cards', []);
}

export async function getProfessorMisconceptions() {
  return getSeed<ProfessorMisconceptionRecord[]>('professor_misconceptions', []);
}

export async function getProfessorWeeklyParticipation() {
  return getSeed<ProfessorWeeklyParticipationRecord[]>('professor_weekly_participation', []);
}

export async function getProfessorQuestionPatterns() {
  return getSeed<ProfessorQuestionPatternRecord[]>('professor_question_patterns', []);
}
