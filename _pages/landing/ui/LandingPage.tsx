import Link from 'next/link';
import { LandingHeader } from '@/widgets/header';
import {
  getLandingFaq,
  getLandingFeatures,
  getLandingStats,
  getLandingTeam,
  type LandingFaqRecord,
  type LandingFeatureRecord,
  type LandingStatRecord,
  type LandingTeamRecord,
} from '@/shared/lib/supabase/ui-seed';

// ---------------------------------------------------------------------------
// Sub-sections
// ---------------------------------------------------------------------------

function ProductPreview() {
  const navItems = ['대시보드', '강좌', '과제', 'AI 튜터'];
  const courseItems = [
    { title: '알고리즘 기초', progress: 68, meta: '3주차 · 정렬' },
    { title: '자료구조', progress: 42, meta: '스택과 큐 실습' },
  ];

  return (
    <div
      id="product-preview"
      className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
      aria-label="EduRyday 제품 화면 미리보기"
    >
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-xs font-medium text-gray-500">eduryday.app/student/dashboard</span>
      </div>

      <div className="grid min-h-[430px] grid-cols-[104px_1fr] bg-gray-50 sm:grid-cols-[132px_1fr]">
        <aside className="border-r border-gray-200 bg-white px-3 py-4">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-900 text-xs font-bold text-white">
              E
            </div>
            <span className="hidden text-sm font-bold text-gray-900 sm:inline">EduRyday</span>
          </div>
          <nav className="space-y-1" aria-label="미리보기 메뉴">
            {navItems.map((item, index) => (
              <div
                key={item}
                className={`rounded-md px-2 py-2 text-xs font-medium ${
                  index === 0 ? 'bg-gray-900 text-white' : 'text-gray-500'
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-blue-600">오늘의 학습</p>
              <h2 className="text-lg font-bold text-gray-900">정렬 알고리즘 실습</h2>
            </div>
            <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
              D-2
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2">
            {[
              ['수강 강좌', '4개'],
              ['평균 점수', '87점'],
              ['AI 질문', '12건'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-gray-200 bg-white p-3">
                <p className="text-[11px] text-gray-500">{label}</p>
                <p className="mt-1 text-base font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 lg:grid-cols-[0.88fr_1.12fr]">
            <section className="space-y-3">
              {courseItems.map((course) => (
                <div key={course.title} className="rounded-md border border-gray-200 bg-white p-3">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{course.title}</h3>
                      <p className="mt-0.5 text-xs text-gray-500">{course.meta}</p>
                    </div>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                      진행중
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              ))}

              <div className="rounded-md border border-gray-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">AI 튜터</h3>
                  <span className="text-[11px] text-gray-400">실시간</span>
                </div>
                <div className="space-y-2 text-xs">
                  <p className="rounded-md bg-gray-100 px-3 py-2 text-gray-700">퀵 정렬 기준값은 어떻게 잡나요?</p>
                  <p className="ml-5 rounded-md bg-blue-50 px-3 py-2 text-blue-800">
                    먼저 분할 기준과 최악 케이스를 비교해보세요.
                  </p>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-md border border-gray-800 bg-gray-950">
              <div className="flex items-center justify-between border-b border-gray-800 px-3 py-2">
                <span className="text-xs font-medium text-gray-200">Split-View IDE</span>
                <span className="rounded bg-green-500 px-2 py-0.5 text-[11px] font-semibold text-white">3/3 통과</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_0.82fr]">
                <pre className="min-h-[188px] overflow-hidden p-3 text-[11px] leading-5 text-gray-200">
{`def sort_numbers(items):
    if len(items) <= 1:
        return items

    pivot = items[len(items) // 2]
    left = [n for n in items if n < pivot]
    mid = [n for n in items if n == pivot]
    right = [n for n in items if n > pivot]
    return sort_numbers(left) + mid + sort_numbers(right)`}
                </pre>
                <div className="border-t border-gray-800 bg-gray-900 p-3 sm:border-l sm:border-t-0">
                  <h3 className="mb-2 text-xs font-semibold text-gray-200">자동 채점</h3>
                  <div className="space-y-2">
                    {['기본 케이스', '중복 값', '빈 배열'].map((test) => (
                      <div key={test} className="flex items-center justify-between rounded bg-gray-800 px-2 py-1.5">
                        <span className="text-[11px] text-gray-300">{test}</span>
                        <span className="text-[11px] font-semibold text-green-400">PASS</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="px-6 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left: copy */}
        <div>
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            AI와 함께하는
            <br />
            차세대 코딩 교육
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            강의, 실습, 채점이 하나로 통합된
            <br />
            올인원 교육 플랫폼
          </p>
          <div className="flex gap-4">
            <Link
              href="/signup"
              className="rounded-lg bg-gray-900 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-gray-800"
            >
              무료로 시작하기
            </Link>
            <Link
              href="#product-preview"
              className="rounded-lg border border-gray-300 bg-white px-8 py-4 text-lg text-gray-700 transition-colors hover:bg-gray-100"
            >
              데모 보기
            </Link>
          </div>
        </div>

        <ProductPreview />
      </div>
    </section>
  );
}

function FeaturesSection({ features }: { features: LandingFeatureRecord[] }) {
  return (
    <section id="features" className="bg-gray-50 px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">핵심 기능</h2>
        <p className="mb-12 text-center text-gray-600">분절된 학습 환경을 하나로 통합합니다</p>

        {features.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-8"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-lg">
                  <span aria-hidden="true">✦</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">기능 소개 데이터가 준비 중입니다.</p>
        )}
      </div>
    </section>
  );
}

function TeamSection({ team }: { team: LandingTeamRecord[] }) {
  return (
    <section id="team" className="bg-white px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">팀 소개</h2>
        <p className="mb-12 text-center text-gray-500">
          국민대학교 소프트웨어학과 팀원들이 만들어갑니다
        </p>

        {team.length > 0 ? (
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-gray-300" />
                <div className="font-bold text-gray-900">{member.name}</div>
                <div className="mt-1 text-sm text-gray-500">{member.role}</div>
                <div className="mt-1 text-xs text-gray-500">{member.description}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">팀 소개 데이터가 준비 중입니다.</p>
        )}
      </div>
    </section>
  );
}

function StatsSection({ stats }: { stats: LandingStatRecord[] }) {
  return (
    <section className="px-8 py-16">
      {stats.length > 0 ? (
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 text-center sm:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-500">
          통계 데이터가 준비 중입니다.
        </div>
      )}
    </section>
  );
}

function FaqSection({ faq }: { faq: LandingFaqRecord[] }) {
  return (
    <section id="faq" className="bg-gray-50 px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">자주 묻는 질문</h2>
        <p className="mb-12 text-center text-gray-500">
          궁금한 점이 있으시면 언제든 문의해주세요
        </p>

        {faq.length > 0 ? (
          <div className="mx-auto max-w-3xl space-y-4">
            {faq.map((item) => (
              <div
                key={item.question}
                className="rounded-xl border border-gray-200 bg-white px-6 py-5"
              >
                <div className="flex items-start">
                  <span className="mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-white">
                    Q
                  </span>
                  <span className="font-medium text-gray-900">{item.question}</span>
                </div>
                <p className="ml-9 mt-3 text-sm leading-6 text-gray-500">{item.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">FAQ 데이터가 준비 중입니다.</p>
        )}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="bg-gray-800 px-8 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">지금 시작하세요</h2>
        <p className="mb-8 text-gray-200">국민대학교 학생이라면 무료로 사용할 수 있습니다</p>
        <Link
          href="/signup"
          className="rounded-lg bg-white px-8 py-4 text-lg font-medium text-gray-900 transition-colors hover:bg-gray-100"
        >
          무료로 시작하기
        </Link>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="border-t border-gray-200 px-8 py-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="text-gray-700">
          <div className="mb-2 font-bold">EduRyday</div>
          <div className="text-sm">국민대학교 소프트웨어학과</div>
          <div className="text-sm">알파프로젝트 2026-1</div>
        </div>
        <div className="text-sm text-gray-700">© 2026 EduRyday. All rights reserved.</div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
        <Link href="/privacy" className="hover:text-gray-900 hover:underline">개인정보처리방침</Link>
        <span aria-hidden="true">|</span>
        <Link href="/terms" className="hover:text-gray-900 hover:underline">이용약관</Link>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export async function LandingPage() {
  const [features, stats, team, faq] = await Promise.all([
    getLandingFeatures(),
    getLandingStats(),
    getLandingTeam(),
    getLandingFaq(),
  ]);

  return (
    <div className="bg-white">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection features={features} />
      <TeamSection team={team} />
      <StatsSection stats={stats} />
      <FaqSection faq={faq} />
      <CtaSection />
      <FooterSection />
    </div>
  );
}
