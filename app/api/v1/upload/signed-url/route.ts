import { fail, ok } from '@/shared/lib/api/response';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['pdf', 'zip', 'py', 'java', 'cpp', 'js', 'ts', 'tsx', 'jsx', 'docx', 'pptx', 'md', 'txt', 'png', 'jpg', 'jpeg'];
const ALLOWED_BUCKETS = ['assignment-files', 'lesson-materials', 'submission-files'] as const;

type Bucket = (typeof ALLOWED_BUCKETS)[number];

function isValidBucket(value: unknown): value is Bucket {
  return ALLOWED_BUCKETS.includes(value as Bucket);
}

function getExtension(filename: string): string {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? '' : filename.slice(dot + 1).toLowerCase();
}

export async function POST(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);

  const client = getServiceRoleClient();
  if (!client) return fail('CONFIG_ERROR', 'Supabase service role 설정이 필요합니다.', 500);

  const body = await req.json().catch(() => null);
  const bucket = body?.bucket;
  const filename = typeof body?.filename === 'string' ? body.filename : '';
  const size = typeof body?.size === 'number' ? body.size : 0;

  if (!isValidBucket(bucket)) {
    return fail('VALIDATION_ERROR', '유효하지 않은 bucket입니다.');
  }

  if (!filename || filename.length < 1) {
    return fail('VALIDATION_ERROR', 'filename은 필수입니다.');
  }

  if (size > MAX_FILE_SIZE) {
    return fail('FILE_TOO_LARGE', `파일 크기는 ${MAX_FILE_SIZE / 1024 / 1024}MB 이하여야 합니다.`, 400);
  }

  const ext = getExtension(filename);
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return fail('INVALID_FILE_TYPE', `허용된 파일 타입: ${ALLOWED_EXTENSIONS.join(', ')}`, 400);
  }

  // Role-based bucket access
  if (bucket === 'lesson-materials' || bucket === 'assignment-files') {
    if (auth.role !== 'professor' && auth.role !== 'admin') {
      return fail('FORBIDDEN', '교수/관리자만 업로드할 수 있습니다.', 403);
    }
  }

  // Path: userId/timestamp-filename (folder scoping for RLS)
  const timestamp = Date.now();
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${auth.userId}/${timestamp}-${safeName}`;

  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return fail('STORAGE_ERROR', error?.message ?? '업로드 URL 생성 실패', 500);
  }

  return ok({
    uploadUrl: data.signedUrl,
    token: data.token,
    path: data.path,
    bucket,
  });
}
