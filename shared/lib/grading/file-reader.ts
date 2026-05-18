import { getServiceRoleClient } from '@/shared/lib/supabase/route';

const TEXT_EXTENSIONS = ['txt', 'md', 'py', 'java', 'cpp', 'c', 'js', 'ts', 'tsx', 'jsx', 'css', 'html', 'json', 'xml', 'yaml', 'yml', 'sh', 'sql'];

function getExtension(path: string): string {
  const dot = path.lastIndexOf('.');
  return dot === -1 ? '' : path.slice(dot + 1).toLowerCase();
}

export async function readFileContent(
  bucket: string,
  filePath: string,
): Promise<{ content: string | null; error: string | null }> {
  const ext = getExtension(filePath);

  if (!TEXT_EXTENSIONS.includes(ext)) {
    return { content: null, error: `자동 채점 불가: .${ext} 파일은 지원되지 않습니다. 수동 채점이 필요합니다.` };
  }

  const client = getServiceRoleClient();
  if (!client) {
    return { content: null, error: 'Supabase 설정 오류' };
  }

  const { data, error } = await client.storage.from(bucket).download(filePath);
  if (error || !data) {
    return { content: null, error: error?.message ?? '파일 다운로드 실패' };
  }

  const text = await data.text();

  if (text.length > 50000) {
    return { content: text.slice(0, 10000), error: null };
  }

  return { content: text, error: null };
}
