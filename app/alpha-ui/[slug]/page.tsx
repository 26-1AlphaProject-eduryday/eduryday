import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const allowed = new Set([
  '01-landing',
  '02-login',
  '03-student-dashboard',
  '04-course-detail',
  '05-split-view-ide',
  '06-ai-tutor',
  '07-professor-dashboard',
  '08-create-assignment',
  '09-grading-status',
  '10-admin-dashboard',
]);

function extractBody(html: string) {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return match ? match[1] : html;
}

export default async function AlphaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!allowed.has(slug)) return notFound();

  const filePath = path.join(process.cwd(), 'public', 'mockups', `${slug}.html`);
  const html = await readFile(filePath, 'utf-8');
  const bodyHtml = extractBody(html);

  return <main dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
