import { fail, ok } from '@/shared/lib/api/response';
import { canManageCourse, canReadCourse, getAccessibleCourseIds } from '@/shared/lib/supabase/access';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface AnnouncementRow {
  id: string;
  title: string;
  content: string;
  course_id: string;
  pinned: boolean;
  views: number;
  created_at: string;
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
    .from('announcements')
    .select('id, title, content, course_id, pinned, views, created_at, courses(title)')
    .order('created_at', { ascending: false });

  if (courseId) {
    if (!(await canReadCourse(client, courseId, auth))) {
      return fail('FORBIDDEN', '접근 가능한 강좌가 아닙니다.', 403);
    }
    dbQuery = dbQuery.eq('course_id', courseId);
  } else if (accessibleCourseIds !== null) {
    if (accessibleCourseIds.length === 0) {
      return ok({ announcements: [] });
    }
    dbQuery = dbQuery.in('course_id', accessibleCourseIds);
  }

  const { data, error } = await dbQuery;

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  const rows = (data ?? []) as AnnouncementRow[];
  const announcements = rows.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    courseId: row.course_id,
    course: Array.isArray(row.courses) ? row.courses[0]?.title ?? '-' : row.courses?.title ?? '-',
    createdAt: row.created_at.slice(0, 10),
    views: row.views,
    pinned: row.pinned,
  }));

  return ok({ announcements });
}

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();

  if (!auth || (auth.role !== 'professor' && auth.role !== 'admin')) {
    return fail('UNAUTHORIZED', '교수 또는 관리자 권한이 필요합니다.', 401);
  }

  if (auth.status !== 'active') {
    return fail('FORBIDDEN', '활성 계정만 공지를 작성할 수 있습니다.', 403);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const body = await req.json().catch(() => null);

  if (!body?.title || !body?.content || !body?.courseId) {
    return fail('VALIDATION_ERROR', 'title, content, courseId는 필수입니다.');
  }

  const courseId = String(body.courseId);

  if (!(await canManageCourse(client, courseId, auth))) {
    return fail('FORBIDDEN', '본인 강좌에만 공지를 작성할 수 있습니다.', 403);
  }

  const { data, error } = await client
    .from('announcements')
    .insert({
      title: String(body.title),
      content: String(body.content),
      course_id: courseId,
      pinned: Boolean(body.pinned),
      created_by: auth.userId,
    })
    .select('id')
    .single();

  if (error || !data) {
    return fail('DB_ERROR', error?.message ?? '공지 작성에 실패했습니다.', 500);
  }

  return ok({ id: data.id });
}
