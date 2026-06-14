import { AiTutorPage } from '@/_pages/ai-tutor';
import { isVideoDemoMode } from '@/entities/demo-video';

export default function StudentAiTutorRoute() {
  if (isVideoDemoMode()) {
    return <AiTutorPage demoMode />;
  }

  return <AiTutorPage />;
}
