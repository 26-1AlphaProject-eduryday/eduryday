import { NextResponse } from 'next/server';
import { fail } from '@/shared/lib/api/response';
import { canReadLesson, canReadSubmission } from '@/shared/lib/supabase/access';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

const ALLOWED_BUCKETS = ['assignment-files', 'lesson-materials', 'submission-files'] as const;
type Bucket = (typeof ALLOWED_BUCKETS)[number];

function isValidBucket(value: unknown): value is Bucket {
  return ALLOWED_BUCKETS.includes(value as Bucket);
}

export async function GET(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const url = new URL(req.url);
  const bucket = url.searchParams.get('bucket');
  const path = url.searchParams.get('path');

  if (!isValidBucket(bucket) || !path) {
    return fail('VALIDATION_ERROR', 'bucket과 path는 필수입니다.');
  }

  if (bucket === 'lesson-materials') {
    const { data: lesson } = await client
      .from('lessons')
      .select('id')
      .eq('file_url', path)
      .maybeSingle<{ id: string }>();

    if (!lesson || !(await canReadLesson(client, lesson.id, auth))) {
      return fail('FORBIDDEN', '접근 가능한 강의 자료가 아닙니다.', 403);
    }
  }

  if (bucket === 'submission-files') {
    const { data: submission } = await client
      .from('submissions')
      .select('id')
      .eq('file_url', path)
      .maybeSingle<{ id: string }>();

    if (!submission || !(await canReadSubmission(client, submission.id, auth))) {
      return fail('FORBIDDEN', '접근 가능한 제출 파일이 아닙니다.', 403);
    }
  }

  if (bucket === 'assignment-files' && auth.role !== 'professor' && auth.role !== 'admin') {
    return fail('FORBIDDEN', '교수/관리자만 과제 파일을 다운로드할 수 있습니다.', 403);
  }

  const { data, error } = await client.storage.from(bucket).createSignedUrl(path, 60);

  if (error || !data?.signedUrl) {
    return fail('STORAGE_ERROR', error?.message ?? '다운로드 URL 생성 실패', 500);
  }

  return NextResponse.redirect(data.signedUrl);
}
