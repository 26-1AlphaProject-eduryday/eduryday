import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 24;
export const VIDEO_DURATION_SECONDS = 270;

type Role = 'visitor' | 'student' | 'professor' | 'admin' | 'all';

type SceneKey =
  | 'landing'
  | 'auth'
  | 'student-dashboard'
  | 'course'
  | 'ide'
  | 'tutor'
  | 'student-grades'
  | 'professor-dashboard'
  | 'rubric'
  | 'analytics'
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

type RoleMeta = {
  avatar: string;
  name: string;
  nav: string[];
  subtitle: string;
};

const scenes: Scene[] = [
  {
    start: 0,
    end: 14,
    key: 'landing',
    role: 'visitor',
    title: 'EduRyday AI 기반 LMS',
    subtitle: '랜딩에서 실제 제품 화면을 바로 보여주며, 세 역할의 핵심 흐름을 소개합니다.',
    lower: '빈 미리보기 대신 실제 대시보드와 IDE 화면을 노출합니다.',
  },
  {
    start: 14,
    end: 28,
    key: 'auth',
    role: 'visitor',
    title: '로그인과 역할 분기',
    subtitle: 'Supabase 인증 이후 학생, 교수자, 관리자가 각자의 홈으로 이동합니다.',
    lower: '한 진입점에서 role metadata 기반 라우팅을 수행합니다.',
  },
  {
    start: 28,
    end: 52,
    key: 'student-dashboard',
    role: 'student',
    title: '학생 대시보드',
    subtitle: '오늘의 학습, 마감 과제, 진행률, 알림을 한 화면에서 확인합니다.',
    lower: '학생은 해야 할 일을 놓치지 않고 바로 수업으로 진입합니다.',
  },
  {
    start: 52,
    end: 74,
    key: 'course',
    role: 'student',
    title: '강의 상세와 주차별 학습',
    subtitle: '주차, 레슨, 실습, 공지, 진도 상태가 연결되어 있습니다.',
    lower: '이론 학습에서 코딩 실습으로 자연스럽게 이어집니다.',
  },
  {
    start: 74,
    end: 108,
    key: 'ide',
    role: 'student',
    title: 'Split View IDE',
    subtitle: '문제 설명, 코드 작성, 테스트 실행, 제출 결과를 한 화면에서 처리합니다.',
    lower: '실행, 테스트, 제출까지 브라우저 안에서 끝냅니다.',
  },
  {
    start: 108,
    end: 134,
    key: 'tutor',
    role: 'student',
    title: 'AI 튜터',
    subtitle: '정답 대신 자료 근거와 단계별 힌트로 학생의 현재 코드 맥락을 돕습니다.',
    lower: 'RAG 기반 힌트로 학생의 현재 코드 맥락을 반영합니다.',
  },
  {
    start: 134,
    end: 154,
    key: 'student-grades',
    role: 'student',
    title: '과제와 성적 확인',
    subtitle: '제출 상태, 채점 결과, 피드백을 학생 화면에서 확인합니다.',
    lower: '학습자는 피드백을 보고 다음 개선 행동을 정합니다.',
  },
  {
    start: 154,
    end: 178,
    key: 'professor-dashboard',
    role: 'professor',
    title: '교수자 대시보드',
    subtitle: '강의 운영 지표와 미채점 제출물을 한눈에 확인합니다.',
    lower: '교수자는 운영 병목을 빠르게 발견하고 조치합니다.',
  },
  {
    start: 178,
    end: 214,
    key: 'rubric',
    role: 'professor',
    title: 'No-Code Rubric Engine',
    subtitle: '자연어 기준을 입력하면 평가 항목과 점수표로 변환됩니다.',
    lower: '코드 없이도 루브릭 생성, 채점, 피드백 작성이 가능합니다.',
  },
  {
    start: 214,
    end: 236,
    key: 'analytics',
    role: 'professor',
    title: '학습 분석과 공지',
    subtitle: '참여율, 과제 평균, 위험 학생, 공지 반응을 함께 봅니다.',
    lower: '데이터 기반으로 수업 운영 결정을 내립니다.',
  },
  {
    start: 236,
    end: 254,
    key: 'admin',
    role: 'admin',
    title: '관리자 운영 콘솔',
    subtitle: '사용자, 강의, 시스템 로그, 정책 설정까지 운영 흐름을 확인합니다.',
    lower: '서비스 운영자는 감사 로그와 접근 권한을 추적합니다.',
  },
  {
    start: 254,
    end: 270,
    key: 'closing',
    role: 'all',
    title: '최종 시연 완료',
    subtitle: '학습, 실습, AI 도움, 평가, 운영을 하나의 흐름으로 연결합니다.',
    lower: '발표자는 이 지점에서 핵심 가치와 다음 계획을 정리합니다.',
  },
];

const roleMeta: Record<Role, RoleMeta> = {
  visitor: {
    avatar: 'E',
    name: 'EduRyday',
    subtitle: '서비스 소개와 로그인',
    nav: ['랜딩', '로그인', '역할 선택'],
  },
  student: {
    avatar: '김',
    name: '김민준',
    subtitle: '컴퓨터공학과 2학년',
    nav: ['대시보드', '내 강의', 'IDE', 'AI 튜터', '성적'],
  },
  professor: {
    avatar: '박',
    name: '박서연 교수',
    subtitle: '알고리즘 실습 담당',
    nav: ['대시보드', '강의 관리', '루브릭', '채점', '분석'],
  },
  admin: {
    avatar: 'AD',
    name: '관리자',
    subtitle: '서비스 운영 콘솔',
    nav: ['사용자', '강의', '로그', '설정'],
  },
  all: {
    avatar: 'E',
    name: 'EduRyday',
    subtitle: 'AI 기반 통합 학습 관리',
    nav: ['학생', '교수', '관리자', '배포'],
  },
};

