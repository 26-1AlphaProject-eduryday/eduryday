import { redirect } from 'next/navigation';
import { SplitViewIdePage } from '@/_pages/split-view-ide';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export default async function StudentIdeRoute({ params }: { params: Promise<{ id: string }> }) {
  const auth = await getRouteAuthContext();
  if (!auth || auth.role !== 'student') redirect('/login');

  const { id } = await params;
  const client = getServiceRoleClient();

  let assignment = { id, title: '과제', description: '', language: 'python' };

  if (client) {
    const { data } = await client
      .from('assignments')
      .select('id, title, description, type')
      .eq('id', id)
      .maybeSingle();

    if (data) {
      assignment = {
        id: data.id,
        title: data.title,
        description: data.description ?? '',
        language: data.type === 'coding' ? 'python' : 'python',
      };
    }
  }

  return <SplitViewIdePage assignment={assignment} studentName={auth.email.split('@')[0]} />;
}
