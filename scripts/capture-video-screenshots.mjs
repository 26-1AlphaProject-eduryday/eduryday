import { chromium } from 'playwright-core';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.VIDEO_CAPTURE_BASE_URL ?? 'http://127.0.0.1:3000';
const outputDir = process.env.VIDEO_CAPTURE_OUTPUT_DIR ?? 'public/video-screenshots';
const chromeExecutablePath =
  process.env.CHROME_EXECUTABLE_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const shots = [
  { file: '01-landing.png', path: '/', label: '랜딩' },
  { file: '02-student-dashboard.png', path: '/student/dashboard', label: '학생 대시보드' },
  { file: '03-student-courses.png', path: '/student/courses', label: '학생 강좌 목록' },
  { file: '04-course-detail.png', path: '/student/courses/algorithms-bfs', label: '강의 상세' },
  { file: '05-split-ide.png', path: '/student/ide/assignment-bfs', label: 'Split View IDE', waitFor: '.monaco-editor' },
  { file: '06-ai-tutor.png', path: '/student/ai-tutor', label: 'AI 튜터' },
  { file: '07-student-assignments.png', path: '/student/assignments', label: '학생 과제' },
  { file: '08-student-grades.png', path: '/student/grades', label: '학생 성적' },
  { file: '09-professor-dashboard.png', path: '/professor/dashboard', label: '교수자 대시보드' },
  {
    file: '10-professor-submission-summary.png',
    path: '/professor/dashboard',
    label: '교수자 제출 현황 요약',
    scrollY: 560,
  },
  { file: '10-professor-courses.png', path: '/professor/courses', label: '교수자 강좌' },
  {
    file: '11-assignment-create.png',
    path: '/professor/courses/algorithms-bfs/assignments/create',
    label: '과제 생성 상단',
  },
  {
    file: '12-assignment-rubric.png',
    path: '/professor/courses/algorithms-bfs/assignments/create',
    label: '루브릭/테스트 케이스',
    scrollY: 560,
  },
  { file: '13-grading-status.png', path: '/professor/courses/algorithms-bfs/grading', label: '채점 현황' },
  { file: '14-professor-analytics.png', path: '/professor/analytics', label: '학습 분석' },
  { file: '15-professor-grades.png', path: '/professor/grades', label: '성적 관리' },
  { file: '16-admin-dashboard.png', path: '/admin/dashboard', label: '관리자 대시보드' },
  {
    file: '17-admin-activity.png',
    path: '/admin/dashboard',
    label: '관리자 일별 활동',
    scrollY: 560,
  },
  { file: '17-admin-users.png', path: '/admin/users', label: '사용자 관리' },
  { file: '18-admin-logs.png', path: '/admin/logs', label: '로그 모니터링' },
];

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl, { redirect: 'manual' });
      if (response.status < 500) {
        return;
      }
    } catch {
      // Server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Timed out waiting for ${baseUrl}`);
}

async function main() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await waitForServer();

  const browser = await chromium.launch({
    executablePath: chromeExecutablePath,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 1,
    locale: 'ko-KR',
  });

  await context.addInitScript(() => {
    window.localStorage.setItem(
      'ide-code-assignment-bfs',
      [
        'from collections import deque',
        '',
        'def bfs(graph, start):',
        '    visited = set([start])',
        '    order = []',
        '    queue = deque([start])',
        '',
        '    while queue:',
        '        node = queue.popleft()',
        '        order.append(node)',
        '        for next_node in graph.get(node, []):',
        '            if next_node not in visited:',
        '                visited.add(next_node)',
        '                queue.append(next_node)',
        '',
        '    return order',
      ].join('\n'),
    );
  });

  const page = await context.newPage();

  for (const shot of shots) {
    const url = `${baseUrl}${shot.path}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});

    if (shot.waitFor) {
      await page.waitForSelector(shot.waitFor, { timeout: 15_000 }).catch(() => {});
    }

    if (shot.scrollY) {
      await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: 'instant' }), shot.scrollY);
      await page.waitForTimeout(500);
    } else {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(500);
    }

    const destination = path.join(outputDir, shot.file);
    await page.screenshot({ path: destination, fullPage: false });
    console.log(`captured ${shot.file} - ${shot.label}`);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
