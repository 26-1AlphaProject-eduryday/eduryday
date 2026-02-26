import { Shell } from '@/components/ui/layout';
import { alphaPages } from '@/components/alpha-pages/pages';

export default function AdminPage() {
  return <Shell>{alphaPages['10-admin-dashboard']}</Shell>;
}
