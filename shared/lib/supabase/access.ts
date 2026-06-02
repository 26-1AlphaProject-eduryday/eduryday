import type { SupabaseClient } from '@supabase/supabase-js';
import type { RouteAuthContext } from './route';

interface IdRow {
  id: string;
}

interface CourseRefRow {
  course_id: string;
}

interface AssignmentRefRow {
  assignment_id: string;
}

export async function getAccessibleCourseIds(
  client: SupabaseClient,
  auth: RouteAuthContext,
): Promise<string[] | null> {
  if (auth.role === 'admin') {
    return null;
  }

  if (auth.role === 'professor') {
    const { data } = await client
      .from('courses')
      .select('id')
      .or(`created_by.eq.${auth.userId},professor_id.eq.${auth.userId}`);
    return ((data ?? []) as IdRow[]).map((row) => row.id);
  }

  if (auth.role === 'student') {
    const { data } = await client.from('enrollments').select('course_id').eq('student_id', auth.userId);
    return ((data ?? []) as CourseRefRow[]).map((row) => row.course_id);
  }

  return [];
}

export async function isCourseOwner(
  client: SupabaseClient,
  courseId: string,
  userId: string,
): Promise<boolean> {
  const { data, error } = await client
    .from('courses')
    .select('id')
    .eq('id', courseId)
    .or(`created_by.eq.${userId},professor_id.eq.${userId}`)
    .maybeSingle<IdRow>();

  return !error && Boolean(data);
}

export async function isStudentEnrolled(
  client: SupabaseClient,
  courseId: string,
  userId: string,
): Promise<boolean> {
  const { data, error } = await client
    .from('enrollments')
    .select('id')
    .eq('course_id', courseId)
    .eq('student_id', userId)
    .maybeSingle<IdRow>();

  return !error && Boolean(data);
}

export async function canReadCourse(
  client: SupabaseClient,
  courseId: string,
  auth: RouteAuthContext,
): Promise<boolean> {
  if (auth.role === 'admin') return true;
  if (auth.role === 'professor') return isCourseOwner(client, courseId, auth.userId);
  if (auth.role === 'student') return isStudentEnrolled(client, courseId, auth.userId);
  return false;
}

export async function canManageCourse(
  client: SupabaseClient,
  courseId: string,
  auth: RouteAuthContext,
): Promise<boolean> {
  if (auth.role === 'admin') return true;
  if (auth.role === 'professor') return isCourseOwner(client, courseId, auth.userId);
  return false;
}

export async function getCourseIdForAssignment(
  client: SupabaseClient,
  assignmentId: string,
): Promise<string | null> {
  const { data, error } = await client
    .from('assignments')
    .select('course_id')
    .eq('id', assignmentId)
    .maybeSingle<CourseRefRow>();

  if (error || !data) return null;
  return data.course_id;
}

export async function canReadAssignment(
  client: SupabaseClient,
  assignmentId: string,
  auth: RouteAuthContext,
): Promise<boolean> {
  const courseId = await getCourseIdForAssignment(client, assignmentId);
  return courseId ? canReadCourse(client, courseId, auth) : false;
}

export async function canManageAssignment(
  client: SupabaseClient,
  assignmentId: string,
  auth: RouteAuthContext,
): Promise<boolean> {
  const courseId = await getCourseIdForAssignment(client, assignmentId);
  return courseId ? canManageCourse(client, courseId, auth) : false;
}

export async function getCourseIdForSubmission(
  client: SupabaseClient,
  submissionId: string,
): Promise<string | null> {
  const { data: submission, error } = await client
    .from('submissions')
    .select('assignment_id')
    .eq('id', submissionId)
    .maybeSingle<AssignmentRefRow>();

  if (error || !submission) return null;
  return getCourseIdForAssignment(client, submission.assignment_id);
}

export async function canManageSubmission(
  client: SupabaseClient,
  submissionId: string,
  auth: RouteAuthContext,
): Promise<boolean> {
  const courseId = await getCourseIdForSubmission(client, submissionId);
  return courseId ? canManageCourse(client, courseId, auth) : false;
}

export async function canReadSubmission(
  client: SupabaseClient,
  submissionId: string,
  auth: RouteAuthContext,
): Promise<boolean> {
  if (auth.role === 'admin') return true;

  const { data, error } = await client
    .from('submissions')
    .select('id, student_id, assignment_id')
    .eq('id', submissionId)
    .maybeSingle<{ id: string; student_id: string | null; assignment_id: string }>();

  if (error || !data) return false;
  if (auth.role === 'student') return data.student_id === auth.userId;
  if (auth.role === 'professor') return canManageAssignment(client, data.assignment_id, auth);
  return false;
}

export async function getCourseIdForWeek(
  client: SupabaseClient,
  weekId: string,
): Promise<string | null> {
  const { data, error } = await client
    .from('course_weeks')
    .select('course_id')
    .eq('id', weekId)
    .maybeSingle<CourseRefRow>();

  if (error || !data) return null;
  return data.course_id;
}

export async function getCourseIdForLesson(
  client: SupabaseClient,
  lessonId: string,
): Promise<string | null> {
  const { data, error } = await client
    .from('lessons')
    .select('week_id')
    .eq('id', lessonId)
    .maybeSingle<{ week_id: string }>();

  if (error || !data) return null;
  return getCourseIdForWeek(client, data.week_id);
}

export async function canManageWeek(
  client: SupabaseClient,
  weekId: string,
  auth: RouteAuthContext,
): Promise<boolean> {
  const courseId = await getCourseIdForWeek(client, weekId);
  return courseId ? canManageCourse(client, courseId, auth) : false;
}

export async function canReadWeek(
  client: SupabaseClient,
  weekId: string,
  auth: RouteAuthContext,
): Promise<boolean> {
  const courseId = await getCourseIdForWeek(client, weekId);
  return courseId ? canReadCourse(client, courseId, auth) : false;
}

export async function canManageLesson(
  client: SupabaseClient,
  lessonId: string,
  auth: RouteAuthContext,
): Promise<boolean> {
  const courseId = await getCourseIdForLesson(client, lessonId);
  return courseId ? canManageCourse(client, courseId, auth) : false;
}

export async function canReadLesson(
  client: SupabaseClient,
  lessonId: string,
  auth: RouteAuthContext,
): Promise<boolean> {
  const courseId = await getCourseIdForLesson(client, lessonId);
  return courseId ? canReadCourse(client, courseId, auth) : false;
}

export async function canManageEnrollment(
  client: SupabaseClient,
  enrollmentId: string,
  auth: RouteAuthContext,
): Promise<boolean> {
  if (auth.role === 'admin') return true;
  if (auth.role !== 'professor') return false;

  const { data, error } = await client
    .from('enrollments')
    .select('course_id')
    .eq('id', enrollmentId)
    .maybeSingle<CourseRefRow>();

  if (error || !data) return false;
  return isCourseOwner(client, data.course_id, auth.userId);
}
