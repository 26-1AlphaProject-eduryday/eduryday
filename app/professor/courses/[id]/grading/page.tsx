import { GradingStatusPage } from '@/_pages/grading-status/ui/GradingStatusPage';

export default async function GradingRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GradingStatusPage courseId={id} />;
}
