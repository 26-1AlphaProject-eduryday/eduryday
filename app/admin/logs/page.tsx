import { AdminLogsPage } from '@/_pages/admin-logs/ui/AdminLogsPage';
import { demoAdminLogs, isVideoDemoMode } from '@/entities/demo-video';

export default function AdminLogsRoute() {
  if (isVideoDemoMode()) {
    return <AdminLogsPage initialData={demoAdminLogs} />;
  }

  return <AdminLogsPage />;
}
