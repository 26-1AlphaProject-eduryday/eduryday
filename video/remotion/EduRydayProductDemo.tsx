import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const PRODUCT_VIDEO_WIDTH = 1920;
export const PRODUCT_VIDEO_HEIGHT = 1080;
export const PRODUCT_VIDEO_FPS = 24;

type Role = '서비스' | '학생' | '교수자' | '관리자';

type Scene = {
  accent: string;
  end: number;
  image: string;
  note: string;
  role: Role;
  start: number;
  subtitle: string;
  title: string;
};

const scenes: Scene[] = [
  {
    start: 0,
    end: 8,
    image: 'video-screenshots/01-landing.png',
    role: '서비스',
    title: 'EduRyday 실제 서비스 시연',
    subtitle: '현재 앱 화면으로 학생, 교수자, 관리자 흐름을 연결합니다.',
    note: '랜딩에서 핵심 화면 진입까지',
    accent: '#2563eb',
  },
  {
    start: 8,
    end: 20,
    image: 'video-screenshots/02-student-dashboard.png',
    role: '학생',
    title: '오늘의 학습 현황',
    subtitle: '수강 강좌, 제출 대기, 평균 진도, 다가오는 마감을 한 화면에서 확인합니다.',
    note: '대시보드',
    accent: '#2563eb',
  },
  {
    start: 20,
    end: 31,
    image: 'video-screenshots/03-student-courses.png',
    role: '학생',
    title: '수강 강좌 탐색',
    subtitle: '강좌별 진행률과 담당 교수를 확인하고 상세 페이지로 이동합니다.',
    note: '내 강좌',
    accent: '#0891b2',
  },
  {
    start: 31,
    end: 43,
    image: 'video-screenshots/04-course-detail.png',
    role: '학생',
    title: '주차별 강의와 실습',
    subtitle: '완료한 주차, 진행 중인 실습, 자료와 활성 과제를 하나의 학습 흐름으로 봅니다.',
    note: '강의 상세',
    accent: '#0f766e',
  },
  {
    start: 43,
    end: 59,
    image: 'video-screenshots/05-split-ide.png',
    role: '학생',
    title: 'Split View IDE',
    subtitle: '문제 설명을 보면서 코드 작성, 실행, 저장, 제출까지 한 화면에서 처리합니다.',
    note: '코딩 실습',
    accent: '#16a34a',
  },
  {
    start: 59,
    end: 72,
    image: 'video-screenshots/06-ai-tutor.png',
    role: '학생',
    title: '강좌 맥락 기반 AI 튜터',
    subtitle: '정답 대신 현재 과제 맥락에 맞춘 힌트와 복잡도 설명을 제공합니다.',
    note: 'AI 튜터',
    accent: '#7c3aed',
  },
  {
    start: 72,
    end: 83,
    image: 'video-screenshots/07-student-assignments.png',
    role: '학생',
    title: '과제 제출 상태',
    subtitle: '제출 대기, 제출 완료, 채점 완료 상태와 점수를 표에서 바로 확인합니다.',
    note: '과제',
    accent: '#ca8a04',
  },
  {
    start: 83,
    end: 94,
    image: 'video-screenshots/08-student-grades.png',
    role: '학생',
    title: '성적과 피드백',
    subtitle: '과제별 점수와 피드백을 통해 다음 학습 행동을 이어갑니다.',
    note: '성적',
    accent: '#15803d',
  },
  {
    start: 94,
    end: 107,
    image: 'video-screenshots/09-professor-dashboard.png',
    role: '교수자',
    title: '강좌 운영 대시보드',
    subtitle: '운영 중인 강좌, 수강생 수, 검토 중 제출, 최근 활동을 한 번에 파악합니다.',
    note: '교수자 대시보드',
    accent: '#1d4ed8',
  },
  {
    start: 107,
    end: 117,
    image: 'video-screenshots/10-professor-submission-summary.png',
    role: '교수자',
    title: '제출 현황 요약',
    subtitle: '강좌별 제출, 채점 완료, 검토 대기를 비교해 우선순위를 정합니다.',
    note: '제출/채점 요약',
    accent: '#f59e0b',
  },
  {
    start: 117,
    end: 128,
    image: 'video-screenshots/10-professor-courses.png',
    role: '교수자',
    title: '강좌 관리',
    subtitle: '강좌 진행률을 보며 강좌 관리, 과제 출제, 채점 화면으로 이동합니다.',
    note: '내 강좌',
    accent: '#0d9488',
  },
  {
    start: 128,
    end: 140,
    image: 'video-screenshots/11-assignment-create.png',
    role: '교수자',
    title: '과제 정보 작성',
    subtitle: '강좌, 유형, 제목, 마감, 문제 설명을 입력해 과제를 구성합니다.',
    note: '과제 생성',
    accent: '#334155',
  },
  {
    start: 140,
    end: 153,
    image: 'video-screenshots/12-assignment-rubric.png',
    role: '교수자',
    title: 'No-Code 루브릭과 테스트 케이스',
    subtitle: '채점 기준과 가중치, 테스트 입력/기대 출력을 화면에서 직접 관리합니다.',
    note: '루브릭 엔진',
    accent: '#9333ea',
  },
  {
    start: 153,
    end: 166,
    image: 'video-screenshots/13-grading-status.png',
    role: '교수자',
    title: '자동 채점과 최종 확정',
    subtitle: '테스트 통과, AI 분석, 최종 점수, 피드백을 한 표에서 확정합니다.',
    note: '채점 현황',
    accent: '#dc2626',
  },
  {
    start: 166,
    end: 178,
    image: 'video-screenshots/14-professor-analytics.png',
    role: '교수자',
    title: '학습 분석',
    subtitle: '오개념, 참여율, 질문 패턴을 기반으로 다음 수업 운영을 조정합니다.',
    note: '학습 분석',
    accent: '#4f46e5',
  },
  {
    start: 178,
    end: 189,
    image: 'video-screenshots/15-professor-grades.png',
    role: '교수자',
    title: '성적 관리',
    subtitle: '강좌별 과제 성적과 제출 상태를 필터링하며 관리합니다.',
    note: '성적',
    accent: '#0284c7',
  },
  {
    start: 189,
    end: 202,
    image: 'video-screenshots/16-admin-dashboard.png',
    role: '관리자',
    title: '시스템 운영 대시보드',
    subtitle: '사용자, 승인 대기, 활성 강좌, 최근 로그와 리소스를 모니터링합니다.',
    note: '관리자 대시보드',
    accent: '#ef4444',
  },
  {
    start: 202,
    end: 212,
    image: 'video-screenshots/17-admin-activity.png',
    role: '관리자',
    title: '일별 활동 모니터링',
    subtitle: '로그인, 과제 제출, AI 질문 추이를 확인해 서비스 사용 흐름을 점검합니다.',
    note: '활동 차트',
    accent: '#7c2d12',
  },
  {
    start: 212,
    end: 224,
    image: 'video-screenshots/17-admin-users.png',
    role: '관리자',
    title: '사용자 권한 관리',
    subtitle: '학생, 교수자, 관리자 계정의 상태와 승인/정지 액션을 관리합니다.',
    note: '사용자 관리',
    accent: '#be123c',
  },
  {
    start: 224,
    end: 236,
    image: 'video-screenshots/18-admin-logs.png',
    role: '관리자',
    title: '로그와 감사 추적',
    subtitle: '과제 게시, AI 질문, 제출, 자동 채점 이벤트를 시간순으로 확인합니다.',
    note: '로그/모니터링',
    accent: '#475569',
  },
  {
    start: 236,
    end: 244,
    image: 'video-screenshots/02-student-dashboard.png',
    role: '서비스',
    title: '학습에서 운영까지 하나의 흐름',
    subtitle: '학생 학습, AI 지원, 교수자 평가, 관리자 운영이 실제 앱 화면으로 연결됩니다.',
    note: '시연 마무리',
    accent: '#2563eb',
  },
];

