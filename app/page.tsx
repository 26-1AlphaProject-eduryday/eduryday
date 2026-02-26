import Link from 'next/link';

const pages = [
  ['01-landing', '랜딩'],
  ['02-login', '로그인'],
  ['03-student-dashboard', '학생 대시보드'],
  ['04-course-detail', '강좌 상세'],
  ['05-split-view-ide', 'Split-View IDE'],
  ['06-ai-tutor', 'AI 튜터'],
  ['07-professor-dashboard', '교수 대시보드'],
  ['08-create-assignment', '과제 생성'],
  ['09-grading-status', '채점 현황'],
  ['10-admin-dashboard', '관리자 대시보드'],
] as const;

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>EduRyday Mockup Pages</h1>
      <p>PDF/목업 디자인 1:1 기준 구현 라우트</p>
      <ul>
        {pages.map(([slug, label]) => (
          <li key={slug} style={{ marginBottom: 8 }}>
            <Link href={`/alpha-ui/${slug}`}>{label} ({slug})</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
