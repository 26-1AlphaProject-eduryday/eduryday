/**
 * db-queries.ts
 *
 * Real Supabase DB query helpers for launch-critical pages.
 * Each function returns an empty/default value when Supabase is not configured.
 */

import { getRouteAuthContext, getServiceRoleClient } from './route';
import type { StudentCourse, ProfessorCourse, Deadline, Week, CourseResource } from '@/entities/course';
import type { Student, Professor } from '@/entities/user';
import type {
  StudentDashboardStat,
  StudentGradeRecord,
  LearningStatRecord,
  CompletedCourseRecord,
  ProfessorDashboardStat,
  ProfessorActivityRecord,
  ProfessorAnnouncementRecord,
  AdminDashboardStatRecord,
  AdminActivityLogRecord,
} from './ui-seed';

// ---------------------------------------------------------------------------
// Student helpers
// ---------------------------------------------------------------------------

interface ProfileRow {
  id: string;
  name: string;
  email: string;
  student_id: string | null;
  department: string | null;
}

interface CourseEnrollRow {
  course_id: string;
  courses: {
    id: string;
    title: string;
    professor_name: string;
    semester: string;
    current_week: number;
    total_weeks: number;
  } | null;
}

interface AssignmentRow {
  id: string;
  title: string;
  deadline: string | null;
  courses: { title: string } | null;
}

interface SubmissionRow {
  id: string;
  final_score: number | null;
  auto_score: number | null;
  status: string;
  submitted_at: string;
  assignments: {
    id: string;
    title: string;
    max_score: number;
    courses: { title: string } | null;
  } | null;
}

interface ProfesssorCourseRow {
  id: string;
  title: string;
  semester: string;
  section: string | null;
  student_count: number;
  current_week: number;
  total_weeks: number;
}

interface ActivityLogRow {
  type: string;
  user_name: string;
  user_role: string | null;
  message: string;
  ip: string | null;
  created_at: string;
}

interface CourseWeekRow {
  id: string;
  number: number;
  title: string;
  status: string;
}

interface LessonRow {
  id: string;
  title: string;
  type: string;
  completed_by: unknown;
  order_num: number;
  week_id: string;
}

interface CourseWithWeeksRow {
  id: string;
  title: string;
  professor_name: string;
  current_week: number;
  total_weeks: number;
  course_weeks: CourseWeekRow[];
}

const EMPTY_STUDENT: Student = { id: '', name: '학생', email: '' };
const EMPTY_PROFESSOR: Professor = { id: '', name: '교수', title: '님', email: '' };

// ---------------------------------------------------------------------------

export async function getDbCurrentStudent(): Promise<Student> {
  const ctx = await getRouteAuthContext();
  if (!ctx) return EMPTY_STUDENT;

  const { data } = await ctx.supabase
    .from('profiles')
    .select('id, name, email, student_id, department')
    .eq('id', ctx.userId)
    .maybeSingle<ProfileRow>();

  if (!data) return EMPTY_STUDENT;
  return { id: data.id, name: data.name, email: data.email };
}

export async function getDbCurrentProfessor(): Promise<Professor> {
  const ctx = await getRouteAuthContext();
  if (!ctx) return EMPTY_PROFESSOR;

  const { data } = await ctx.supabase
    .from('profiles')
    .select('id, name, email')
    .eq('id', ctx.userId)
    .maybeSingle<ProfileRow>();

  if (!data) return EMPTY_PROFESSOR;
  return { id: data.id, name: data.name, title: '교수님', email: data.email };
}

export async function getDbStudentCourses(): Promise<StudentCourse[]> {
  const ctx = await getRouteAuthContext();
  if (!ctx) return [];

  const { data } = await ctx.supabase
    .from('enrollments')
    .select('course_id, courses(id, title, professor_name, semester, current_week, total_weeks)')
    .eq('student_id', ctx.userId)
    .returns<CourseEnrollRow[]>();

  if (!data) return [];

  return data
    .filter((row) => row.courses !== null)
    .map((row) => {
      const c = row.courses!;
      const progress = c.total_weeks > 0
        ? Math.round((c.current_week / c.total_weeks) * 100)
        : 0;
      return {
        id: c.id,
        title: c.title,
        professor: c.professor_name,
        progress,
      };
    });
}

