import { notFound } from 'next/navigation';

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

export default async function AlphaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!allowed.has(slug)) return notFound();

  return (
    <main style={{ width: '100vw', height: '100vh', background: '#f3f4f6' }}>
      <iframe
        src={`/mockups/${slug}.html`}
        title={slug}
        style={{ width: '100%', height: '100%', border: 0 }}
      />
    </main>
  );
}
