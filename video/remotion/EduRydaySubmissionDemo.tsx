import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const SUBMISSION_VIDEO_WIDTH = 1920;
export const SUBMISSION_VIDEO_HEIGHT = 1080;
export const SUBMISSION_VIDEO_FPS = 24;
export const SUBMISSION_VIDEO_DURATION_SECONDS = 210;

type Role = 'intro' | 'student' | 'professor' | 'admin';

type SceneKey =
  | 'opening'
  | 'landing'
  | 'auth'
  | 'student-dashboard'
  | 'course'
  | 'ide'
  | 'ai-tutor'
  | 'feedback'
  | 'professor'
  | 'admin'
  | 'closing';

type Scene = {
  end: number;
  key: SceneKey;
  lower: string;
  role: Role;
  start: number;
  subtitle: string;
  title: string;
};

const scenes: Scene[] = [
  {
    start: 0,
    end: 10,
    key: 'opening',
    role: 'intro',
    title: 'EduRyday',
    subtitle: 'AI 기반 학습관리시스템 최종 시연',
    lower: '학생, 교수자, 관리자 플로우를 하나의 수업 운영 시나리오로 보여줍니다.',
  },
  {
    start: 10,
    end: 25,
    key: 'landing',
    role: 'intro',
    title: '서비스 진입',
    subtitle: '랜딩 화면에서 실제 학습 대시보드와 IDE 경험을 바로 확인합니다.',
    lower: '첫 화면부터 실제 학습 현황과 핵심 기능을 보여줍니다.',
  },
  {
    start: 25,
    end: 39,
    key: 'auth',
    role: 'intro',
    title: '인증과 역할 분기',
    subtitle: '로그인 후 Supabase 프로필의 역할에 따라 학생, 교수자, 관리자 홈으로 이동합니다.',
    lower: '권한 기반 라우팅 흐름을 간결하게 보여줍니다.',
  },
  {
    start: 39,
    end: 63,
    key: 'student-dashboard',
    role: 'student',
    title: '학생 대시보드',
    subtitle: '오늘 해야 할 학습과 과제, 진행률, 알림을 한 화면에서 확인합니다.',
    lower: '학생은 남은 학습과 마감 과제를 확인하고 바로 다음 행동으로 이동합니다.',
  },
  {
    start: 63,
    end: 84,
    key: 'course',
    role: 'student',
    title: '강의 상세',
    subtitle: '주차별 강의, 실습 상태, 공지, 다음 행동이 연결되어 있습니다.',
    lower: '학생은 강의 상세에서 바로 실습 IDE로 이동합니다.',
  },
  {
    start: 84,
    end: 114,
    key: 'ide',
    role: 'student',
    title: 'Split View IDE',
    subtitle: '문제 설명과 코드 작성, 테스트 실행, 제출까지 한 화면에서 처리합니다.',
    lower: 'BFS 실습을 실행하고 테스트 통과 후 제출합니다.',
  },
  {
    start: 114,
    end: 138,
    key: 'ai-tutor',
    role: 'student',
    title: 'AI 튜터',
    subtitle: '정답을 대신 알려주지 않고 강의 자료와 학생 코드 맥락에 맞춘 힌트를 제공합니다.',
    lower: 'AI 튜터는 강의 자료와 학생 코드 근거를 함께 제시합니다.',
  },
  {
    start: 138,
    end: 158,
    key: 'feedback',
    role: 'student',
    title: '제출 결과와 피드백',
    subtitle: '학생은 점수, 항목별 평가, 다음 개선 과제를 바로 확인합니다.',
    lower: '제출 이후 학습자가 다음 행동으로 이어질 수 있게 피드백을 제공합니다.',
  },
  {
    start: 158,
    end: 186,
    key: 'professor',
    role: 'professor',
    title: '교수자 운영',
    subtitle: '자연어 루브릭 생성, 제출물 채점, 위험 학생 확인을 한 흐름으로 처리합니다.',
    lower: 'No-Code Rubric Engine과 채점 대시보드를 실제 운영 화면처럼 보여줍니다.',
  },
  {
    start: 186,
    end: 202,
    key: 'admin',
    role: 'admin',
    title: '관리자 콘솔',
    subtitle: '사용자 권한, API 상태, 감사 로그를 통해 서비스를 운영합니다.',
    lower: '관리자는 역할과 로그를 확인하며 운영 안정성을 점검합니다.',
  },
  {
    start: 202,
    end: 210,
    key: 'closing',
    role: 'intro',
    title: '시연 완료',
    subtitle: '학습, 실습, AI 도움, 평가, 운영이 하나의 LMS 경험으로 연결됩니다.',
    lower: '핵심 가치를 정리하며 EduRyday 최종 시연을 마무리합니다.',
  },
];

const colors = {
  amber: '#d97706',
  amberBg: '#fef3c7',
  bg: '#edf3f8',
  blue: '#2563eb',
  blueBg: '#dbeafe',
  cyan: '#0891b2',
  green: '#14996f',
  greenBg: '#dcfce7',
  ink: '#172033',
  line: '#dbe4ee',
  muted: '#64748b',
  navy: '#0f172a',
  panel: '#ffffff',
  red: '#dc2626',
  redBg: '#fee2e2',
  slate: '#334155',
};

const fontFamily =
  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const courses = [
  ['알고리즘 실습', '진도 72%', '그래프 탐색'],
  ['자료구조', '진도 84%', '채점 완료'],
  ['웹프로그래밍', '진도 61%', '프로젝트 진행'],
];