export async function getDbStudentDashboardStats(courseCount: number, deadlineCount: number): Promise<StudentDashboardStat[]> {
  return [
    { label: '수강 중인 강좌', value: `${courseCount}개` },
    { label: '다가오는 마감', value: `${deadlineCount}개` },
  ];
}

export async function getDbDeadlines(): Promise<Deadline[]> {
  const ctx = await getRouteAuthContext();
  if (!ctx) return [];

  const now = new Date().toISOString();

  const { data: enrollments } = await ctx.supabase
    .from('enrollments')
    .select('course_id')
    .eq('student_id', ctx.userId);

  if (!enrollments || enrollments.length === 0) return [];

  const courseIds = enrollments.map((e) => e.course_id as string);

  const { data } = await ctx.supabase
    .from('assignments')
    .select('id, title, deadline, courses(title)')
    .in('course_id', courseIds)
    .eq('status', 'active')
    .gte('deadline', now)
    .order('deadline', { ascending: true })
    .limit(5)
    .returns<AssignmentRow[]>();

  if (!data) return [];

  return data
    .filter((row) => row.deadline)
    .map((row) => {
      const deadline = new Date(row.deadline!);
      const today = new Date();
      const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const dday = diffDays === 0 ? 'D-Day' : diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
      return {
        id: row.id,
        title: row.title,
        course: (row.courses as { title: string } | null)?.title ?? '-',
        dday,
        ddayUrgent: diffDays <= 1,
        date: deadline.toLocaleDateString('ko-KR'),
      };
    });
}

export async function getDbStudentGrades(): Promise<StudentGradeRecord[]> {
  const ctx = await getRouteAuthContext();
  if (!ctx) return [];

  const { data } = await ctx.supabase
    .from('submissions')
    .select('id, final_score, auto_score, status, submitted_at, assignments(id, title, max_score, courses(title))')
    .eq('student_id', ctx.userId)
    .order('submitted_at', { ascending: false })
    .returns<SubmissionRow[]>();

  if (!data) return [];

  return data
    .filter((row) => row.assignments !== null)
    .map((row) => {
      const assignment = row.assignments!;
      const score = row.final_score ?? row.auto_score ?? 0;
      return {
        id: row.id,
        course: (assignment.courses as { title: string } | null)?.title ?? '-',
        assignment: assignment.title,
        score,
        maxScore: assignment.max_score,
        feedback: '',
        submittedAt: row.submitted_at.slice(0, 10),
        status: row.status === 'complete' ? 'graded' as const : 'pending' as const,
      };
    });
}

export async function getDbStudentProfile(): Promise<{
  student: Student;
  learningStats: LearningStatRecord[];
  completedCourses: CompletedCourseRecord[];
}> {
  const ctx = await getRouteAuthContext();
  if (!ctx) {
    return { student: EMPTY_STUDENT, learningStats: [], completedCourses: [] };
  }

  const [profileResult, courseResult] = await Promise.all([
    ctx.supabase
      .from('profiles')
      .select('id, name, email')
      .eq('id', ctx.userId)
      .maybeSingle<ProfileRow>(),
    ctx.supabase
      .from('enrollments')
      .select('course_id, courses(id, title, semester, current_week, total_weeks)')
      .eq('student_id', ctx.userId)
      .returns<CourseEnrollRow[]>(),
  ]);

  const profile = profileResult.data;
  const student: Student = profile
    ? { id: profile.id, name: profile.name, email: profile.email }
    : EMPTY_STUDENT;

  const allCourses = (courseResult.data ?? []).filter((r) => r.courses !== null);
  const completedCourses: CompletedCourseRecord[] = allCourses
    .filter((r) => {
      const c = r.courses!;
      return c.current_week >= c.total_weeks;
    })
    .map((r) => {
      const c = r.courses!;
      return {
        id: c.id,
        title: c.title,
        semester: c.semester,
        grade: '-',
      };
    });

  const learningStats: LearningStatRecord[] = [
    { label: '수강 강좌', value: `${allCourses.length}개`, trend: '', trendColor: 'green' },
    { label: '수료 강좌', value: `${completedCourses.length}개`, trend: '', trendColor: 'green' },
  ];

  return { student, learningStats, completedCourses };
}

