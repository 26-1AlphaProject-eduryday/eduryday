import { redirect } from 'next/navigation';
import { ProfessorAnalyticsPage } from '@/_pages/professor-analytics';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export default async function ProfessorAnalyticsRoute() {
  const auth = await getRouteAuthContext();
  if (!auth || (auth.role !== 'professor' && auth.role !== 'admin')) {
    redirect('/login');
  }

  const client = getServiceRoleClient();
  if (!client) {
    return <ProfessorAnalyticsPage statCards={[]} topMisconceptions={[]} weeklyParticipation={[]} questionPatterns={[]} />;
  }

  // Get professor's courses
  const { data: courses } = await client
    .from('courses')
    .select('id, title')
    .eq('created_by', auth.userId);

  const courseIds = (courses ?? []).map((c: { id: string }) => c.id);

  if (courseIds.length === 0) {
    return <ProfessorAnalyticsPage statCards={[]} topMisconceptions={[]} weeklyParticipation={[]} questionPatterns={[]} />;
  }

  // Get assignments for those courses
  const { data: assignments } = await client
    .from('assignments')
    .select('id, title, course_id')
    .in('course_id', courseIds);

  const assignmentIds = (assignments ?? []).map((a: { id: string }) => a.id);

  // Get submissions for those assignments
  const { data: submissions } = await client
    .from('submissions')
    .select('id, final_score, status, submitted_at, assignment_id')
    .in('assignment_id', assignmentIds.length > 0 ? assignmentIds : ['none']);

  const subs = (submissions ?? []) as {
    id: string;
    final_score: number | null;
    status: string;
    submitted_at: string | null;
    assignment_id: string;
  }[];

  // Get enrollment count
  const { count: enrollmentCount } = await client
    .from('enrollments')
    .select('id', { count: 'exact', head: true })
    .in('course_id', courseIds);

  // Compute stat cards
  const scores = subs.filter((s) => s.final_score !== null).map((s) => s.final_score as number);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const submissionRate =
    subs.length > 0
      ? Math.round((subs.filter((s) => s.status !== 'unsubmitted').length / subs.length) * 100)
      : 0;

  const statCards = [
    { label: '평균 점수', value: `${avgScore}점`, trend: '전체 과제 기준', trendColor: 'green' as const },
    { label: '수강생 수', value: `${enrollmentCount ?? 0}명`, trend: '전체 강좌', trendColor: 'green' as const },
    { label: '과제 수', value: `${(assignments ?? []).length}개`, trend: '전체 강좌', trendColor: 'green' as const },
    {
      label: '제출률',
      value: `${submissionRate}%`,
      trend: '전체 과제 기준',
      trendColor: (submissionRate >= 80 ? 'green' : 'red') as 'green' | 'red',
    },
  ];

  // Top misconceptions: assignments with lowest avg scores
  const assignmentScores: Record<string, { title: string; scores: number[]; course: string }> = {};
  for (const sub of subs) {
    if (sub.final_score === null) continue;
    const asg = (assignments ?? []).find((a: { id: string }) => a.id === sub.assignment_id) as
      | { id: string; title: string; course_id: string }
      | undefined;
    if (!asg) continue;
    const courseName =
      ((courses ?? []).find((c: { id: string }) => c.id === asg.course_id) as { id: string; title: string } | undefined)?.title ?? '-';
    if (!assignmentScores[asg.id]) assignmentScores[asg.id] = { title: asg.title, scores: [], course: courseName };
    assignmentScores[asg.id].scores.push(sub.final_score as number);
  }

  const topMisconceptions = Object.values(assignmentScores)
    .map((a) => ({ ...a, avg: a.scores.reduce((x, y) => x + y, 0) / a.scores.length }))
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 5)
    .map((a, i) => ({
      rank: i + 1,
      concept: a.title,
      count: a.scores.length,
      course: a.course,
      severity: (a.avg < 60 ? 'high' : a.avg < 80 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
    }));

  // Weekly participation: group submissions by date
  const weeklyMap = new Map<string, { submitted: number; total: number }>();
  for (const sub of subs) {
    if (!sub.submitted_at) continue;
    const day = sub.submitted_at.slice(0, 10);
    const entry = weeklyMap.get(day) ?? { submitted: 0, total: 0 };
    entry.total++;
    if (sub.status !== 'unsubmitted') entry.submitted++;
    weeklyMap.set(day, entry);
  }

  const weeklyParticipation = Array.from(weeklyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-5)
    .map(([, data], i) => ({
      week: `${i + 1}주`,
      rate: data.total > 0 ? Math.round((data.submitted / data.total) * 100) : 0,
      questions: data.submitted,
    }));

  // Question patterns: group by submission status
  const statusCounts = { submitted: 0, reviewing: 0, complete: 0, unsubmitted: 0 };
  for (const sub of subs) {
    const s = sub.status as keyof typeof statusCounts;
    if (s in statusCounts) statusCounts[s]++;
  }
  const totalSubs = subs.length || 1;
  const questionPatterns = [
    {
      category: '채점 완료',
      count: statusCounts.complete,
      percentage: Math.round((statusCounts.complete / totalSubs) * 100),
      variant: 'default' as const,
    },
    {
      category: '검토 중',
      count: statusCounts.reviewing,
      percentage: Math.round((statusCounts.reviewing / totalSubs) * 100),
      variant: 'yellow' as const,
    },
    {
      category: '제출됨',
      count: statusCounts.submitted,
      percentage: Math.round((statusCounts.submitted / totalSubs) * 100),
      variant: 'blue' as const,
    },
    {
      category: '미제출',
      count: statusCounts.unsubmitted,
      percentage: Math.round((statusCounts.unsubmitted / totalSubs) * 100),
      variant: 'red' as const,
    },
  ].filter((p) => p.count > 0);

  return (
    <ProfessorAnalyticsPage
      statCards={statCards}
      topMisconceptions={topMisconceptions}
      weeklyParticipation={weeklyParticipation}
      questionPatterns={questionPatterns}
    />
  );
}