const courses = [
  ['알고리즘 실습', '진도 72%', '그래프 탐색'],
  ['자료구조', '진도 84%', '채점 완료'],
  ['웹프로그래밍', '진도 61%', '프로젝트 진행'],
];

const weeks = [
  ['1', 'Python 기본 문법', '완료', '100%'],
  ['2', '리스트와 딕셔너리', '완료', '100%'],
  ['3', '정렬 알고리즘', '진행 중', '80%'],
  ['4', '그래프 탐색 실습', '오늘', '45분'],
];

const students = [
  ['김민준', 'BFS 실습', '92점', '완료'],
  ['이서연', 'DFS 과제', '채점 대기', '제출'],
  ['박지호', '정렬 분석', '88점', '완료'],
  ['최유진', '그래프 탐색', '위험', '지연'],
];

const logs = [
  ['09:02', 'professor.courses.update', '정상'],
  ['09:18', 'student.submissions.create', '정상'],
  ['09:41', 'admin.users.role.update', '주의'],
  ['10:05', 'api.v1.code.run', '정상'],
];

const colors = {
  amber: '#d97706',
  amberBg: '#fef3c7',
  bg: '#eef3f8',
  blue: '#2563eb',
  blueBg: '#dbeafe',
  green: '#14996f',
  greenBg: '#dcfce7',
  ink: '#172033',
  line: '#dbe4ee',
  muted: '#64748b',
  navy: '#0f172a',
  panel: '#ffffff',
  red: '#dc2626',
  redBg: '#fee2e2',
};

const fontFamily =
  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const secondsFromFrame = (frame: number, fps: number) => frame / fps;

const clamp = (value: number, min = 0, max = 1) => {
  return Math.max(min, Math.min(max, value));
};

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safeSeconds / 60)).padStart(2, '0')}:${String(
    safeSeconds % 60,
  ).padStart(2, '0')}`;
};

const activeScene = (seconds: number) => {
  return scenes.find((scene) => seconds >= scene.start && seconds < scene.end) ?? scenes.at(-1)!;
};

const sceneProgress = (scene: Scene, seconds: number) => {
  return clamp((seconds - scene.start) / (scene.end - scene.start));
};

const typedText = (text: string, progress: number) => {
  return text.slice(0, Math.floor(text.length * clamp(progress)));
};

const fade = (progress: number) => {
  return interpolate(progress, [0, 0.08, 0.94, 1], [0, 1, 1, 0.92], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

const slideY = (progress: number) => {
  return interpolate(progress, [0, 0.12], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

const baseText: React.CSSProperties = {
  color: colors.ink,
  fontFamily,
  letterSpacing: 0,
};

const styles = {
  avatar: {
    alignItems: 'center',
    background: colors.navy,
    borderRadius: 8,
    color: '#fff',
    display: 'flex',
    fontSize: 24,
    fontWeight: 900,
    height: 58,
    justifyContent: 'center',
    width: 58,
  } satisfies React.CSSProperties,
  bar: {
    background: '#e2e8f0',
    borderRadius: 999,
    height: 12,
    overflow: 'hidden',
    width: '100%',
  } satisfies React.CSSProperties,
  button: {
    alignItems: 'center',
    background: colors.blue,
    border: 0,
    borderRadius: 8,
    color: '#fff',
    display: 'inline-flex',
    fontSize: 20,
    fontWeight: 850,
    height: 54,
    justifyContent: 'center',
    padding: '0 24px',
  } satisfies React.CSSProperties,
  card: {
    background: colors.panel,
    border: `1px solid ${colors.line}`,
    borderRadius: 8,
    overflow: 'hidden',
  } satisfies React.CSSProperties,
  h1: {
    ...baseText,
    fontSize: 42,
    fontWeight: 900,
    lineHeight: 1.08,
    margin: 0,
  } satisfies React.CSSProperties,
  muted: {
    color: colors.muted,
  } satisfies React.CSSProperties,
  primaryMetric: {
    ...baseText,
    fontSize: 46,
    fontWeight: 900,
    lineHeight: 1,
    marginTop: 10,
  } satisfies React.CSSProperties,
  sceneBody: {
    height: 811,
    padding: 28,
  } satisfies React.CSSProperties,
  sceneHead: {
    alignItems: 'center',
    borderBottom: `1px solid ${colors.line}`,
    display: 'flex',
    height: 156,
    justifyContent: 'space-between',
    padding: '0 32px',
  } satisfies React.CSSProperties,
};

const Tag = ({
  children,
  tone = 'blue',
}: {
  children: React.ReactNode;
  tone?: 'amber' | 'blue' | 'green' | 'red';
}) => {
  const toneStyle = {
    amber: { background: colors.amberBg, color: '#a16207' },
    blue: { background: colors.blueBg, color: '#1d4ed8' },
    green: { background: colors.greenBg, color: '#047857' },
    red: { background: colors.redBg, color: '#b91c1c' },
  }[tone];

  return (
    <span
      style={{
        ...toneStyle,
        alignItems: 'center',
        borderRadius: 999,
        display: 'inline-flex',
        fontSize: 16,
        fontWeight: 850,
        height: 34,
        justifyContent: 'center',
        padding: '0 14px',
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
}) => {
  return <div style={{ ...styles.card, ...style }}>{children}</div>;
};

const PanelTitle = ({
  action,
  children,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div
      style={{
        alignItems: 'center',
        borderBottom: `1px solid ${colors.line}`,
        display: 'flex',
        fontSize: 20,
        fontWeight: 900,
        height: 66,
        justifyContent: 'space-between',
        padding: '0 22px',
      }}
    >
      <span>{children}</span>
      {action}
    </div>
  );
};

const MetricCard = ({
  label,
  progress,
  tone = 'blue',
  value,
}: {
  label: string;
  progress?: number;
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
    <Panel style={{ padding: 24 }}>
      <div style={{ color: colors.muted, fontSize: 17, fontWeight: 800 }}>{label}</div>
      <div style={styles.primaryMetric}>{value}</div>
      {typeof progress === 'number' ? (
        <div style={{ ...styles.bar, marginTop: 22 }}>
          <div
            style={{
              background: color,
              borderRadius: 999,
              height: '100%',
              width: `${clamp(progress, 0, 100)}%`,
            }}
          />
        </div>
      ) : null}
    </Panel>
  );
};

const CourseRow = ({
  meta,
  status,
  title,
  tone = 'blue',
}: {
  meta: string;
  status: string;
  title: string;
  tone?: 'amber' | 'blue' | 'green' | 'red';
}) => {
  return (
    <div
      style={{
        alignItems: 'center',
        borderBottom: `1px solid #eef2f7`,
        display: 'grid',
        gap: 18,
        gridTemplateColumns: '1fr 150px 160px',
        minHeight: 70,
        padding: '0 22px',
      }}
    >
      <strong style={{ fontSize: 20 }}>{title}</strong>
      <Tag tone={tone}>{status}</Tag>
      <span style={{ ...styles.muted, fontSize: 17 }}>{meta}</span>
    </div>
  );
};