// ---------------------------------------------------------------------------
// Professor helpers
// ---------------------------------------------------------------------------

export async function getDbProfessorCourses(): Promise<ProfessorCourse[]> {
  const ctx = await getRouteAuthContext();
  if (!ctx) return [];

  const { data } = await ctx.supabase
    .from('courses')
    .select('id, title, semester, section, student_count, current_week, total_weeks')
    .eq('created_by', ctx.userId)
    .order('created_at', { ascending: false })
    .returns<ProfesssorCourseRow[]>();

  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    semester: row.section ? `${row.semester} ${row.section}` : row.semester,
    students: row.student_count,
    currentWeek: row.current_week,
    totalWeeks: row.total_weeks,
  }));
}

export async function getDbProfessorDashboardStats(courses: ProfessorCourse[]): Promise<ProfessorDashboardStat[]> {
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  return [
    { label: '담당 강좌', value: `${courses.length}개` },
    { label: '전체 수강생', value: `${totalStudents}명` },
  ];
}

export async function getDbProfessorActivities(): Promise<ProfessorActivityRecord[]> {
  const client = getServiceRoleClient();
  if (!client) return [];

  const { data } = await client
    .from('activity_logs')
    .select('type, user_name, message, created_at')
    .order('created_at', { ascending: false })
    .limit(5)
    .returns<ActivityLogRow[]>();

  if (!data) return [];

  const colorMap: Record<string, string> = {
    submit: 'bg-blue-400',
    ai: 'bg-purple-400',
    login: 'bg-green-400',
    course: 'bg-yellow-400',
    grading: 'bg-orange-400',
  };

  return data.map((row) => ({
    color: colorMap[row.type] ?? 'bg-gray-400',
    text: row.message,
  }));
}

export async function getDbProfessorAnnouncements(): Promise<ProfessorAnnouncementRecord[]> {
  const ctx = await getRouteAuthContext();
  if (!ctx) return [];

  interface AnnouncementJoinRow {
    id: string;
    title: string;
    pinned: boolean;
    views: number;
    created_at: string;
    courses: { title: string } | { title: string }[] | null;
  }

  const { data } = await ctx.supabase
    .from('announcements')
    .select('id, title, pinned, views, created_at, courses(title)')
    .eq('created_by', ctx.userId)
    .order('created_at', { ascending: false })
    .returns<AnnouncementJoinRow[]>();

  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    course: Array.isArray(row.courses) ? row.courses[0]?.title ?? '-' : row.courses?.title ?? '-',
    createdAt: row.created_at.slice(0, 10),
    views: row.views,
    pinned: row.pinned,
  }));
}

// ---------------------------------------------------------------------------
// Admin helpers
// ---------------------------------------------------------------------------

export async function getDbAdminDashboardStats(): Promise<AdminDashboardStatRecord[]> {
  const client = getServiceRoleClient();
  if (!client) return [];

  const [usersResult, coursesResult] = await Promise.all([
    client.from('profiles').select('id', { count: 'exact', head: true }),
    client.from('courses').select('id', { count: 'exact', head: true }),
  ]);

  return [
    {
      label: '전체 사용자',
      value: String(usersResult.count ?? 0),
      trend: null,
      trendClassName: 'text-gray-500',
    },
    {
      label: '전체 강좌',
      value: String(coursesResult.count ?? 0),
      trend: null,
      trendClassName: 'text-gray-500',
    },
  ];
}

