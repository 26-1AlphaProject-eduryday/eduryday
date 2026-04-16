export type LessonType = 'lecture' | 'practice' | 'quiz';
export type WeekStatus = 'done' | 'in-progress' | 'locked';

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  completed: boolean;
  active?: boolean;
}

export interface Week {
  id: string;
  number: number;
  title: string;
  status: WeekStatus;
  lessons?: Lesson[];
}

export interface CourseResource {
  id: string;
  title: string;
  completed: boolean;
  isPdf?: boolean;
  file_url?: string;
}

export interface StudentCourse {
  id: string;
  title: string;
  professor: string;
  progress: number;         // 0-100
}

export interface ProfessorCourse {
  id: string;
  title: string;
  semester: string;
  students: number;
  currentWeek: number;
  totalWeeks: number;
}

export interface Deadline {
  id: string;
  title: string;
  course: string;
  dday: string;
  ddayUrgent: boolean;
  date: string;
}
