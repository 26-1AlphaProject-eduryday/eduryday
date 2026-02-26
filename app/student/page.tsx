import { Shell } from '@/components/ui/layout';
import { alphaPages } from '@/components/alpha-pages/pages';

export default function StudentPage() {
  return <Shell>{alphaPages['03-student-dashboard']}</Shell>;
}
