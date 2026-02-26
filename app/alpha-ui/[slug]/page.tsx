import { notFound } from 'next/navigation';
import { alphaPages } from '@/components/alpha-pages/pages';
import { Shell } from '@/components/ui/layout';

type Slug = keyof typeof alphaPages;

export default async function AlphaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = alphaPages[slug as Slug];
  if (!page) return notFound();
  return <Shell>{page}</Shell>;
}