const weeks = [
  ['1주차', 'Python 기본 문법', '완료', '100%'],
  ['2주차', '리스트와 딕셔너리', '완료', '100%'],
  ['3주차', '정렬 알고리즘', '완료', '88%'],
  ['4주차', '그래프 탐색 실습', '오늘', '진행'],
];

const logs = [
  ['09:02', 'student.submissions.create', '정상'],
  ['09:18', 'api.v1.code.run', '정상'],
  ['09:41', 'professor.submissions.grade', '정상'],
  ['10:05', 'admin.users.role.update', '주의'],
];

const navByRole: Record<Role, string[]> = {
  intro: ['서비스 소개', '로그인', '역할 분기'],
  student: ['대시보드', '내 강의', 'IDE', 'AI 튜터', '성적'],
  professor: ['대시보드', '강의 관리', '루브릭', '채점', '분석'],
  admin: ['사용자', '강의', '로그', '설정'],
};

const profileByRole: Record<Role, { avatar: string; name: string; sub: string }> = {
  intro: { avatar: 'E', name: 'EduRyday', sub: 'AI 기반 LMS' },
  student: { avatar: '김', name: '김민준', sub: '컴퓨터공학과 2학년' },
  professor: { avatar: '박', name: '박서연 교수', sub: '알고리즘 실습 담당' },
  admin: { avatar: 'AD', name: '관리자', sub: '서비스 운영 콘솔' },
};

const baseText: React.CSSProperties = {
  color: colors.ink,
  fontFamily,
  letterSpacing: 0,
  overflowWrap: 'normal',
  wordBreak: 'keep-all',
};

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const secondsFromFrame = (frame: number, fps: number) => frame / fps;

const activeScene = (seconds: number) =>
  scenes.find((scene) => seconds >= scene.start && seconds < scene.end) ?? scenes.at(-1)!;

const progressFor = (scene: Scene, seconds: number) =>
  clamp((seconds - scene.start) / (scene.end - scene.start));

const formatTime = (seconds: number) => {
  const whole = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
};