const StudentRow = ({
  initials,
  meta,
  name,
  status,
  tone = 'green',
}: {
  initials: string;
  meta: string;
  name: string;
  status: string;
  tone?: 'amber' | 'blue' | 'green' | 'red';
}) => {
  return (
    <div
      style={{
        alignItems: 'center',
        borderBottom: `1px solid #eef2f7`,
        display: 'grid',
        gap: 16,
        gridTemplateColumns: '52px 1fr 140px 140px',
        minHeight: 72,
        padding: '0 22px',
      }}
    >
      <div style={{ ...styles.avatar, fontSize: 18, height: 42, width: 42 }}>{initials}</div>
      <strong style={{ fontSize: 19 }}>{name}</strong>
      <Tag tone={tone}>{meta}</Tag>
      <Tag tone={status === '지연' || status === '위험' ? 'red' : status === '제출' ? 'amber' : 'green'}>
        {status}
      </Tag>
    </div>
  );
};

const WeekRow = ({
  index,
  meta,
  status,
  title,
  tone,
}: {
  index: string;
  meta: string;
  status: string;
  title: string;
  tone: 'amber' | 'blue' | 'green' | 'red';
}) => {
  return (
    <div
      style={{
        alignItems: 'center',
        borderBottom: `1px solid #eef2f7`,
        display: 'grid',
        gap: 16,
        gridTemplateColumns: '50px 1fr 145px 120px',
        minHeight: 72,
        padding: '0 22px',
      }}
    >
      <Tag tone={tone}>{index}</Tag>
      <strong style={{ fontSize: 19 }}>{title}</strong>
      <span style={{ ...styles.muted, fontSize: 17 }}>{status}</span>
      <Tag tone={tone}>{meta}</Tag>
    </div>
  );
};

