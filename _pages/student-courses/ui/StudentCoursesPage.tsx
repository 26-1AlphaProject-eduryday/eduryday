import Link from 'next/link';
import { StudentHeader } from '@/widgets/header';
import { StudentSidebar } from '@/widgets/sidebar';
import { ProgressBar, Badge } from '@/shared/ui';

interface StudentCourseItem {
  id: string;
  title: string;
  professor: string;
  progress: number;
}

const COURSE_CATEGORIES: Record<string, { label: string; variant: 'blue' | 'green' | 'purple' | 'yellow' }> = {
  '1': { label: '알고리즘', variant: 'blue' },
  '2': { label: '자료구조', variant: 'purple' },
  '3': { label: '웹개발', variant: 'green' },
  'algorithms-bfs': { label: '알고리즘', variant: 'blue' },
  'data-structures': { label: '자료구조', variant: 'purple' },
  'web-programming': { label: '웹개발', variant: 'green' },
};

const COURSE_VISUALS = [
  {
    accent: 'from-blue-600 to-cyan-500',
    eyebrow: 'Graph Search',
    marks: ['BFS', 'DFS', 'Shortest Path'],
  },
  {
    accent: 'from-violet-600 to-fuchsia-500',
    eyebrow: 'Data Structure',
    marks: ['Stack', 'Queue', 'Tree'],
  },
  {
    accent: 'from-emerald-600 to-teal-500',
    eyebrow: 'Frontend',
    marks: ['React', 'State', 'API'],
  },
];

function getCategoryColor(progress: number): 'blue' | 'green' | 'gray' {
  if (progress >= 70) return 'green';
  if (progress >= 30) return 'blue';
  return 'gray';
}

function CourseVisual({ index, title }: { index: number; title: string }) {
  const visual = COURSE_VISUALS[index % COURSE_VISUALS.length];

  return (
    <div
      className={`relative h-36 overflow-hidden border-b border-white/10 bg-gradient-to-br ${visual.accent}`}
      aria-hidden="true"
    >
      <div className="absolute left-5 top-5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
        {visual.eyebrow}
      </div>
      <div className="absolute bottom-5 left-5 right-5">
        <p className="text-xl font-bold text-white">{title}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {visual.marks.map((mark) => (
            <span
              key={mark}
              className="rounded-md bg-white/18 px-2 py-1 text-[11px] font-medium text-white"
            >
              {mark}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15" />
      <div className="absolute bottom-7 right-7 h-14 w-14 rounded-xl border border-white/25 bg-white/10" />
    </div>
  );
}

export async function StudentCoursesPage({ courses }: { courses: StudentCourseItem[] }) {

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <StudentHeader />

      <div className="flex flex-1">
        <StudentSidebar />

        <main className="flex-1 p-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">내 강좌</h1>
            <p className="mt-1 text-sm text-gray-500">
              현재 수강 중인 강좌 목록입니다.
            </p>
          </div>

          {/* Summary bar */}
          <div className="mb-6 flex items-center gap-6 rounded-xl border border-gray-200 bg-white px-6 py-4">
            <div>
              <span className="text-sm text-gray-500">전체 강좌</span>
              <span className="ml-2 text-lg font-bold text-gray-700">{courses.length}개</span>
            </div>
            <div className="h-5 w-px bg-gray-200" aria-hidden="true" />
            <div>
              <span className="text-sm text-gray-500">완료 강좌</span>
              <span className="ml-2 text-lg font-bold text-green-600">
                {courses.filter((c) => c.progress === 100).length}개
              </span>
            </div>
            <div className="h-5 w-px bg-gray-200" aria-hidden="true" />
            <div>
              <span className="text-sm text-gray-500">진행 중</span>
              <span className="ml-2 text-lg font-bold text-blue-600">
                {courses.filter((c) => c.progress > 0 && c.progress < 100).length}개
              </span>
            </div>
          </div>

          {/* Course grid */}
          <section aria-label="강좌 목록">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => {
                const category = COURSE_CATEGORIES[course.id];
                const barColor = getCategoryColor(course.progress);

                return (
                  <Link
                    key={course.id}
                    href={`/student/courses/${course.id}`}
                    className="block overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
                    aria-label={`${course.title} 강좌 상세 보기`}
                  >
                    <CourseVisual index={index} title={course.title} />

                    <div className="p-5">
                      {/* Category badge */}
                      {category && (
                        <Badge variant={category.variant} size="sm" className="mb-2">
                          {category.label}
                        </Badge>
                      )}

                      {/* Title & professor */}
                      <h2 className="font-bold text-gray-800">{course.title}</h2>
                      <p className="mt-0.5 text-sm text-gray-500">{course.professor}</p>

                      {/* Progress */}
                      <div className="mt-4">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-xs text-gray-500">진행률</span>
                          <span className="text-xs font-semibold text-gray-700">
                            {course.progress}%
                          </span>
                        </div>
                        <ProgressBar value={course.progress} color={barColor} />
                      </div>

                      {/* Status label */}
                      <p className="mt-3 text-xs text-gray-500">
                        {course.progress === 100
                          ? '강좌 완료'
                          : course.progress === 0
                          ? '학습 시작 전'
                          : `${course.progress}% 완료`}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
