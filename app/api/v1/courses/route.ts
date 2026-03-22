import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface CourseRow {
  id: string;
  title: string;
   description: string | null;
  professor_name: string;
  semester: string;
  section: string | null;
  student_count: number;
  current_week: number;
  total_weeks: number;
  status: 'active' | 'closed' | 'draft' | 'pending';
  created_at: string;
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
  const status = url.searchParams.get('status') ?? 'all';
  const semester = url.searchParams.get('semester') ?? 'all';
  const query = (url.searchParams.get('q') ?? '').trim();
  const page = Number(url.searchParams.get('page') ?? '1');
  const pageSize = Number(url.searchParams.get('pageSize') ?? '10');
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let dbQuery = client
    .from('courses')
    .select('id, title, description, professor_name, semester, section, student_count, current_week, total_weeks, status, created_at', {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (auth.role === 'student') {
    const { data: enrollments, error: enrollmentError } = await client
      .from('enrollments')
      .select('course_id')
      .eq('student_id', auth.userId);

    if (enrollmentError) {
      return fail('DB_ERROR', enrollmentError.message, 500);
    }

    const courseIds = (enrollments ?? []).map((row) => row.course_id).filter(Boolean);

    if (courseIds.length === 0) {
      return ok({ courses: [], total: 0, page, pageSize });
    }

    dbQuery = dbQuery.in('id', courseIds);
  }

  if (auth.role === 'professor') {
    dbQuery = dbQuery.eq('created_by', auth.userId);
  }

  if (status !== 'all') {
    dbQuery = dbQuery.eq('status', status);
  }

  if (semester !== 'all') {
    dbQuery = dbQuery.eq('semester', semester);
  }

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,professor_name.ilike.%${query}%`);
  }

  const { data, error, count } = await dbQuery;

  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  const rows = (data ?? []) as CourseRow[];

  const courses = rows.map((row) => ({
    id: row.id,
    name: row.title,
    title: row.title,
    description: row.description,
    professor: row.professor_name,
    semester: row.semester,
    section: row.section,
    studentCount: row.student_count,
    students: row.student_count,
    currentWeek: row.current_week,
    totalWeeks: row.total_weeks,
    status:
      row.status === 'active'
        ? '진행중'
        : row.status === 'closed'
          ? '종료'
          : row.status === 'pending'
            ? '대기'
            : '대기',
    createdAt: row.created_at.slice(0, 10),
  }));

  return ok({ courses, total: count ?? courses.length, page, pageSize });
}

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();

  if (!auth || (auth.role !== 'professor' && auth.role !== 'admin')) {
    return fail('UNAUTHORIZED', '교수 또는 관리자 권한이 필요합니다.', 401);
  }

  if (auth.status !== 'active') {
    return fail('FORBIDDEN', '활성 계정만 강좌를 생성할 수 있습니다.', 403);
  }

  const client = getServiceRoleClient();

  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);
  }

  const body = await req.json().catch(() => null);

  if (!body?.title || !body?.semester) {
    return fail('VALIDATION_ERROR', 'title, semester는 필수입니다.');
  }

  const { data, error } = await client
    .from('courses')
      .insert({
        title: String(body.title),
        description: body.description ? String(body.description) : null,
        professor_name: String(body.professorName ?? auth.email.split('@')[0]),
        professor_id: auth.role === 'professor' ? auth.userId : null,
        semester: String(body.semester),
      section: body.section ? String(body.section) : null,
      student_count: Number(body.studentCount ?? 0),
      current_week: Number(body.currentWeek ?? 1),
      total_weeks: Number(body.totalWeeks ?? 15),
      status: body.status === 'closed' || body.status === 'draft' ? body.status : 'active',
      created_by: auth.userId,
    })
    .select('id, title')
    .single();

  if (error || !data) {
    return fail('DB_ERROR', error?.message ?? '강좌 생성에 실패했습니다.', 500);
  }

  return ok({ id: data.id, title: data.title });
}
