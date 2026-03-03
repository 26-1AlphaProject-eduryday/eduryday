import Link from 'next/link';
import { LandingHeader } from '@/widgets/header';
import { LANDING_FEATURES, LANDING_STATS, LANDING_TEAM, LANDING_FAQ } from '@/shared/config/landing';

// ---------------------------------------------------------------------------
// Sub-sections
// ---------------------------------------------------------------------------

function HeroSection() {
  return (
    <section className="px-8 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-12">
        {/* Left: copy */}
        <div>
          <h1 className="mb-6 text-5xl font-bold text-gray-700">
            AI와 함께하는
            <br />
            차세대 코딩 교육
          </h1>
          <p className="mb-8 text-xl text-gray-700">
            강의, 실습, 채점이 하나로 통합된
            <br />
            올인원 교육 플랫폼
          </p>
          <div className="flex gap-4">
            <Link
              href="/signup"
              className="rounded-lg bg-gray-800 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-gray-700"
            >
              무료로 시작하기
            </Link>
            <Link
              href="#features"
              className="rounded-lg border border-gray-400 px-8 py-4 text-lg text-gray-700 transition-colors hover:bg-gray-50"
            >
              데모 보기
            </Link>
          </div>
        </div>

        {/* Right: placeholder image */}
        <div className="flex h-96 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-200">
          <span className="text-lg text-gray-700">[Hero Image / Screenshot]</span>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="bg-gray-50 px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-700">핵심 기능</h2>
        <p className="mb-12 text-center text-gray-700">분절된 학습 환경을 하나로 통합합니다</p>

        <div className="grid grid-cols-3 gap-8">
          {LANDING_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-8"
            >
              {/* Icon placeholder */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-200">
                <span className="text-xs text-gray-700">icon</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-700">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section id="team" className="bg-white px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-700">팀 소개</h2>
        <p className="mb-12 text-center text-gray-500">
          국민대학교 소프트웨어학과 팀원들이 만들어갑니다
        </p>

        <div className="mx-auto grid max-w-5xl grid-cols-5 gap-6">
          {LANDING_TEAM.map((member) => (
            <div key={member.name} className="text-center">
              <div className="mx-auto mb-3 h-16 w-16 rounded-full border-2 border-dashed border-gray-300 bg-gray-200" />
              <div className="font-bold text-gray-700">{member.name}</div>
              <div className="mt-1 text-sm text-gray-500">{member.role}</div>
              <div className="mt-1 text-xs text-gray-400">{member.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="px-8 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8 text-center">
        {LANDING_STATS.map((stat) => (
          <div key={stat.label}>
            <div className="text-4xl font-bold text-gray-700">{stat.value}</div>
            <div className="text-gray-700">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="bg-gray-50 px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-700">자주 묻는 질문</h2>
        <p className="mb-12 text-center text-gray-500">
          궁금한 점이 있으시면 언제든 문의해주세요
        </p>

        <div className="mx-auto max-w-3xl space-y-4">
          {LANDING_FAQ.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-gray-200 bg-white px-6 py-5"
            >
              <div className="flex items-start">
                <span className="mr-3 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-white">
                  Q
                </span>
                <span className="font-medium text-gray-700">{item.question}</span>
              </div>
              <p className="ml-9 mt-3 text-sm leading-6 text-gray-500">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="bg-gray-800 px-8 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">지금 시작하세요</h2>
        <p className="mb-8 text-gray-300">국민대학교 학생이라면 무료로 사용할 수 있습니다</p>
        <Link
          href="/signup"
          className="rounded-lg bg-white px-8 py-4 text-lg font-medium text-gray-800 transition-colors hover:bg-gray-100"
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

export function LandingPage() {
  return (
    <div className="bg-white">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <TeamSection />
      <StatsSection />
      <FaqSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
}
