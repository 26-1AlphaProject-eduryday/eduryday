import type { StudentCourse, ProfessorCourse, Week, CourseResource, Deadline } from './types';

export const MOCK_STUDENT_COURSES: StudentCourse[] = [
  { id: '1', title: '알고리즘 기초', professor: '이현기 교수님', progress: 65 },
  { id: '2', title: '자료구조', professor: '김철수 교수님', progress: 40 },
  { id: '3', title: '웹프로그래밍', professor: '박영희 교수님', progress: 80 },
];

export const MOCK_PROFESSOR_COURSES: ProfessorCourse[] = [
  { id: '1', title: '알고리즘 기초', semester: '2026-1학기 01분반', students: 45, currentWeek: 3, totalWeeks: 15 },
  { id: '2', title: '자료구조', semester: '2026-1학기 01분반', students: 52, currentWeek: 3, totalWeeks: 15 },
];

export const MOCK_COURSE_WEEKS: Week[] = [
  { id: 'w1', number: 1, title: '개요', status: 'done' },
  { id: 'w2', number: 2, title: '시간복잡도', status: 'done' },
  {
    id: 'w3', number: 3, title: '정렬', status: 'in-progress',
    lessons: [
      { id: 'l1', title: '강의 1: 버블정렬', type: 'lecture', completed: true },
      { id: 'l2', title: '강의 2: 선택정렬', type: 'lecture', completed: true },
      { id: 'l3', title: '실습 1: 정렬 구현', type: 'practice', completed: false, active: true },
      { id: 'l4', title: '퀴즈', type: 'quiz', completed: false },
    ],
  },
  { id: 'w4', number: 4, title: '탐색', status: 'locked' },
];

export const MOCK_COURSE_RESOURCES: CourseResource[] = [
  { id: 'r1', title: '강의 1: 버블정렬', completed: true },
  { id: 'r2', title: '강의 2: 선택정렬', completed: true },
  { id: 'r3', title: '정렬 알고리즘 개념 정리.pdf', completed: false, isPdf: true },
];

export const MOCK_DEADLINES: Deadline[] = [
  { id: '1', title: '실습 3: 정렬 알고리즘', course: '알고리즘 기초', dday: 'D-2', ddayUrgent: true, date: '1월 23일 23:59' },
  { id: '2', title: '과제 2: 스택과 큐 구현', course: '자료구조', dday: 'D-5', ddayUrgent: false, date: '1월 26일 23:59' },
];