const SceneFrame = ({
  children,
  progress,
  scene,
}: {
  children: React.ReactNode;
  progress: number;
  scene: Scene;
}) => {
  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${colors.line}`,
        borderRadius: 8,
        boxShadow: '0 24px 70px rgba(15, 23, 42, 0.12)',
        height: '100%',
        opacity: fade(progress),
        overflow: 'hidden',
        transform: `translateY(${slideY(progress)}px)`,
        width: '100%',
      }}
    >
      <header style={styles.sceneHead}>
        <div>
          <h1 style={styles.h1}>{scene.title}</h1>
          <p
            style={{
              ...styles.muted,
              fontSize: 21,
              lineHeight: 1.45,
              margin: '12px 0 0',
              maxWidth: 1020,
            }}
          >
            {scene.subtitle}
          </p>
        </div>
        <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
          <div style={toolButtonStyle}>⌕</div>
          <div style={toolButtonStyle}>!</div>
          <div style={styles.button}>시연 보기</div>
        </div>
      </header>
      <div style={styles.sceneBody}>{children}</div>
    </div>
  );
};

const toolButtonStyle: React.CSSProperties = {
  alignItems: 'center',
  background: '#fff',
  border: `1px solid ${colors.line}`,
  borderRadius: 8,
  color: '#334155',
  display: 'flex',
  fontSize: 24,
  fontWeight: 900,
  height: 48,
  justifyContent: 'center',
  width: 48,
};

const BrowserChrome = ({ progress }: { progress: number }) => {
  const chartValues = [38, 64, 46, 78, 60, 92, 70];

  return (
    <div
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: 8,
        boxShadow: '0 26px 70px rgba(15, 23, 42, 0.16)',
        height: 620,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          background: '#fff',
          borderBottom: `1px solid ${colors.line}`,
          display: 'flex',
          gap: 8,
          height: 46,
          padding: '0 18px',
        }}
      >
        {['#ef4444', '#f59e0b', '#22c55e'].map((color) => (
          <span
            key={color}
            style={{ background: color, borderRadius: '50%', height: 12, width: 12 }}
          />
        ))}
        <span style={{ ...styles.muted, fontSize: 15, marginLeft: 10 }}>eduryday.app/dashboard</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '216px 1fr', height: 574 }}>
        <div
          style={{
            background: colors.navy,
            color: '#cbd5e1',
            display: 'grid',
            gap: 12,
            padding: 22,
            placeContent: 'start',
          }}
        >
          {['대시보드', '내 강의', 'Split View IDE', 'AI 튜터', '성적'].map((item, index) => (
            <div
              key={item}
              style={{
                alignItems: 'center',
                background: index === 0 ? '#1e40af' : 'transparent',
                borderRadius: 8,
                color: index === 0 ? '#fff' : '#cbd5e1',
                display: 'flex',
                fontSize: 16,
                fontWeight: 850,
                height: 40,
                padding: '0 12px',
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gap: 16, gridTemplateRows: 'auto auto 1fr', padding: 22 }}>
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <MetricCard label="오늘 학습" value={`${Math.round(2 + progress * 3)}개`} />
            <MetricCard
              label="평균 진도"
              progress={64 + progress * 8}
              tone="green"
              value={`${Math.round(64 + progress * 8)}%`}
            />
            <MetricCard label="AI 힌트" tone="amber" value={`${Math.round(8 + progress * 19)}`} />
          </div>
          <Panel
            style={{
              alignItems: 'end',
              display: 'flex',
              gap: 12,
              height: 156,
              padding: 16,
            }}
          >
            {chartValues.map((value, index) => (
              <div
                key={value + index}
                style={{
                  background: index % 2 === 0 ? colors.blue : colors.green,
                  borderRadius: '7px 7px 0 0',
                  flex: 1,
                  height: `${value}%`,
                }}
              />
            ))}
          </Panel>
          <Panel>
            {courses.map(([title, status, meta], index) => (
              <CourseRow
                key={title}
                meta={meta}
                status={status}
                title={title}
                tone={index === 0 ? 'green' : 'blue'}
              />
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
};

const LandingScene = ({ progress }: { progress: number }) => {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'grid',
        gap: 34,
        gridTemplateColumns: '0.92fr 1.08fr',
        height: '100%',
      }}
    >
      <div style={{ paddingLeft: 18 }}>
        <h2
          style={{
            ...baseText,
            fontSize: 76,
            fontWeight: 950,
            lineHeight: 0.98,
            margin: '0 0 22px',
          }}
        >
          AI와 함께 굴러가는 수업 운영
        </h2>
        <p style={{ color: '#475569', fontSize: 25, lineHeight: 1.55, margin: 0 }}>
          강의 관리, 실습 IDE, AI 튜터, 루브릭 채점, 운영 콘솔을 하나의 LMS 경험으로
          연결합니다.
        </p>
        <div style={{ alignItems: 'center', display: 'flex', gap: 14, marginTop: 34 }}>
          <div style={styles.button}>학생으로 시작</div>
          <Tag tone="green">교수자 · 관리자 지원</Tag>
        </div>
      </div>
      <BrowserChrome progress={progress} />
    </div>
  );
};

const AuthScene = ({ progress }: { progress: number }) => {
  const step = progress < 0.45 ? '로그인' : progress < 0.75 ? '역할 확인' : '학생 홈 이동';

  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr', height: '100%' }}>
      <Panel style={{ display: 'grid', gap: 24, padding: 38, placeContent: 'center' }}>
        <Tag>{step}</Tag>
        <h2 style={{ ...baseText, fontSize: 48, lineHeight: 1.12, margin: 0 }}>
          하나의 계정으로 역할별 경험을 시작합니다.
        </h2>
        <p style={{ ...styles.muted, fontSize: 23, lineHeight: 1.6, margin: 0 }}>
          Supabase 인증 세션을 확인한 뒤 사용자 role 값에 맞춰 학생, 교수자, 관리자 화면으로
          안전하게 이동합니다.
        </p>
      </Panel>
      <Panel style={{ display: 'grid', padding: 42, placeItems: 'center' }}>
        <div style={{ display: 'grid', gap: 16, width: 500 }}>
          <strong style={{ fontSize: 30 }}>로그인</strong>
          {['student@eduryday.app', '••••••••••••'].map((value) => (
            <div
              key={value}
              style={{
                border: `1px solid ${colors.line}`,
                borderRadius: 8,
                color: '#334155',
                fontSize: 20,
                height: 58,
                padding: '15px 18px',
              }}
            >
              {value}
            </div>
          ))}
          <div style={{ ...styles.button, height: 58 }}>계속하기</div>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {['Student', 'Professor', 'Admin'].map((role, index) => (
              <Panel
                key={role}
                style={{
                  outline: progress > 0.45 && index === 0 ? '4px solid #bfdbfe' : '0',
                  padding: 18,
                  textAlign: 'center',
                }}
              >
                <strong style={{ fontSize: 19 }}>{role}</strong>
                <div style={{ ...styles.muted, fontSize: 15, marginTop: 8 }}>
                  {index === 0 ? '학습자' : index === 1 ? '교수자' : '운영자'}
                </div>
              </Panel>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
};

const StudentDashboardScene = ({ progress }: { progress: number }) => {
  const overallPercent = Math.round(68 + progress * 6);
  const remainingLessons = Math.max(1, Math.round(4 - progress * 2));
  const remainingBar = Math.round(72 - progress * 34);
  const deadlineCount = progress > 0.55 ? 1 : 2;
  const deadlineBar = Math.round(64 - progress * 26);

  return (
    <div style={{ display: 'grid', gap: 22, gridTemplateRows: 'auto 1fr', height: '100%' }}>
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <MetricCard label="오늘 남은 학습" progress={remainingBar} value={`${remainingLessons}`} />
        <MetricCard label="전체 진도" progress={overallPercent} tone="green" value={`${overallPercent}%`} />
        <MetricCard label="마감 임박" progress={deadlineBar} tone="amber" value={`${deadlineCount}`} />
      </div>
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr', minHeight: 0 }}>
        <Panel>
          <PanelTitle>내 강의</PanelTitle>
          {courses.map(([title, status, meta], index) => (
            <CourseRow
              key={title}
              meta={meta}
              status={status}
              title={title}
              tone={index === 0 ? 'green' : 'blue'}
            />
          ))}
        </Panel>
        <Panel>
          <PanelTitle action={<Tag tone="amber">D-{progress > 0.6 ? '1' : '2'}</Tag>}>
            오늘 할 일
          </PanelTitle>
          <WeekRow index="1" meta="35분" status="진행" title="그래프 탐색 강의 듣기" tone="green" />
          <WeekRow index="2" meta="20분" status="마감" title="BFS 실습 제출" tone="amber" />
          <WeekRow index="3" meta="10분" status="추천" title="AI 튜터 질문 복습" tone="blue" />
        </Panel>
      </div>
    </div>
  );
};

const CourseScene = () => {
  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 0.85fr', height: '100%' }}>
      <Panel>
        <PanelTitle action={<Tag tone="green">75%</Tag>}>알고리즘 실습 · 주차별 커리큘럼</PanelTitle>
        {weeks.map(([index, title, status, meta], order) => (
          <WeekRow
            key={title}
            index={index}
            meta={meta}
            status={status}
            title={title}
            tone={order < 2 ? 'green' : order === 3 ? 'amber' : 'blue'}
          />
        ))}
      </Panel>
      <Panel style={{ display: 'grid', gap: 22, padding: 28, placeContent: 'start' }}>
        <MetricCard label="이번 주 목표" value="그래프 탐색" />
        <p style={{ ...styles.muted, fontSize: 23, lineHeight: 1.62, margin: 0 }}>
          BFS와 DFS의 차이를 설명하고, 인접 리스트를 사용해 최단 경로 문제를 해결합니다.
        </p>
        <Panel style={{ background: '#f8fafc', padding: 22 }}>
          <strong style={{ fontSize: 21 }}>공지</strong>
          <p style={{ ...styles.muted, fontSize: 19, lineHeight: 1.55, margin: '10px 0 0' }}>
            실습 제출 전 테스트 케이스 3개를 반드시 통과해야 합니다.
          </p>
        </Panel>
        <div style={{ ...styles.button, width: 240 }}>IDE에서 실습 시작</div>
      </Panel>
    </div>
  );
};

const IdeScene = ({ progress }: { progress: number }) => {
  const code = typedText(
    `from collections import deque\n\n` +
      `def bfs(graph, start):\n` +
      `    visited = set([start])\n` +
      `    queue = deque([start])\n` +
      `    order = []\n\n` +
      `    while queue:\n` +
      `        node = queue.popleft()\n` +
      `        order.append(node)\n` +
      `        for nxt in graph[node]:\n` +
      `            if nxt not in visited:\n` +
      `                visited.add(nxt)\n` +
      `                queue.append(nxt)\n` +
      `    return order`,
    (progress - 0.12) / 0.45,
  );
  const terminal =
    progress < 0.55
      ? ['$ npm run test -- bfs', '테스트 실행을 기다리는 중...']
      : progress < 0.8
        ? ['$ npm run test -- bfs', 'case 1: loading', 'case 2: loading', 'case 3: loading']
        : [
            '$ npm run test -- bfs',
            'case 1: passed',
            'case 2: passed',
            'case 3: passed',
            'submission #EDU-2048 saved',
          ];

  return (
    <div style={{ display: 'grid', gap: 22, gridTemplateColumns: '0.95fr 1.05fr', height: '100%' }}>
      <Panel>
        <PanelTitle action={<Tag tone={progress > 0.8 ? 'green' : 'amber'}>{progress > 0.8 ? '제출 완료' : '실행 중'}</Tag>}>
          실습 문제: BFS 방문 순서 구현
        </PanelTitle>
        <div style={{ display: 'grid', gap: 20, padding: 26 }}>
          <p style={{ fontSize: 23, lineHeight: 1.6, margin: 0 }}>
            그래프와 시작 정점이 주어질 때 너비 우선 탐색 순서대로 정점을 반환하세요.
          </p>
          <Panel style={{ background: '#f8fafc', padding: 18 }}>
            <strong style={{ fontSize: 20 }}>입력 예시</strong>
            <pre style={exampleCodeStyle}>A: B C{'\n'}B: D E{'\n'}C: F</pre>
          </Panel>
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <MetricCard label="테스트" value={progress > 0.8 ? '3/3' : progress > 0.55 ? '1/3' : '0/3'} />
            <MetricCard label="힌트" tone="amber" value="2" />
            <MetricCard label="점수" tone="green" value={progress > 0.8 ? '92' : '--'} />
          </div>
        </div>
      </Panel>
      <div
        style={{
          background: '#111827',
          borderRadius: 8,
          color: '#d1d5db',
          display: 'grid',
          gridTemplateRows: '52px 1fr 176px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            background: '#0b1120',
            borderBottom: '1px solid #1f2937',
            display: 'flex',
            gap: 10,
            padding: '0 16px',
          }}
        >
          <span style={codeTabStyle}>solution.py</span>
          <span style={codeTabStyle}>tests.py</span>
        </div>
        <pre style={codeStyle}>
          {code}
          <span style={{ color: '#60a5fa' }}>▌</span>
        </pre>
        <div style={terminalStyle}>
          {terminal.map((line) => (
            <div key={line} style={{ color: line.includes('passed') ? '#86efac' : line.startsWith('$') ? '#93c5fd' : '#9ca3af' }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const exampleCodeStyle: React.CSSProperties = {
  color: '#334155',
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
  fontSize: 17,
  lineHeight: 1.45,
  margin: '10px 0 0',
};

const codeStyle: React.CSSProperties = {
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
  fontSize: 20,
  lineHeight: 1.58,
  margin: 0,
  overflow: 'hidden',
  padding: '22px 26px',
  whiteSpace: 'pre-wrap',
};

const codeTabStyle: React.CSSProperties = {
  alignItems: 'center',
  background: '#1f2937',
  borderRadius: 7,
  color: '#e5e7eb',
  display: 'inline-flex',
  fontSize: 15,
  fontWeight: 800,
  height: 32,
  padding: '0 14px',
};

const terminalStyle: React.CSSProperties = {
  background: '#020617',
  borderTop: '1px solid #1f2937',
  color: '#9ca3af',
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
  fontSize: 16,
  lineHeight: 1.55,
  padding: '18px 22px',
};

const TutorScene = ({ progress }: { progress: number }) => {
  const answer =
    '현재 코드는 queue에서 꺼낸 노드를 방문 순서에 추가하는 위치가 좋아요. 다음으로는 이웃 정점을 넣을 때 visited에 먼저 추가해 중복 삽입을 막아보세요. 강의 4주차의 인접 리스트 예시와 같은 패턴입니다.';

  return (
    <div style={{ display: 'grid', gap: 22, gridTemplateColumns: '1fr 0.48fr', height: '100%' }}>
      <Panel style={{ display: 'grid', gridTemplateRows: '66px 1fr 74px' }}>
        <PanelTitle>AI 튜터 · BFS 실습</PanelTitle>
        <div style={{ display: 'grid', gap: 16, padding: 24, placeContent: 'start' }}>
          <Bubble align="right">테스트 2번에서 중복 방문이 생겨요. 어디를 봐야 하나요?</Bubble>
          {progress > 0.28 ? <Bubble>{answer}</Bubble> : null}
          {progress > 0.82 ? (
            <Bubble>정답 코드를 바로 알려주기보다는, queue에 넣는 시점과 visited 처리 시점을 직접 비교해 보세요.</Bubble>
          ) : null}
        </div>
        <div
          style={{
            alignItems: 'center',
            borderTop: `1px solid ${colors.line}`,
            display: 'grid',
            gap: 12,
            gridTemplateColumns: '1fr 52px',
            padding: 12,
          }}
        >
          <div
            style={{
              border: `1px solid ${colors.line}`,
              borderRadius: 8,
              color: '#334155',
              fontSize: 18,
              height: 50,
              padding: '13px 16px',
            }}
          >
            내 코드 기준으로 힌트 더 보기
          </div>
          <div style={{ ...styles.button, background: colors.green, height: 50, padding: 0 }}>↗</div>
        </div>
      </Panel>
      <Panel>
        <PanelTitle>참고 근거</PanelTitle>
        <div style={{ display: 'grid', gap: 14, padding: 20 }}>
          {[
            ['4주차 강의 노트', 'BFS는 큐에 넣는 순간 방문 처리한다.'],
            ['테스트 케이스 2', 'A와 B가 같은 C를 가리킬 때 중복 탐색 여부를 확인한다.'],
            ['학생 코드', 'visited.add 위치를 비교 대상으로 표시했다.'],
          ].map(([title, copy]) => (
            <Panel key={title} style={{ padding: 18 }}>
              <strong style={{ fontSize: 20 }}>{title}</strong>
              <p style={{ ...styles.muted, fontSize: 17, lineHeight: 1.48, margin: '9px 0 0' }}>
                {copy}
              </p>
            </Panel>
          ))}
        </div>
      </Panel>
    </div>
  );
};

const Bubble = ({
  align = 'left',
  children,
}: {
  align?: 'left' | 'right';
  children: React.ReactNode;
}) => {
  const isUser = align === 'right';
  return (
    <div
      style={{
        alignSelf: isUser ? 'end' : 'start',
        background: isUser ? colors.blue : '#f1f5f9',
        borderRadius: 8,
        color: isUser ? '#fff' : colors.ink,
        fontSize: 20,
        lineHeight: 1.52,
        maxWidth: '78%',
        padding: '16px 18px',
      }}
    >
      {children}
    </div>
  );
};

const StudentGradesScene = ({ progress }: { progress: number }) => {
  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 0.82fr', height: '100%' }}>
      <Panel>
        <PanelTitle>내 과제 제출 현황</PanelTitle>
        <StudentRow initials="B" meta="92점" name="BFS 실습" status="완료" />
        <StudentRow initials="D" meta="제출" name="DFS 과제" status="제출" tone="amber" />
        <StudentRow initials="R" meta="88점" name="정렬 분석" status="완료" />
      </Panel>
      <Panel style={{ display: 'grid', gap: 20, padding: 28, placeContent: 'start' }}>
        <MetricCard label="최근 피드백" progress={70 + progress * 22} tone="green" value="좋음" />
        <p style={{ ...styles.muted, fontSize: 23, lineHeight: 1.6, margin: 0 }}>
          BFS 구현은 통과했습니다. 다음 제출에서는 시간 복잡도 설명을 한 문단 더 보강하세요.
        </p>
        <div style={{ ...styles.button, width: 210 }}>피드백 반영하기</div>
      </Panel>
    </div>
  );
};

const ProfessorDashboardScene = ({ progress }: { progress: number }) => {
  return (
    <div style={{ display: 'grid', gap: 22, gridTemplateRows: 'auto 1fr', height: '100%' }}>
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <MetricCard label="운영 강의" value="3" />
        <MetricCard label="미채점 제출" tone="amber" value={`${Math.round(24 - progress * 7)}`} />
        <MetricCard label="위험 학생" tone="red" value={`${Math.round(6 - progress * 2)}`} />
      </div>
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr', minHeight: 0 }}>
        <Panel>
          <PanelTitle>최근 제출물</PanelTitle>
          {students.map(([name, assignment, score, status]) => (
            <StudentRow
              key={name}
              initials={name[0]}
              meta={score}
              name={`${name} · ${assignment}`}
              status={status}
              tone={score.includes('점') ? 'green' : 'amber'}
            />
          ))}
        </Panel>
        <Panel>
          <PanelTitle>강의 운영 알림</PanelTitle>
          <WeekRow index="1" meta="공지" status="알고리즘" title="BFS 실습 마감 18시간 전" tone="amber" />
          <WeekRow index="2" meta="위험" status="상담 필요" title="최유진 2회 연속 지연" tone="red" />
          <WeekRow index="3" meta="완료" status="32명" title="자료구조 채점 완료" tone="green" />
        </Panel>
      </div>
    </div>
  );
};

const RubricScene = ({ progress }: { progress: number }) => {
  const generated = progress > 0.36;
  const rubricItems = [
    ['큐 기반 BFS 구현', '35점'],
    ['방문 중복 방지', '25점'],
    ['시간 복잡도 설명', '20점'],
    ['테스트 케이스 통과', '20점'],
  ];

  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 0.88fr', height: '100%' }}>
      <Panel style={{ padding: 26 }}>
        <MetricCard label="자연어 평가 기준" value="루브릭 생성" />
        <div
          style={{
            border: `1px solid ${colors.line}`,
            borderRadius: 8,
            color: '#334155',
            fontSize: 20,
            lineHeight: 1.52,
            marginTop: 18,
            minHeight: 142,
            padding: 18,
          }}
        >
          학생이 BFS를 올바르게 구현했는지 평가한다. 큐 사용, 방문 처리, 시간 복잡도 설명,
          테스트 통과 여부를 각각 반영하고 코드 가독성도 확인한다.
        </div>
        <div style={{ ...styles.button, height: 52, marginTop: 16, width: 190 }}>평가 항목 생성</div>
        <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
          {rubricItems.map(([label, score], index) => (
            <div
              key={label}
              style={{
                alignItems: 'center',
                border: `1px solid ${colors.line}`,
                borderRadius: 8,
                display: 'grid',
                gap: 14,
                gridTemplateColumns: '1fr 100px',
                opacity: generated ? 1 : 0.3,
                padding: 16,
              }}
            >
              <strong style={{ fontSize: 20 }}>{label}</strong>
              <Tag tone={index === 3 ? 'green' : 'blue'}>{score}</Tag>
            </div>
          ))}
        </div>
      </Panel>
      <Panel>
        <PanelTitle action={<Tag tone="green">{generated ? '92점' : '준비'}</Tag>}>
          채점 결과 미리보기
        </PanelTitle>
        {students.map(([name, , score], index) => (
          <StudentRow
            key={name}
            initials={name[0]}
            meta={index === 1 ? '검토' : index === 3 ? '74점' : score}
            name={name}
            status={index === 3 ? '위험' : '완료'}
            tone={index === 1 ? 'amber' : 'green'}
          />
        ))}
        <p style={{ ...styles.muted, fontSize: 19, lineHeight: 1.55, margin: 0, padding: 24 }}>
          생성된 루브릭은 교수자가 수정한 뒤 저장할 수 있고, 각 항목별 피드백 문장도 함께
          제안됩니다.
        </p>
      </Panel>
    </div>
  );
};

const AnalyticsScene = ({ progress }: { progress: number }) => {
  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 0.62fr', height: '100%' }}>
      <Panel style={{ padding: 26 }}>
        <MetricCard label="참여율 추이" progress={71 + progress * 9} value={`${Math.round(71 + progress * 9)}%`} />
        <div
          style={{
            background:
              'repeating-linear-gradient(to top, #fff, #fff 70px, #edf2f7 71px)',
            border: `1px solid ${colors.line}`,
            borderRadius: 8,
            height: 380,
            marginTop: 20,
            position: 'relative',
          }}
        >
          <svg height="100%" viewBox="0 0 600 300" width="100%">
            <polyline
              fill="none"
              points="20,240 115,205 210,224 305,150 400,132 495,96 580,72"
              stroke={colors.blue}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="8"
            />
            <polyline
              fill="none"
              points="20,255 115,230 210,218 305,194 400,166 495,148 580,130"
              stroke={colors.green}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="8"
            />
          </svg>
        </div>
      </Panel>
      <Panel>
        <PanelTitle>공지와 개입 추천</PanelTitle>
        <WeekRow index="공지" meta="발송" status="읽음 83%" title="BFS 마감 리마인드" tone="blue" />
        <WeekRow index="추천" meta="검토" status="4명" title="지연 학생 대상 메시지" tone="amber" />
        <WeekRow index="분석" meta="보강" status="31%" title="테스트 2 실패율 높음" tone="green" />
        <div style={{ padding: 24 }}>
          <div style={{ ...styles.button, width: 160 }}>공지 작성</div>
        </div>
      </Panel>
    </div>
  );
};

const AdminScene = ({ progress }: { progress: number }) => {
  return (
    <div style={{ display: 'grid', gap: 22, gridTemplateRows: 'auto 1fr', height: '100%' }}>
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <MetricCard label="활성 사용자" value={`${Math.round(1248 + progress * 38)}`} />
        <MetricCard label="강의 수" tone="green" value="42" />
        <MetricCard label="API 상태" tone="green" value="정상" />
      </div>
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr', minHeight: 0 }}>
        <Panel>
          <PanelTitle>사용자 권한</PanelTitle>
          <StudentRow initials="김" meta="Student" name="김민준" status="완료" tone="blue" />
          <StudentRow initials="박" meta="Professor" name="박서연" status="완료" tone="amber" />
          <StudentRow initials="AD" meta="Admin" name="운영 관리자" status="완료" tone="red" />
        </Panel>
        <Panel>
          <PanelTitle>감사 로그</PanelTitle>
          {logs.map(([time, action, status]) => (
            <div
              key={time}
              style={{
                alignItems: 'center',
                borderBottom: `1px solid #eef2f7`,
                display: 'grid',
                gap: 16,
                gridTemplateColumns: '100px 1fr 110px',
                minHeight: 72,
                padding: '0 22px',
              }}
            >
              <span style={{ ...styles.muted, fontSize: 18 }}>{time}</span>
              <strong style={{ fontSize: 19 }}>{action}</strong>
              <Tag tone={status === '주의' ? 'amber' : 'green'}>{status}</Tag>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
};