export async function getDbAdminActivityLogs(): Promise<AdminActivityLogRecord[]> {
  const client = getServiceRoleClient();
  if (!client) return [];

  const { data } = await client
    .from('activity_logs')
    .select('type, user_name, user_role, message, ip, created_at')
    .order('created_at', { ascending: false })
    .limit(10)
    .returns<ActivityLogRow[]>();

  if (!data) return [];

  return data.map((row) => ({
    time: new Date(row.created_at).toLocaleString('ko-KR'),
    type: (row.type as AdminActivityLogRecord['type']) ?? 'login',
    user: row.user_name,
    userRole: row.user_role ?? '-',
    content: row.message,
    ip: row.ip ?? '-',
  }));
}

// ---------------------------------------------------------------------------
// Course detail helpers (enrollment-backed)
// ---------------------------------------------------------------------------

export async function getDbCourseDetail(courseId: string): Promise<{
  course: StudentCourse | null;
  weeks: Week[];
  resources: CourseResource[];
}> {
  const ctx = await getRouteAuthContext();
  if (!ctx) return { course: null, weeks: [], resources: [] };

  // Verify enrollment
  const { data: enrollment } = await ctx.supabase
    .from('enrollments')
    .select('course_id')
    .eq('course_id', courseId)
    .eq('student_id', ctx.userId)
    .maybeSingle();

  if (!enrollment) return { course: null, weeks: [], resources: [] };

  const [courseResult, weeksResult] = await Promise.all([
    ctx.supabase
      .from('courses')
      .select('id, title, professor_name, current_week, total_weeks, course_weeks(id, number, title, status)')
      .eq('id', courseId)
      .maybeSingle<CourseWithWeeksRow>(),
    ctx.supabase
      .from('course_weeks')
      .select('id, number, title, status')
      .eq('course_id', courseId)
      .order('number', { ascending: true })
      .returns<CourseWeekRow[]>(),
  ]);

  const courseRow = courseResult.data;
  if (!courseRow) return { course: null, weeks: [], resources: [] };

  const progress = courseRow.total_weeks > 0
    ? Math.round((courseRow.current_week / courseRow.total_weeks) * 100)
    : 0;

  const course: StudentCourse = {
    id: courseRow.id,
    title: courseRow.title,
    professor: courseRow.professor_name,
    progress,
  };

  const weekRows = weeksResult.data ?? [];

  // Load lessons for each week
  const lessonsResult = weekRows.length > 0
    ? await ctx.supabase
        .from('lessons')
        .select('id, title, type, completed_by, order_num, week_id')
        .in('week_id', weekRows.map((w) => w.id))
        .order('order_num', { ascending: true })
        .returns<LessonRow[]>()
    : { data: [] as LessonRow[] };

  const lessonsByWeek = new Map<string, LessonRow[]>();
  for (const lesson of (lessonsResult.data ?? [])) {
    const existing = lessonsByWeek.get(lesson.week_id) ?? [];
    existing.push(lesson);
    lessonsByWeek.set(lesson.week_id, existing);
  }

  const weeks: Week[] = weekRows.map((w) => {
    const weekLessons = lessonsByWeek.get(w.id) ?? [];
    const status = w.status as Week['status'];
    return {
      id: w.id,
      number: w.number,
      title: w.title,
      status,
      lessons: weekLessons.map((l) => {
        const completedBy = Array.isArray(l.completed_by) ? l.completed_by : [];
        return {
          id: l.id,
          title: l.title,
          type: l.type as 'lecture' | 'practice' | 'quiz',
          completed: completedBy.includes(ctx.userId),
          active: status === 'in-progress',
        };
      }),
    };
  });

  return { course, weeks, resources: [] };
}