export const PRODUCT_VIDEO_DURATION_SECONDS = scenes[scenes.length - 1].end;

const baseText: React.CSSProperties = {
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  letterSpacing: 0,
  wordBreak: 'keep-all',
};

function getScene(second: number) {
  return scenes.find((scene) => second >= scene.start && second < scene.end) ?? scenes[scenes.length - 1];
}

function sceneProgress(scene: Scene, second: number) {
  return Math.max(0, Math.min(1, (second - scene.start) / (scene.end - scene.start)));
}

function formatTime(second: number) {
  const whole = Math.max(0, Math.floor(second));
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
}

function LowerThird({ scene, progress }: { scene: Scene; progress: number }) {
  const opacity = Math.min(
    interpolate(progress, [0, 0.12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    interpolate(progress, [0.84, 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  const translateY = interpolate(progress, [0, 0.12], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        ...baseText,
        position: 'absolute',
        left: 56,
        bottom: 52,
        width: 780,
        borderRadius: 18,
        background: 'rgba(15, 23, 42, 0.82)',
        boxShadow: '0 22px 70px rgba(15, 23, 42, 0.28)',
        color: 'white',
        opacity,
        padding: '26px 30px',
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ alignItems: 'center', display: 'flex', gap: 12, marginBottom: 12 }}>
        <span
          style={{
            background: scene.accent,
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 800,
            padding: '7px 14px',
          }}
        >
          {scene.role}
        </span>
        <span style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: 22, fontWeight: 700 }}>
          {scene.note}
        </span>
      </div>
      <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.12 }}>{scene.title}</div>
      <div style={{ color: 'rgba(255, 255, 255, 0.82)', fontSize: 26, lineHeight: 1.38, marginTop: 10 }}>
        {scene.subtitle}
      </div>
    </div>
  );
}

function Timeline({ second }: { second: number }) {
  const progress = second / PRODUCT_VIDEO_DURATION_SECONDS;

  return (
    <div
      style={{
        ...baseText,
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.92)',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        borderRadius: 999,
        boxShadow: '0 16px 50px rgba(15, 23, 42, 0.14)',
        display: 'flex',
        gap: 16,
        padding: '10px 18px',
        position: 'absolute',
        right: 46,
        top: 38,
        width: 420,
      }}
    >
      <span style={{ color: '#334155', fontSize: 22, fontWeight: 800 }}>{formatTime(second)}</span>
      <div style={{ background: '#e2e8f0', borderRadius: 999, flex: 1, height: 8, overflow: 'hidden' }}>
        <div
          style={{
            background: '#0f172a',
            borderRadius: 999,
            height: '100%',
            width: `${Math.min(100, Math.max(0, progress * 100))}%`,
          }}
        />
      </div>
    </div>
  );
}

export function EduRydayProductDemo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const second = frame / fps;
  const scene = getScene(second);
  const progress = sceneProgress(scene, second);
  const zoom = interpolate(progress, [0, 1], [1.006, 1.035], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ background: '#0f172a' }}>
      <Img
        src={staticFile(scene.image)}
        style={{
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${zoom})`,
          width: '100%',
        }}
      />
      <div
        style={{
          background:
            'linear-gradient(180deg, rgba(15, 23, 42, 0.10) 0%, rgba(15, 23, 42, 0.02) 40%, rgba(15, 23, 42, 0.32) 100%)',
          inset: 0,
          position: 'absolute',
        }}
      />
      <LowerThird scene={scene} progress={progress} />
      <Timeline second={second} />
    </AbsoluteFill>
  );
}
