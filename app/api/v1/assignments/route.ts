import { fail, ok } from '@/shared/lib/api/response';
import { canManageCourse, canReadCourse, getAccessibleCourseIds } from '@/shared/lib/supabase/access';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface AssignmentRow {
  id: string;
  title: string;
  type: string;
  deadline: string | null;
  status: string;
  submitted_count: number;
  graded_count: number;
  course_id: string;
  courses: { title: string } | { title: string }[] | null;
}

export async function GET(req: Request) {
  const auth = await getRouteAuthContext();

  if (!auth) {
    return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const url = new URL(req.url);
  const courseId = url.searchParams.get('courseId');
  const accessibleCourseIds = await getAccessibleCourseIds(client, auth);

  let dbQuery = client
    .from('assignments')
    .select('id, title, type, deadline, status, submitted_count, graded_count, course_id, courses(title)')
    .order('created_at', { ascending: false });

  if (courseId) {
    if (!(await canReadCourse(client, courseId, auth))) {
      return fail('FORBIDDEN', '접근 가능한 강좌가 아닙니다.', 403);
    }
    dbQuery = dbQuery.eq('course_id', courseId);
  } else if (accessibleCourseIds !== null) {
    if (accessibleCourseIds.length === 0) {
      return ok({ assignments: [] });
    }
    dbQuery = dbQuery.in('course_id', accessibleCourseIds);
  }

  if (auth.role === 'student') {
    dbQuery = dbQuery.eq('status', 'active');
  }

  const { data, error } = await dbQuery;

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  const rows = (data ?? []) as unknown as AssignmentRow[];
  const courseIds = Array.from(new Set(rows.map((row) => row.course_id)));
  const enrollmentCountByCourse = new Map<string, number>();

  if (courseIds.length > 0) {
    const { data: enrollments } = await client
      .from('enrollments')
      .select('course_id')
      .in('course_id', courseIds);

    for (const enrollment of (enrollments ?? []) as { course_id: string }[]) {
      enrollmentCountByCourse.set(
        enrollment.course_id,
        (enrollmentCountByCourse.get(enrollment.course_id) ?? 0) + 1,
      );
    }
  }

  const assignments = rows.map((row) => ({
    id: row.id,
    title: row.title,
    course: Array.isArray(row.courses) ? row.courses[0]?.title ?? '-' : row.courses?.title ?? '-',
    courseId: row.course_id,
    type: row.type,
    deadline: row.deadline,
    submitted: row.submitted_count,
    total: enrollmentCountByCourse.get(row.course_id) ?? row.submitted_count,
    graded: row.graded_count,
    status: row.status,
  }));

  return ok({ assignments });
}

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();

  if (!auth || (auth.role !== 'professor' && auth.role !== 'admin')) {
    return fail('UNAUTHORIZED', '교수 또는 관리자 권한이 필요합니다.', 401);
  }

  if (auth.status !== 'active') {
    return fail('FORBIDDEN', '활성 계정만 과제를 생성할 수 있습니다.', 403);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const body = await req.json().catch(() => null);

  if (!body?.title || !body?.courseId) {
    return fail('VALIDATION_ERROR', 'title, courseId는 필수입니다.');
  }

  const courseId = String(body.courseId);

  if (!(await canManageCourse(client, courseId, auth))) {
    return fail('FORBIDDEN', '본인 강좌에만 과제를 생성할 수 있습니다.', 403);
  }

  const { data, error } = await client
    .from('assignments')
    .insert({
      title: String(body.title),
      course_id: courseId,
      description: body.description ? String(body.description) : null,
      type:
        body.type === 'essay' || body.type === 'multiple-choice' || body.type === 'file'
          ? body.type
          : 'coding',
      deadline: body.deadline ? String(body.deadline) : null,
      status: body.status === 'active' || body.status === 'closed' ? body.status : 'draft',
      rubric: Array.isArray(body.rubric) ? body.rubric : [],
      test_cases: Array.isArray(body.testCases) ? body.testCases : [],
      created_by: auth.userId,
    })
    .select('id, title, created_at')
    .single();

  if (error || !data) {
    return fail('DB_ERROR', error?.message ?? '과제 생성에 실패했습니다.', 500);
  }

  try {
    await client.from('activity_logs').insert({
      type: 'course',
      user_name: auth.email.split('@')[0],
      user_role: auth.role ?? 'professor',
      user_id: auth.userId,
      message: `과제 생성: ${data.title}`,
    });
  } catch {}

  return ok({ id: data.id, title: data.title, createdAt: data.created_at });
}
