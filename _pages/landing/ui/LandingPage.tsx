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

function HeroSection() {
  return (
    <section className="px-8 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-12">
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
              className="rounded-lg bg-gray-900 px-8 py-4 text-lg font-medium !text-white transition-colors hover:bg-gray-800"
            >
              무료로 시작하기
            </Link>
            <Link
              href="#features"
              className="rounded-lg border border-gray-300 bg-white px-8 py-4 text-lg text-gray-700 transition-colors hover:bg-gray-100"
            >
              데모 보기
            </Link>
          </div>
        </div>

        <div className="relative h-96 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-slate-100 via-white to-gray-200">
          <div className="absolute -left-8 top-10 h-44 w-44 rounded-full bg-blue-200/50 blur-2xl" />
          <div className="absolute right-8 top-16 h-32 w-32 rounded-full bg-emerald-200/50 blur-2xl" />
          <div className="absolute bottom-6 left-8 right-8 rounded-xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div className="mb-2 h-3 w-28 rounded bg-gray-300" />
            <div className="mb-3 h-2 w-full rounded bg-gray-200" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 rounded-lg bg-gray-100" />
              <div className="h-20 rounded-lg bg-gray-100" />
            </div>
          </div>
        </div>
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
          <div className="grid grid-cols-3 gap-8">
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
          <div className="mx-auto grid max-w-5xl grid-cols-5 gap-6">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="mx-auto mb-3 h-16 w-16 rounded-full border-2 border-dashed border-gray-300 bg-gray-200" />
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
        <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8 text-center">
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
