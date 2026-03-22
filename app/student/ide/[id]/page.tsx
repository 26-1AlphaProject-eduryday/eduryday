import { SplitViewIdePage } from '@/_pages/split-view-ide/ui/SplitViewIdePage';
import { getRouteAuthContext } from '@/shared/lib/supabase/route';

export default async function IdeRoute() {
  const auth = await getRouteAuthContext();
  const studentName = auth?.email ?? '학생';

  return (
    <SplitViewIdePage
      student={{ id: auth?.userId ?? '', name: studentName, email: auth?.email ?? '' }}
      testResults={[]}
    />
  );
}
