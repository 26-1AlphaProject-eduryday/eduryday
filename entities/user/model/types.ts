export interface Student {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Professor {
  id: string;
  name: string;       // 예: "이현기"
  title: string;      // 예: "교수님"
  email: string;
  avatarUrl?: string;
}

export type UserRole = 'student' | 'professor' | 'admin';
