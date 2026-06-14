import { GradingStatusPage } from '@/_pages/grading-status/ui/GradingStatusPage';
import { demoGradingRows, isVideoDemoMode } from '@/entities/demo-video';

export default async function GradingRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (isVideoDemoMode()) {
    return <GradingStatusPage courseId={id} initialRows={demoGradingRows} />;
  }

  return <GradingStatusPage courseId={id} />;
}
