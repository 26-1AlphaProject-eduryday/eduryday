export type AppRole = 'student' | 'professor' | 'admin';
export type ProfileStatus = 'pending' | 'active' | 'suspended';

export interface ProfileRecord {
  id: string;
  email: string;
  name: string;
  role: AppRole | null;
  status: ProfileStatus;
  student_id?: string | null;
  department?: string | null;
}

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? 'eduryday@gmail.com').toLowerCase();

export function isAdminEmail(email: string | null | undefined) {
  return (email ?? '').toLowerCase() === ADMIN_EMAIL;
}

export function getDashboardPath(role: AppRole) {
  if (role === 'admin') {
    return '/admin/dashboard';
  }

  if (role === 'professor') {
    return '/professor/dashboard';
  }

  return '/student/dashboard';
}

export function normalizeRole(role: string | null | undefined): AppRole | null {
  if (role === 'student' || role === 'professor' || role === 'admin') {
    return role;
  }

  return null;
}

export function normalizeStatus(status: string | null | undefined): ProfileStatus {
  if (status === 'active' || status === 'suspended') {
    return status;
  }

  return 'pending';
}