const ClosingScene = () => {
  return (
    <div style={{ display: 'grid', height: '100%', placeItems: 'center', textAlign: 'center' }}>
      <div style={{ display: 'grid', gap: 24, maxWidth: 980 }}>
        <div style={{ ...styles.avatar, fontSize: 38, height: 88, margin: 'auto', width: 88 }}>E</div>
        <h2 style={{ ...baseText, fontSize: 70, fontWeight: 950, lineHeight: 1, margin: 0 }}>
          EduRyday Final Demo
        </h2>
        <p style={{ ...styles.muted, fontSize: 26, lineHeight: 1.55, margin: 0 }}>
          랜딩, 인증, 학생 학습, IDE 실습, AI 튜터, 루브릭 채점, 분석, 관리자 운영까지 발표용
          흐름이 준비되었습니다.
        </p>
        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 10 }}>
          <MetricCard label="핵심 역할" value="3" />
          <MetricCard label="데모 길이" tone="green" value="4:30" />
          <MetricCard label="녹음" tone="amber" value="별도" />
        </div>
      </div>
    </div>
  );
};

const SceneContent = ({ progress, scene }: { progress: number; scene: Scene }) => {
  switch (scene.key) {
    case 'landing':
      return <LandingScene progress={progress} />;
    case 'auth':
      return <AuthScene progress={progress} />;
    case 'student-dashboard':
      return <StudentDashboardScene progress={progress} />;
    case 'course':
      return <CourseScene />;
    case 'ide':
      return <IdeScene progress={progress} />;
    case 'tutor':
      return <TutorScene progress={progress} />;
    case 'student-grades':
      return <StudentGradesScene progress={progress} />;
    case 'professor-dashboard':
      return <ProfessorDashboardScene progress={progress} />;
    case 'rubric':
      return <RubricScene progress={progress} />;
    case 'analytics':
      return <AnalyticsScene progress={progress} />;
    case 'admin':
      return <AdminScene progress={progress} />;
    case 'closing':
      return <ClosingScene />;
    default:
      return null;
  }
};

