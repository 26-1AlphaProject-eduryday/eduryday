import { AdminUsersPage } from '@/_pages/admin-users/ui/AdminUsersPage';
import { demoAdminUsers, isVideoDemoMode } from '@/entities/demo-video';

export default function AdminUsersRoute() {
  if (isVideoDemoMode()) {
    return <AdminUsersPage initialData={demoAdminUsers} />;
  }

  return <AdminUsersPage />;
}
