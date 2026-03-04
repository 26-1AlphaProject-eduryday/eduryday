'use client';

import { useRouter } from 'next/navigation';

// ---------------------------------------------------------------------------
// Atoms
// ---------------------------------------------------------------------------

function LogoMark() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-200">
        <span className="text-xs text-gray-700">Logo</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-700">EduRyday</h1>
      <p className="mt-2 text-sm text-gray-500">AI 기반 통합 교육 플랫폼</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Role card
// ---------------------------------------------------------------------------

interface RoleCardProps {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  onClick: () => void;
}

function RoleCard({ icon, iconBg, title, description, onClick }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-xl border-2 border-gray-200 p-6 text-center transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
    >
      <div
        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${iconBg}`}
      >
        <span className="text-3xl" role="img" aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="mb-2 text-lg font-bold text-gray-700">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function AuthRolePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg px-4">
        <LogoMark />

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-center text-xl font-bold text-gray-700">
            어떤 역할로 시작하시나요?
          </h2>
          <p className="mb-8 text-center text-sm text-gray-500">
            역할에 맞는 기능과 UI를 제공합니다. 이후 설정에서 변경할 수 없습니다.
          </p>

          {/* Role selection grid */}
          <div className="grid grid-cols-2 gap-4">
            <RoleCard
              icon="📚"
              iconBg="bg-blue-50"
              title="학생"
              description="강좌 수강, 과제 제출, AI 튜터 이용"
              onClick={() => router.push('/student/dashboard')}
            />
            <RoleCard
              icon="🎓"
              iconBg="bg-green-50"
              title="교원"
              description="강좌 관리, 과제 출제, AI 채점"
              onClick={() => router.push('/professor/dashboard')}
            />
          </div>

          {/* Warning notice */}
          <p className="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-gray-500">
            교원 역할은 승인 후 활성화됩니다. 학교 이메일(@kookmin.ac.kr)로 인증이 필요합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