const fadeIn = (progress: number, start = 0, end = 0.18) =>
  interpolate(progress, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const slideUp = (progress: number) =>
  interpolate(progress, [0, 0.06], [22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const Tag = ({
  children,
  tone = 'blue',
}: {
  children: React.ReactNode;
  tone?: 'amber' | 'blue' | 'green' | 'red';
}) => {
  const theme = {
    amber: { background: colors.amberBg, color: '#92400e' },
    blue: { background: colors.blueBg, color: '#1d4ed8' },
    green: { background: colors.greenBg, color: '#047857' },
    red: { background: colors.redBg, color: '#b91c1c' },
  }[tone];

  return (
    <span
      style={{
        ...theme,
        alignItems: 'center',
        borderRadius: 999,
        display: 'inline-flex',
        fontSize: 15,
        fontWeight: 850,
        height: 32,
        justifyContent: 'center',
        padding: '0 13px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
};

const Panel = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: colors.panel,
      border: `1px solid ${colors.line}`,
      borderRadius: 8,
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

const Button = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      alignItems: 'center',
      background: colors.blue,
      borderRadius: 8,
      color: '#fff',
      display: 'inline-flex',
      fontSize: 19,
      fontWeight: 900,
      height: 50,
      justifyContent: 'center',
      padding: '0 22px',
      width: 'max-content',
    }}
  >
    {children}
  </div>
);

const StatCard = ({
  bar,
  label,
  tone = 'blue',
  value,
}: {
  bar?: number;
  label: string;
  tone?: 'amber' | 'blue' | 'green' | 'red';
  value: string;
}) => {
  const color = {
    amber: colors.amber,
    blue: colors.blue,
    green: colors.green,
    red: colors.red,
  }[tone];

  return (
    <Panel style={{ padding: 22 }}>
      <div style={{ color: colors.muted, fontSize: 17, fontWeight: 850 }}>{label}</div>
      <strong style={{ display: 'block', fontSize: 42, lineHeight: 1, marginTop: 12 }}>
        {value}
      </strong>
      {typeof bar === 'number' ? (
        <div
          style={{
            background: '#e2e8f0',
            borderRadius: 999,
            height: 11,
            marginTop: 22,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: color,
              borderRadius: 999,
              height: '100%',
              width: `${clamp(bar, 0, 100)}%`,
            }}
          />
        </div>
      ) : null}
    </Panel>
  );
};

const SectionTitle = ({
  action,
  children,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div
    style={{
      alignItems: 'center',
      borderBottom: `1px solid ${colors.line}`,
      display: 'flex',
      fontSize: 20,
      fontWeight: 900,
      height: 64,
      justifyContent: 'space-between',
      padding: '0 22px',
    }}
  >
    <span>{children}</span>
    {action}
  </div>
);

const Row = ({
  columns = '1fr 140px 150px',
  children,
}: {
  children: React.ReactNode;
  columns?: string;
}) => (
  <div
    style={{
      alignItems: 'center',
      borderBottom: `1px solid #eef2f7`,
      display: 'grid',
      gap: 16,
      gridTemplateColumns: columns,
      minHeight: 68,
      padding: '0 22px',
    }}
  >
    {children}
  </div>
);

const AppFrame = ({
  children,
  progress,
  scene,
}: {
  children: React.ReactNode;
  progress: number;
  scene: Scene;
}) => (
  <div
    style={{
      background: '#fff',
      border: `1px solid ${colors.line}`,
      borderRadius: 8,
      boxShadow: '0 24px 70px rgba(15, 23, 42, 0.12)',
      display: 'grid',
      gridTemplateRows: '146px minmax(0, 1fr)',
      height: '100%',
      minHeight: 0,
      opacity: fadeIn(progress, 0, 0.04),
      overflow: 'hidden',
      transform: `translateY(${slideUp(progress)}px)`,
      width: '100%',
    }}
  >
    <header
      style={{
        alignItems: 'center',
        borderBottom: `1px solid ${colors.line}`,
        display: 'flex',
        height: 146,
        justifyContent: 'space-between',
        padding: '0 32px',
      }}
    >
      <div>
        <h1 style={{ ...baseText, fontSize: 40, fontWeight: 950, lineHeight: 1.1, margin: 0 }}>
          {scene.title}
        </h1>
        <p style={{ color: colors.muted, fontSize: 20, lineHeight: 1.45, margin: '12px 0 0' }}>
          {scene.subtitle}
        </p>
      </div>
      <div style={{ alignItems: 'center', display: 'flex', gap: 10 }}>
        <Tag tone={scene.role === 'student' ? 'green' : scene.role === 'professor' ? 'amber' : 'blue'}>
          {scene.role === 'intro'
            ? '서비스 소개'
            : scene.role === 'student'
              ? 'Student'
              : scene.role === 'professor'
                ? 'Professor'
                : 'Admin'}
        </Tag>
        <Button>시연 화면</Button>
      </div>
    </header>
    <div style={{ boxSizing: 'border-box', height: '100%', minHeight: 0, overflow: 'hidden', padding: 28 }}>
      {children}
    </div>
  </div>
);

const Sidebar = ({
  frame,
  scene,
  seconds,
}: {
  frame: number;
  scene: Scene;
  seconds: number;
}) => {
  const { fps } = useVideoConfig();
  const profile = profileByRole[scene.role];
  const bounce = spring({
    config: { damping: 18, mass: 0.7 },
    fps,
    frame: frame % Math.round(fps * 2.4),
  });

  return (
    <aside
      style={{
        background: 'rgba(255,255,255,0.88)',
        border: `1px solid ${colors.line}`,
        borderRadius: 8,
        boxShadow: '0 18px 44px rgba(15, 23, 42, 0.08)',
        display: 'grid',
        gap: 22,
        gridTemplateRows: 'auto auto 1fr',
        height: '100%',
        minHeight: 0,
        padding: 24,
      }}
    >
      <div style={{ alignItems: 'center', display: 'grid', gap: 14, gridTemplateColumns: '58px 1fr' }}>
        <div
          style={{
            alignItems: 'center',
            background: scene.role === 'intro' ? `linear-gradient(135deg, ${colors.blue}, ${colors.green})` : colors.navy,
            borderRadius: 8,
            color: '#fff',
            display: 'flex',
            fontSize: profile.avatar.length > 1 ? 18 : 24,
            fontWeight: 950,
            height: 58,
            justifyContent: 'center',
            transform: `scale(${1 + bounce * 0.015})`,
            width: 58,
          }}
        >
          {profile.avatar}
        </div>
        <div>
          <strong style={{ display: 'block', fontSize: 22 }}>{profile.name}</strong>
          <span style={{ color: colors.muted, display: 'block', fontSize: 15, marginTop: 5 }}>
            {profile.sub}
          </span>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 9 }}>
        {navByRole[scene.role].map((item, index) => (
          <div
            key={item}
            style={{
              alignItems: 'center',
              background: index === 0 ? '#eaf1ff' : 'transparent',
              borderRadius: 8,
              color: index === 0 ? '#1d4ed8' : '#475569',
              display: 'flex',
              fontSize: 17,
              fontWeight: 850,
              height: 44,
              justifyContent: 'space-between',
              padding: '0 14px',
            }}
          >
            <span>{item}</span>
            <span>›</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 7, overflow: 'hidden' }}>
        {scenes.map((item) => {
          const active = seconds >= item.start && seconds < item.end;
          return (
            <div
              key={item.key}
              style={{
                alignItems: 'center',
                background: active ? '#eaf1ff' : 'transparent',
                borderRadius: 8,
                color: active ? '#1d4ed8' : '#475569',
                display: 'flex',
                fontSize: 14,
                fontWeight: 800,
                height: 34,
                justifyContent: 'space-between',
                padding: '0 12px',
              }}
            >
              <span>{item.title}</span>
              <span style={{ color: active ? '#1d4ed8' : '#94a3b8' }}>
                {formatTime(item.start)}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

const OpeningScene = ({ progress }: { progress: number }) => (
  <div style={{ display: 'grid', height: '100%', placeItems: 'center', textAlign: 'center' }}>
    <div style={{ maxWidth: 980, opacity: fadeIn(progress, 0, 0.24) }}>
      <div
        style={{
          alignItems: 'center',
          background: `linear-gradient(135deg, ${colors.blue}, ${colors.green})`,
          borderRadius: 14,
          color: '#fff',
          display: 'flex',
          fontSize: 48,
          fontWeight: 950,
          height: 110,
          justifyContent: 'center',
          margin: '0 auto 28px',
          width: 110,
        }}
      >
        E
      </div>
      <h2 style={{ ...baseText, fontSize: 78, fontWeight: 950, lineHeight: 1, margin: 0 }}>
        EduRyday
      </h2>
      <p style={{ color: colors.muted, fontSize: 28, lineHeight: 1.5, margin: '24px 0 0' }}>
        AI 튜터, Split View IDE, No-Code Rubric Engine을 연결한 학습관리시스템
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 34 }}>
        <Tag tone="green">학생 실습</Tag>
        <Tag tone="amber">교수자 채점</Tag>
        <Tag>관리자 운영</Tag>
      </div>
    </div>
  </div>
);

const LandingScene = () => (
  <div style={{ alignItems: 'center', display: 'grid', gap: 34, gridTemplateColumns: '0.9fr 1.1fr', height: '100%' }}>
    <div style={{ paddingLeft: 16 }}>
      <h2 style={{ ...baseText, fontSize: 64, fontWeight: 950, lineHeight: 1.08, margin: 0 }}>
        <span style={{ display: 'block' }}>수업 운영을</span>
        <span style={{ display: 'block' }}>하나의 흐름으로</span>
      </h2>
      <p style={{ color: '#475569', fontSize: 24, lineHeight: 1.55, margin: '24px 0 0' }}>
        강의 관리, 코딩 실습, AI 힌트, 루브릭 채점, 운영 로그를 한 서비스 안에서 연결합니다.
      </p>
      <div style={{ display: 'flex', gap: 14, marginTop: 32 }}>
        <Button>학생으로 시작</Button>
        <Tag tone="green">교수자 · 관리자 지원</Tag>
      </div>
    </div>
    <BrowserPreview />
  </div>
);

const BrowserPreview = () => (
  <Panel style={{ boxShadow: '0 26px 70px rgba(15,23,42,0.15)', height: 620 }}>
    <div
      style={{
        alignItems: 'center',
        borderBottom: `1px solid ${colors.line}`,
        display: 'flex',
        gap: 8,
        height: 46,
        padding: '0 18px',
      }}
    >
      {['#ef4444', '#f59e0b', '#22c55e'].map((color) => (
        <span key={color} style={{ background: color, borderRadius: '50%', height: 12, width: 12 }} />
      ))}
      <span style={{ color: colors.muted, fontSize: 15, marginLeft: 10 }}>eduryday.app/dashboard</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', height: 574 }}>
      <div style={{ background: colors.navy, color: '#cbd5e1', display: 'grid', gap: 10, padding: 22, placeContent: 'start' }}>
        {['대시보드', '내 강의', 'Split View IDE', 'AI 튜터', '성적'].map((item, index) => (
          <div
            key={item}
            style={{
              alignItems: 'center',
              background: index === 0 ? '#1e40af' : 'transparent',
              borderRadius: 8,
              color: index === 0 ? '#fff' : '#cbd5e1',
              display: 'flex',
              fontSize: 15,
              fontWeight: 850,
              height: 39,
              padding: '0 12px',
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 16, gridTemplateRows: 'auto 160px 1fr', padding: 20 }}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <StatCard label="오늘 학습" value="3개" />
          <StatCard bar={72} label="평균 진도" tone="green" value="72%" />
          <StatCard label="AI 힌트" tone="amber" value="15" />
        </div>
        <Panel style={{ alignItems: 'end', display: 'flex', gap: 10, padding: 14 }}>
          {[42, 62, 48, 72, 56, 84, 66].map((height, index) => (
            <div
              key={`${height}-${index}`}
              style={{
                background: index % 2 === 0 ? colors.blue : colors.green,
                borderRadius: '7px 7px 0 0',
                flex: 1,
                height: `${height}%`,
              }}
            />
          ))}
        </Panel>
        <Panel>
          {courses.map(([title, status, meta], index) => (
            <Row key={title}>
              <strong style={{ fontSize: 18 }}>{title}</strong>
              <Tag tone={index === 0 ? 'green' : 'blue'}>{status}</Tag>
              <span style={{ color: colors.muted, fontSize: 16 }}>{meta}</span>
            </Row>
          ))}
        </Panel>
      </div>
    </div>
  </Panel>
);

const AuthScene = ({ progress }: { progress: number }) => {
  const selected = progress > 0.48;
  return (
    <div style={{ display: 'grid', gap: 26, gridTemplateColumns: '1fr 1fr', height: '100%' }}>
      <Panel style={{ display: 'grid', gap: 24, padding: 38, placeContent: 'center' }}>
        <Tag>{selected ? '역할 확인' : '로그인'}</Tag>
        <h2 style={{ ...baseText, fontSize: 48, fontWeight: 950, lineHeight: 1.12, margin: 0 }}>
          하나의 계정으로 역할별 화면에 진입합니다.
        </h2>
        <p style={{ color: colors.muted, fontSize: 23, lineHeight: 1.58, margin: 0 }}>
          인증 세션과 프로필 역할을 확인한 뒤 학생, 교수자, 관리자 전용 플로우로 이동합니다.
        </p>
      </Panel>
      <Panel style={{ display: 'grid', padding: 42, placeItems: 'center' }}>
        <div style={{ display: 'grid', gap: 15, width: 520 }}>
          <strong style={{ fontSize: 30 }}>로그인</strong>
          {['student@eduryday.app', '••••••••••••'].map((value) => (
            <div
              key={value}
              style={{
                border: `1px solid ${colors.line}`,
                borderRadius: 8,
                color: colors.slate,
                fontSize: 20,
                height: 58,
                padding: '15px 18px',
              }}
            >
              {value}
            </div>
          ))}
          <Button>계속하기</Button>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {['Student', 'Professor', 'Admin'].map((role, index) => (
              <Panel
                key={role}
                style={{
                  outline: selected && index === 0 ? '4px solid #bfdbfe' : '0',
                  padding: 18,
                  textAlign: 'center',
                }}
              >
                <strong style={{ display: 'block', fontSize: 19 }}>{role}</strong>
                <span style={{ color: colors.muted, display: 'block', fontSize: 15, marginTop: 8 }}>
                  {index === 0 ? '학습자' : index === 1 ? '교수자' : '운영자'}
                </span>
              </Panel>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
};

const StudentDashboardScene = ({ progress }: { progress: number }) => {
  const remaining = Math.round(interpolate(progress, [0, 1], [4, 2]));
  const due = progress > 0.58 ? 1 : 2;
  const totalProgress = Math.round(interpolate(progress, [0, 1], [68, 74]));
  const remainingBar = (remaining / 4) * 100;
  const dueBar = (due / 2) * 100;

  return (
    <div style={{ display: 'grid', gap: 22, gridTemplateRows: 'auto 1fr', height: '100%' }}>
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard bar={remainingBar} label="오늘 남은 학습" value={`${remaining}`} />
        <StatCard bar={totalProgress} label="전체 진도" tone="green" value={`${totalProgress}%`} />
        <StatCard bar={dueBar} label="마감 임박" tone="amber" value={`${due}`} />
      </div>
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr', minHeight: 0 }}>
        <Panel>
          <SectionTitle>내 강의</SectionTitle>
          {courses.map(([title, status, meta], index) => (
            <Row key={title}>
              <strong style={{ fontSize: 19 }}>{title}</strong>
              <Tag tone={index === 0 ? 'green' : 'blue'}>{status}</Tag>
              <span style={{ color: colors.muted, fontSize: 17 }}>{meta}</span>
            </Row>
          ))}
        </Panel>
        <Panel>
          <SectionTitle action={<Tag tone="amber">D-1</Tag>}>오늘 할 일</SectionTitle>
          <Row columns="52px 1fr 110px 120px">
            <Tag tone="green">1</Tag>
            <strong style={{ fontSize: 19 }}>그래프 탐색 강의 듣기</strong>
            <span style={{ color: colors.muted }}>35분</span>
            <Tag tone="green">완료</Tag>
          </Row>
          <Row columns="52px 1fr 110px 120px">
            <Tag tone="amber">2</Tag>
            <strong style={{ fontSize: 19 }}>BFS 실습 제출</strong>
            <span style={{ color: colors.muted }}>20분</span>
            <Tag tone="amber">진행</Tag>
          </Row>
          <Row columns="52px 1fr 110px 120px">
            <Tag>3</Tag>
            <strong style={{ fontSize: 19 }}>AI 튜터 질문 복습</strong>
            <span style={{ color: colors.muted }}>10분</span>
            <Tag>추천</Tag>
          </Row>
        </Panel>
      </div>
    </div>
  );
};

const CourseScene = () => (
  <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 0.82fr', height: '100%' }}>
    <Panel>
      <SectionTitle action={<Tag tone="green">4주차 진행</Tag>}>알고리즘 실습 · 주차별 커리큘럼</SectionTitle>
      {weeks.map(([week, title, status, meta], index) => (
        <Row key={week} columns="100px 1fr 120px 110px">
          <Tag tone={index < 3 ? 'green' : 'amber'}>{week}</Tag>
          <strong style={{ fontSize: 19 }}>{title}</strong>
          <span style={{ color: colors.muted, fontSize: 17 }}>{status}</span>
          <Tag tone={index < 3 ? 'green' : 'amber'}>{meta}</Tag>
        </Row>
      ))}
    </Panel>
    <Panel style={{ display: 'grid', gap: 20, padding: 28, placeContent: 'start' }}>
      <StatCard bar={72} label="이번 주 목표" tone="green" value="그래프 탐색" />
      <p style={{ color: colors.muted, fontSize: 23, lineHeight: 1.58, margin: 0 }}>
        BFS와 DFS의 차이를 설명하고, 인접 리스트를 사용해 최단 경로 문제를 해결합니다.
      </p>
      <Panel style={{ background: '#f8fafc', padding: 20 }}>
        <strong style={{ fontSize: 21 }}>실습 안내</strong>
        <p style={{ color: colors.muted, fontSize: 18, lineHeight: 1.55, margin: '10px 0 0' }}>
          제출 전 테스트 케이스 3개를 통과해야 하며, 시간 복잡도 설명을 함께 작성합니다.
        </p>
      </Panel>
      <Button>IDE에서 실습 시작</Button>
    </Panel>
  </div>
);

const IdeScene = ({ progress }: { progress: number }) => {
  const testPhase = progress < 0.38 ? '작성 중' : progress < 0.68 ? '테스트 실행' : '제출 완료';
  const testsPassed = progress < 0.38 ? 0 : progress < 0.68 ? 2 : 3;

  return (
    <div style={{ display: 'grid', gap: 22, gridTemplateColumns: '0.92fr 1.08fr', height: '100%' }}>
      <Panel>
        <SectionTitle action={<Tag tone={testsPassed === 3 ? 'green' : 'amber'}>{testPhase}</Tag>}>
          실습 문제: BFS 방문 순서 구현
        </SectionTitle>
        <div style={{ display: 'grid', gap: 18, padding: 24 }}>
          <p style={{ fontSize: 22, lineHeight: 1.58, margin: 0 }}>
            그래프와 시작 정점이 주어질 때 너비 우선 탐색 순서대로 정점을 반환하세요.
          </p>
          <Panel style={{ background: '#f8fafc', padding: 18 }}>
            <strong style={{ fontSize: 20 }}>검증 기준</strong>
            <p style={{ color: colors.muted, fontSize: 18, lineHeight: 1.5, margin: '10px 0 0' }}>
              큐 사용, 방문 중복 방지, 방문 순서, 시간 복잡도 설명
            </p>
          </Panel>
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <StatCard label="테스트" tone={testsPassed === 3 ? 'green' : 'blue'} value={`${testsPassed}/3`} />
            <StatCard label="힌트 사용" tone="amber" value="1" />
            <StatCard label="예상 점수" tone="green" value={testsPassed === 3 ? '92' : '--'} />
          </div>
        </div>
      </Panel>
      <div
        style={{
          background: '#111827',
          borderRadius: 8,
          color: '#d1d5db',
          display: 'grid',
          gridTemplateRows: '52px 1fr 178px',
          overflow: 'hidden',
        }}
      >
        <div style={{ alignItems: 'center', background: '#0b1120', borderBottom: '1px solid #1f2937', display: 'flex', gap: 10, padding: '0 16px' }}>
          <CodeTab>solution.py</CodeTab>
          <CodeTab>tests.py</CodeTab>
        </div>
        <pre style={codeStyle}>{`from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in graph[node]:
            if nxt not in visited:
                visited.add(nxt)
                queue.append(nxt)
    return order`}</pre>
        <div style={terminalStyle}>
          <div style={{ color: '#93c5fd' }}>$ npm run test -- bfs</div>
          <div style={{ color: testsPassed >= 1 ? '#86efac' : '#9ca3af' }}>case 1: {testsPassed >= 1 ? 'passed' : 'waiting'}</div>
          <div style={{ color: testsPassed >= 2 ? '#86efac' : '#9ca3af' }}>case 2: {testsPassed >= 2 ? 'passed' : 'waiting'}</div>
          <div style={{ color: testsPassed >= 3 ? '#86efac' : '#9ca3af' }}>case 3: {testsPassed >= 3 ? 'passed' : 'waiting'}</div>
          {testsPassed === 3 ? <div style={{ color: '#93c5fd' }}>submission #EDU-2048 saved</div> : null}
        </div>
      </div>
    </div>
  );
};

const CodeTab = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      alignItems: 'center',
      background: '#1f2937',
      borderRadius: 7,
      color: '#e5e7eb',
      display: 'inline-flex',
      fontSize: 15,
      fontWeight: 850,
      height: 32,
      padding: '0 14px',
    }}
  >
    {children}
  </span>
);

const codeStyle: React.CSSProperties = {
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
  fontSize: 20,
  lineHeight: 1.58,
  margin: 0,
  overflow: 'hidden',
  padding: '22px 26px',
  whiteSpace: 'pre-wrap',
};

const terminalStyle: React.CSSProperties = {
  background: '#020617',
  borderTop: '1px solid #1f2937',
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
  fontSize: 16,
  lineHeight: 1.55,
  padding: '18px 22px',
};

const AiTutorScene = ({ progress }: { progress: number }) => (
  <div style={{ display: 'grid', gap: 22, gridTemplateColumns: '1fr 0.48fr', height: '100%' }}>
    <Panel style={{ display: 'grid', gridTemplateRows: '64px 1fr 74px' }}>
      <SectionTitle>AI 튜터 · BFS 실습</SectionTitle>
      <div style={{ display: 'grid', gap: 16, padding: 24, placeContent: 'start' }}>
        <Bubble align="right">테스트 2번에서 중복 방문이 생겨요. 어디를 봐야 하나요?</Bubble>
        {progress > 0.26 ? (
          <Bubble>
            queue에 넣는 시점과 visited 처리 시점을 비교해 보세요. 같은 노드가 여러 부모에서
            발견될 수 있으므로, 큐에 넣는 순간 방문 처리하면 중복 삽입을 막을 수 있습니다.
          </Bubble>
        ) : null}
        {progress > 0.72 ? (
          <Bubble>
            강의 4주차 예시처럼 인접 리스트를 순회할 때 visited.add 위치를 먼저 확인해 보세요.
          </Bubble>
        ) : null}
      </div>
      <div style={{ alignItems: 'center', borderTop: `1px solid ${colors.line}`, display: 'grid', gap: 12, gridTemplateColumns: '1fr 52px', padding: 12 }}>
        <div style={{ border: `1px solid ${colors.line}`, borderRadius: 8, color: colors.slate, fontSize: 18, height: 50, padding: '13px 16px' }}>
          내 코드 기준으로 힌트 더 보기
        </div>
        <div style={{ alignItems: 'center', background: colors.green, borderRadius: 8, color: '#fff', display: 'flex', fontSize: 24, fontWeight: 900, height: 50, justifyContent: 'center' }}>
          ↗
        </div>
      </div>
    </Panel>
    <Panel>
      <SectionTitle>참고 근거</SectionTitle>
      <div style={{ display: 'grid', gap: 14, padding: 20 }}>
        {[
          ['4주차 강의 노트', 'BFS는 큐에 넣는 순간 방문 처리한다.'],
          ['테스트 케이스 2', 'A와 B가 같은 C를 가리킬 때 중복 탐색 여부를 확인한다.'],
          ['학생 코드', 'visited.add 위치를 비교 대상으로 표시했다.'],
        ].map(([title, copy]) => (
          <Panel key={title} style={{ padding: 18 }}>
            <strong style={{ fontSize: 20 }}>{title}</strong>
            <p style={{ color: colors.muted, fontSize: 17, lineHeight: 1.48, margin: '9px 0 0' }}>
              {copy}
            </p>
          </Panel>
        ))}
      </div>
    </Panel>
  </div>
);

const Bubble = ({
  align = 'left',
  children,
}: {
  align?: 'left' | 'right';
  children: React.ReactNode;
}) => {
  const user = align === 'right';
  return (
    <div
      style={{
        alignSelf: user ? 'end' : 'start',
        background: user ? colors.blue : '#f1f5f9',
        borderRadius: 8,
        color: user ? '#fff' : colors.ink,
        fontSize: 20,
        lineHeight: 1.52,
        maxWidth: user ? '76%' : '82%',
        padding: '16px 18px',
      }}
    >
      {children}
    </div>
  );
};

const FeedbackScene = () => (
  <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 0.82fr', height: '100%' }}>
    <Panel>
      <SectionTitle action={<Tag tone="green">제출 완료</Tag>}>과제 제출 결과</SectionTitle>
      <Row columns="1fr 140px 140px">
        <strong style={{ fontSize: 19 }}>BFS 실습</strong>
        <Tag tone="green">92점</Tag>
        <Tag tone="green">완료</Tag>
      </Row>
      <Row columns="1fr 140px 140px">
        <strong style={{ fontSize: 19 }}>DFS 과제</strong>
        <Tag tone="amber">제출</Tag>
        <Tag tone="amber">채점 대기</Tag>
      </Row>
      <Row columns="1fr 140px 140px">
        <strong style={{ fontSize: 19 }}>정렬 분석</strong>
        <Tag tone="green">88점</Tag>
        <Tag tone="green">완료</Tag>
      </Row>
    </Panel>
    <Panel style={{ display: 'grid', gap: 20, padding: 28, placeContent: 'start' }}>
      <StatCard bar={92} label="최근 피드백" tone="green" value="좋음" />
      <p style={{ color: colors.muted, fontSize: 23, lineHeight: 1.58, margin: 0 }}>
        BFS 구현은 통과했습니다. 다음 제출에서는 시간 복잡도 설명을 한 문단 더 보강하세요.
      </p>
      <Panel style={{ background: '#f8fafc', padding: 20 }}>
        <strong style={{ fontSize: 20 }}>다음 행동</strong>
        <p style={{ color: colors.muted, fontSize: 18, lineHeight: 1.5, margin: '10px 0 0' }}>
          AI 튜터 힌트와 교수자 피드백을 바탕으로 DFS 과제를 이어서 제출합니다.
        </p>
      </Panel>
    </Panel>
  </div>
);

const ProfessorScene = ({ progress }: { progress: number }) => {
  const generated = progress > 0.28;
  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 0.95fr', height: '100%' }}>
      <Panel style={{ padding: 24 }}>
        <StatCard label="자연어 평가 기준" tone="amber" value="루브릭 생성" />
        <div style={{ border: `1px solid ${colors.line}`, borderRadius: 8, color: colors.slate, fontSize: 20, lineHeight: 1.5, marginTop: 18, padding: 18 }}>
          큐 사용, 방문 중복 방지, 시간 복잡도 설명, 테스트 통과 여부를 각각 반영한다.
        </div>
        <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
          {[
            ['큐 기반 BFS 구현', '35점'],
            ['방문 중복 방지', '25점'],
            ['시간 복잡도 설명', '20점'],
            ['테스트 케이스 통과', '20점'],
          ].map(([label, score], index) => (
            <div
              key={label}
              style={{
                alignItems: 'center',
                border: `1px solid ${colors.line}`,
                borderRadius: 8,
                display: 'grid',
                gridTemplateColumns: '1fr 100px',
                opacity: generated ? 1 : 0.38,
                padding: 14,
              }}
            >
              <strong style={{ fontSize: 19 }}>{label}</strong>
              <Tag tone={index === 3 ? 'green' : 'blue'}>{score}</Tag>
            </div>
          ))}
        </div>
      </Panel>
      <Panel>
        <SectionTitle action={<Tag tone="green">채점 반영</Tag>}>최근 제출물</SectionTitle>
        {[
          ['김민준 · BFS 실습', '92점', '완료'],
          ['이서연 · DFS 과제', '검토', '제출'],
          ['박지호 · 정렬 분석', '88점', '완료'],
          ['최유진 · 그래프 탐색', '위험', '지연'],
        ].map(([name, score, status]) => (
          <Row key={name} columns="1fr 130px 130px">
            <strong style={{ fontSize: 18 }}>{name}</strong>
            <Tag tone={score === '위험' ? 'red' : score === '검토' ? 'amber' : 'green'}>{score}</Tag>
            <Tag tone={status === '지연' ? 'red' : status === '제출' ? 'amber' : 'green'}>{status}</Tag>
          </Row>
        ))}
      </Panel>
    </div>
  );
};

const AdminScene = () => (
  <div style={{ display: 'grid', gap: 22, gridTemplateRows: 'auto 1fr', height: '100%' }}>
    <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <StatCard label="활성 사용자" value="1,286" />
      <StatCard label="강의 수" tone="green" value="42" />
      <StatCard label="API 상태" tone="green" value="정상" />
    </div>
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr', minHeight: 0 }}>
      <Panel>
        <SectionTitle>사용자 권한</SectionTitle>
        <Row columns="1fr 135px 120px">
          <strong style={{ fontSize: 18 }}>김민준</strong>
          <Tag>Student</Tag>
          <Tag tone="green">활성</Tag>
        </Row>
        <Row columns="1fr 135px 120px">
          <strong style={{ fontSize: 18 }}>박서연</strong>
          <Tag tone="amber">Professor</Tag>
          <Tag tone="green">활성</Tag>
        </Row>
        <Row columns="1fr 135px 120px">
          <strong style={{ fontSize: 18 }}>운영 관리자</strong>
          <Tag tone="red">Admin</Tag>
          <Tag tone="green">활성</Tag>
        </Row>
      </Panel>
      <Panel>
        <SectionTitle>감사 로그</SectionTitle>
        {logs.map(([time, event, status]) => (
          <Row key={time} columns="92px 1fr 110px">
            <span style={{ color: colors.muted, fontSize: 17 }}>{time}</span>
            <strong style={{ fontSize: 18 }}>{event}</strong>
            <Tag tone={status === '주의' ? 'amber' : 'green'}>{status}</Tag>
          </Row>
        ))}
      </Panel>
    </div>
  </div>
);

const ClosingScene = ({ progress }: { progress: number }) => (
  <div style={{ display: 'grid', height: '100%', placeItems: 'center', textAlign: 'center' }}>
    <div style={{ maxWidth: 1020, opacity: fadeIn(progress, 0, 0.24) }}>
      <h2 style={{ ...baseText, fontSize: 68, fontWeight: 950, lineHeight: 1.04, margin: 0 }}>
        학습부터 운영까지 연결되는 AI LMS
      </h2>
      <p style={{ color: colors.muted, fontSize: 27, lineHeight: 1.5, margin: '24px 0 0' }}>
        EduRyday는 학생의 실습 경험과 교수자의 평가 업무, 관리자의 운영 관리를 하나의 제품
        흐름으로 제공합니다.
      </p>
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 36 }}>
        <StatCard label="역할" value="3" />
        <StatCard label="핵심 기능" tone="green" value="5" />
        <StatCard label="데모 길이" tone="amber" value="3:30" />
      </div>
    </div>
  </div>
);

const SceneContent = ({ progress, scene }: { progress: number; scene: Scene }) => {
  switch (scene.key) {
    case 'opening':
      return <OpeningScene progress={progress} />;
    case 'landing':
      return <LandingScene />;
    case 'auth':
      return <AuthScene progress={progress} />;
    case 'student-dashboard':
      return <StudentDashboardScene progress={progress} />;
    case 'course':
      return <CourseScene />;
    case 'ide':
      return <IdeScene progress={progress} />;
    case 'ai-tutor':
      return <AiTutorScene progress={progress} />;
    case 'feedback':
      return <FeedbackScene />;
    case 'professor':
      return <ProfessorScene progress={progress} />;
    case 'admin':
      return <AdminScene />;
    case 'closing':
      return <ClosingScene progress={progress} />;
    default:
      return null;
  }
};

export const EduRydaySubmissionDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = secondsFromFrame(frame, fps);
  const scene = activeScene(seconds);
  const progress = progressFor(scene, seconds);

  return (
    <AbsoluteFill
      style={{
        ...baseText,
        background:
          'linear-gradient(90deg, rgba(20,153,111,0.06), transparent 28%), linear-gradient(180deg, #f8fbff 0%, #eaf1f8 100%)',
        display: 'grid',
        gridTemplateRows: '82px 1fr 92px',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          alignItems: 'center',
          background: 'rgba(255,255,255,0.92)',
          borderBottom: `1px solid ${colors.line}`,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 40px',
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
          <div
            style={{
              alignItems: 'center',
              background: `linear-gradient(135deg, ${colors.blue}, ${colors.green})`,
              borderRadius: 8,
              color: '#fff',
              display: 'flex',
              fontSize: 23,
              fontWeight: 950,
              height: 44,
              justifyContent: 'center',
              width: 44,
            }}
          >
            E
          </div>
          <span style={{ fontSize: 26, fontWeight: 950 }}>EduRyday</span>
        </div>
        <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
          <Tag tone="green">최종 제출 영상</Tag>
          <Tag>Next.js · Supabase · AI Tutor</Tag>
        </div>
      </header>

      <main
        style={{
          display: 'grid',
          gap: 24,
          gridTemplateColumns: '330px minmax(0, 1fr)',
          minHeight: 0,
          overflow: 'hidden',
          padding: '26px 40px 20px',
        }}
      >
        <Sidebar frame={frame} scene={scene} seconds={seconds} />
        <AppFrame progress={progress} scene={scene}>
          <SceneContent progress={progress} scene={scene} />
        </AppFrame>
      </main>

      <footer
        style={{
          alignItems: 'center',
          background: 'rgba(255,255,255,0.88)',
          borderTop: `1px solid ${colors.line}`,
          display: 'grid',
          gap: 24,
          gridTemplateColumns: '1fr 500px',
          padding: '0 40px',
        }}
      >
        <div style={{ display: 'grid', gap: 10 }}>
          <div
            style={{
              alignItems: 'center',
              color: '#475569',
              display: 'flex',
              fontSize: 16,
              fontWeight: 850,
              justifyContent: 'space-between',
            }}
          >
            <span>{formatTime(seconds)}</span>
            <span>{scene.title}</span>
            <span>{formatTime(SUBMISSION_VIDEO_DURATION_SECONDS)}</span>
          </div>
          <div style={{ background: '#dbe4ee', borderRadius: 999, height: 10, overflow: 'hidden' }}>
            <div
              style={{
                background: `linear-gradient(90deg, ${colors.blue}, ${colors.green}, ${colors.amber})`,
                borderRadius: 999,
                height: '100%',
                width: `${(seconds / SUBMISSION_VIDEO_DURATION_SECONDS) * 100}%`,
              }}
            />
          </div>
        </div>
        <Panel style={{ padding: '14px 16px' }}>
          <strong style={{ display: 'block', fontSize: 17 }}>{scene.title}</strong>
          <span style={{ color: colors.muted, display: 'block', fontSize: 14, marginTop: 5 }}>
            {scene.lower}
          </span>
        </Panel>
      </footer>
    </AbsoluteFill>
  );
};