const Sidebar = ({
  frame,
  scene,
  seconds,
}: {
  frame: number;
  scene: Scene;
  seconds: number;
}) => {
  const meta = roleMeta[scene.role];
  const { fps } = useVideoConfig();
  const bounce = spring({ frame: frame % Math.round(fps * 2), fps, config: { damping: 18 } });

  return (
    <aside
      style={{
        background: 'rgba(255, 255, 255, 0.86)',
        border: `1px solid ${colors.line}`,
        borderRadius: 8,
        boxShadow: '0 18px 44px rgba(15, 23, 42, 0.08)',
        display: 'grid',
        gap: 24,
        gridTemplateRows: 'auto auto 1fr',
        minHeight: 0,
        padding: 24,
      }}
    >
      <div style={{ alignItems: 'center', display: 'grid', gap: 14, gridTemplateColumns: '58px 1fr' }}>
        <div style={{ ...styles.avatar, transform: `scale(${1 + bounce * 0.02})` }}>{meta.avatar}</div>
        <div>
          <strong style={{ display: 'block', fontSize: 22 }}>{meta.name}</strong>
          <span style={{ ...styles.muted, display: 'block', fontSize: 15, marginTop: 5 }}>
            {meta.subtitle}
          </span>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {meta.nav.map((item, index) => (
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
              height: 46,
              justifyContent: 'space-between',
              padding: '0 14px',
            }}
          >
            <span>{item}</span>
            <span>›</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 8, overflow: 'hidden' }}>
        {scenes.map((item) => {
          const isActive = seconds >= item.start && seconds < item.end;
          return (
            <div
              key={item.key}
              style={{
                alignItems: 'center',
                background: isActive ? '#eaf1ff' : 'transparent',
                borderRadius: 8,
                color: isActive ? '#1d4ed8' : '#475569',
                display: 'flex',
                fontSize: 14,
                fontWeight: 800,
                height: 36,
                justifyContent: 'space-between',
                padding: '0 12px',
              }}
            >
              <span>{item.title}</span>
              <span style={{ color: isActive ? '#1d4ed8' : '#94a3b8' }}>
                {formatTime(item.start)}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export const EduRydayFinalDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = secondsFromFrame(frame, fps);
  const scene = activeScene(seconds);
  const progress = sceneProgress(scene, seconds);

  return (
    <AbsoluteFill
      style={{
        ...baseText,
        background:
          'linear-gradient(90deg, rgba(20,153,111,0.06), transparent 28%), linear-gradient(180deg, #f8fbff 0%, #eaf1f8 100%)',
        display: 'grid',
        gridTemplateRows: '82px 1fr 92px',
      }}
    >
      <header
        style={{
          alignItems: 'center',
          background: 'rgba(255,255,255,0.9)',
          borderBottom: `1px solid ${colors.line}`,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 40px',
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
          <div style={{ ...styles.avatar, background: `linear-gradient(135deg, ${colors.blue}, ${colors.green})`, height: 44, width: 44 }}>
            E
          </div>
          <span style={{ fontSize: 26, fontWeight: 950 }}>EduRyday</span>
        </div>
        <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
          <Tag tone="green">Final silent demo</Tag>
          <Tag>AI LMS · Supabase · Next.js</Tag>
        </div>
      </header>

      <main style={{ display: 'grid', gap: 24, gridTemplateColumns: '330px 1fr', padding: '26px 40px 20px' }}>
        <Sidebar frame={frame} scene={scene} seconds={seconds} />
        <div style={{ position: 'relative' }}>
          <SceneFrame progress={progress} scene={scene}>
            <SceneContent progress={progress} scene={scene} />
          </SceneFrame>
        </div>
      </main>

      <footer
        style={{
          alignItems: 'center',
          background: 'rgba(255,255,255,0.88)',
          borderTop: `1px solid ${colors.line}`,
          display: 'grid',
          gap: 24,
          gridTemplateColumns: '1fr 470px',
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
            <span>{formatTime(VIDEO_DURATION_SECONDS)}</span>
          </div>
          <div style={{ ...styles.bar, height: 10 }}>
            <div
              style={{
                background: `linear-gradient(90deg, ${colors.blue}, ${colors.green}, ${colors.amber})`,
                borderRadius: 999,
                height: '100%',
                width: `${(seconds / VIDEO_DURATION_SECONDS) * 100}%`,
              }}
            />
          </div>
        </div>
        <Panel style={{ padding: '14px 16px' }}>
          <strong style={{ display: 'block', fontSize: 17 }}>{scene.title}</strong>
          <span style={{ ...styles.muted, display: 'block', fontSize: 14, marginTop: 5 }}>
            {scene.lower}
          </span>
        </Panel>
      </footer>
    </AbsoluteFill>
  );
};
