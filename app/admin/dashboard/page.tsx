import { AdminDashboardPage } from '@/_pages/admin-dashboard/ui/AdminDashboardPage';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

interface ProfileCountRow {
  role: 'student' | 'professor' | 'admin' | null;
  status: 'pending' | 'active' | 'suspended';
}

interface CourseCountRow {
  id: string;
  status: 'active' | 'closed' | 'draft' | 'pending';
}

interface LogRow {
  type: 'login' | 'submit' | 'ai' | 'course' | 'error' | 'grading' | 'access';
  user_name: string;
  user_role: string | null;
  message: string;
  ip: string | null;
  created_at: string;
}

export default async function AdminDashboardRoute() {
  const auth = await getRouteAuthContext();
  const client = getServiceRoleClient();

  if (!auth || !client || auth.role !== 'admin') {
    return <AdminDashboardPage stats={[]} userDistribution={[]} serverResources={[]} alerts={[]} activityLogs={[]} />;
  }

  const [{ data: profiles }, { data: courses }, { data: logs }] = await Promise.all([
    client.from('profiles').select('role, status'),
    client.from('courses').select('id, status'),
    client.from('activity_logs').select('type, user_name, user_role, message, ip, created_at').order('created_at', { ascending: false }).limit(8),
  ]);

  const profileRows = (profiles ?? []) as ProfileCountRow[];
  const courseRows = (courses ?? []) as CourseCountRow[];
  const logRows = (logs ?? []) as LogRow[];

  const totalUsers = profileRows.length;
  const activeUsers = profileRows.filter((row) => row.status === 'active').length;
  const pendingUsers = profileRows.filter((row) => row.status === 'pending').length;
  const activeCourses = courseRows.filter((row) => row.status === 'active').length;

  const studentCount = profileRows.filter((row) => row.role === 'student').length;
  const professorCount = profileRows.filter((row) => row.role === 'professor').length;
  const adminCount = profileRows.filter((row) => row.role === 'admin').length;
  const safeTotal = Math.max(totalUsers, 1);

  const stats = [
    { label: '전체 사용자', value: `${totalUsers}`, trend: `${activeUsers}명 활성`, trendClassName: 'text-green-600' },
    { label: '승인 대기', value: `${pendingUsers}`, trend: null, trendClassName: '' },
    { label: '활성 강좌', value: `${activeCourses}`, trend: null, trendClassName: '' },
    { label: '최근 로그', value: `${logRows.length}건`, trend: null, trendClassName: '' },
    { label: '관리자 계정', value: `${adminCount}`, trend: null, trendClassName: '' },
  ];

  const userDistribution = [
    { role: '학생', count: `${studentCount}명`, percent: Math.round((studentCount / safeTotal) * 100), barClassName: 'bg-blue-500' },
    { role: '교수', count: `${professorCount}명`, percent: Math.round((professorCount / safeTotal) * 100), barClassName: 'bg-green-500' },
    { role: '관리자', count: `${adminCount}명`, percent: Math.round((adminCount / safeTotal) * 100), barClassName: 'bg-red-500' },
  ];

  const serverResources = [
    { label: '활성 사용자 비율', value: Math.round((activeUsers / safeTotal) * 100), barClassName: 'bg-green-500' },
    { label: '강좌 운영 비율', value: Math.min(100, activeCourses * 10), displayValue: `${activeCourses}개`, barClassName: 'bg-blue-500' },
    { label: '승인 대기 비율', value: Math.round((pendingUsers / safeTotal) * 100), barClassName: pendingUsers > 0 ? 'bg-yellow-400' : 'bg-green-500' },
  ];

  const alerts = pendingUsers > 0
    ? [{ icon: 'ℹ', bgClassName: 'bg-blue-50 border-blue-200', message: `승인 대기 사용자 ${pendingUsers}명`, time: '실시간' }]
    : [{ icon: '✓', bgClassName: 'bg-green-50 border-green-200', message: '승인 대기 사용자가 없습니다.', time: '실시간' }];

  const activityLogs = logRows.map((row) => ({
    time: row.created_at.replace('T', ' ').slice(11, 19),
    type: row.type === 'error' || row.type === 'grading' || row.type === 'access' ? 'login' : row.type,
    user: row.user_name,
    userRole: row.user_role ?? '-',
    content: row.message,
    ip: row.ip ?? '-',
  }));

  return <AdminDashboardPage stats={stats} userDistribution={userDistribution} serverResources={serverResources} alerts={alerts} activityLogs={activityLogs} />;
}
