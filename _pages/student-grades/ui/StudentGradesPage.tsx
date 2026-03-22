import { StudentHeader } from '@/widgets/header';
import { StudentSidebar } from '@/widgets/sidebar';
import { StatCard, Badge } from '@/shared/ui';

export interface StudentGradeRecord {
  id: string;
  course: string;
  assignment: string;
  score: number;
  maxScore: number;
  feedback: string;
  submittedAt: string;
  status: 'graded' | 'pending';
}

function getScoreVariant(score: number, maxScore: number): 'green' | 'blue' | 'yellow' | 'red' {
  const pct = (score / maxScore) * 100;
  if (pct >= 90) return 'green';
  if (pct >= 70) return 'blue';
  if (pct >= 50) return 'yellow';
  return 'red';
}

export async function StudentGradesPage({ grades }: { grades: StudentGradeRecord[] }) {
  const graded = grades.filter((g) => g.status === 'graded');
  const scores = graded.map((g) => g.score);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <StudentHeader />

      <div className="flex flex-1">
        <StudentSidebar activeItem="성적" />

        <main className="flex-1 p-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-700">성적 확인</h1>
            <p className="mt-1 text-sm text-gray-500">
              강좌별 과제 점수와 AI 피드백을 확인하세요.
            </p>
          </div>

          {/* Stat cards */}
          <div className="mb-8 grid grid-cols-3 gap-6">
            <StatCard
              label="평균 점수"
              value={`${avgScore}점`}
              trend="전체 제출 평균"
              trendColor="green"
            />
            <StatCard
              label="최고 점수"
              value={`${maxScore}점`}
              trend="웹프로그래밍 실습 1"
              trendColor="green"
            />
            <StatCard
              label="제출 완료"
              value={`${graded.length}개`}
              trend={`미채점 ${grades.filter((g) => g.status === 'pending').length}개 대기중`}
              trendColor="red"
            />
          </div>

          {/* Grades table */}
          <section aria-label="성적 목록">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                    <th className="px-6 py-3">강좌명</th>
                    <th className="px-6 py-3">과제명</th>
                    <th className="px-6 py-3">점수</th>
                    <th className="px-6 py-3">AI 피드백</th>
                    <th className="px-6 py-3">제출일</th>
                    <th className="px-6 py-3">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {grades.map((record: StudentGradeRecord) => (
                    <tr
                      key={record.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {record.course}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {record.assignment}
                      </td>
                      <td className="px-6 py-4">
                        {record.status === 'graded' ? (
                          <span
                            className={`text-base font-bold ${
                              getScoreVariant(record.score, record.maxScore) === 'green'
                                ? 'text-green-600'
                                : getScoreVariant(record.score, record.maxScore) === 'blue'
                                ? 'text-blue-600'
                                : getScoreVariant(record.score, record.maxScore) === 'yellow'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {record.score}
                            <span className="ml-0.5 text-xs font-normal text-gray-500">
                              /{record.maxScore}
                            </span>
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="max-w-xs px-6 py-4">
                        {record.feedback ? (
                          <p className="truncate text-xs text-gray-500" title={record.feedback}>
                            {record.feedback}
                          </p>
                        ) : (
                          <span className="text-xs text-gray-300">채점 대기 중</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{record.submittedAt}</td>
                      <td className="px-6 py-4">
                        {record.status === 'graded' ? (
                          <Badge
                            variant={getScoreVariant(record.score, record.maxScore)}
                            size="sm"
                          >
                            채점완료
                          </Badge>
                        ) : (
                          <Badge variant="yellow" size="sm">
                            채점대기
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
