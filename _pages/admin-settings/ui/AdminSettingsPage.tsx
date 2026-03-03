'use client';

import { useState } from 'react';
import { AdminHeader } from '@/widgets/header';
import { AdminSidebar } from '@/widgets/sidebar';
import { Button, Input } from '@/shared/ui';

type TabId = 'ai' | 'security' | 'notifications' | 'storage';

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'ai', label: 'AI 설정' },
  { id: 'security', label: '보안 설정' },
  { id: 'notifications', label: '알림 설정' },
  { id: 'storage', label: '저장소 설정' },
];

function AISettingsTab() {
  return (
    <div className="space-y-6">
      <section aria-label="AI 모델 설정">
        <h2 className="mb-4 text-base font-semibold text-gray-900">AI 모델 설정</h2>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="ai-model" className="text-sm font-medium text-gray-700">
              AI 모델 선택
            </label>
            <select
              id="ai-model"
              className="w-72 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
              defaultValue="claude"
            >
              <option value="claude">Claude (Anthropic)</option>
              <option value="gpt-4o">GPT-4o (OpenAI)</option>
              <option value="gemini">Gemini (Google)</option>
            </select>
            <p className="text-xs text-gray-500">학생 AI 튜터 및 자동 채점에 사용할 모델</p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="max-questions" className="text-sm font-medium text-gray-700">
              최대 질문 수 / 월
            </label>
            <input
              id="max-questions"
              type="number"
              defaultValue={200}
              min={1}
              className="w-36 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <p className="text-xs text-gray-500">학생 1인당 월간 AI 질문 허용 횟수</p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="hint-level" className="text-sm font-medium text-gray-700">
              힌트 레벨
            </label>
            <select
              id="hint-level"
              className="w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
              defaultValue="moderate"
            >
              <option value="minimal">최소 (방향만 제시)</option>
              <option value="moderate">보통 (단계별 힌트)</option>
              <option value="detailed">상세 (구체적 가이드)</option>
            </select>
            <p className="text-xs text-gray-500">AI 튜터가 제공하는 힌트의 상세 수준</p>
          </div>
        </div>
      </section>

      <section aria-label="API 키 설정">
        <h2 className="mb-4 text-base font-semibold text-gray-900">API 키 설정</h2>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="claude-api-key" className="text-sm font-medium text-gray-700">
              Claude API 키
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="claude-api-key"
                type="password"
                placeholder="sk-ant-••••••••••••••••••••••"
                defaultValue="sk-ant-api03-xxxxxxxxxxxxxxxxxxxx"
                className="w-80"
              />
              <Button variant="secondary" size="sm">변경</Button>
            </div>
            <p className="text-xs text-gray-500">Anthropic Console에서 발급받은 API 키</p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="openai-api-key" className="text-sm font-medium text-gray-700">
              OpenAI API 키
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="openai-api-key"
                type="password"
                placeholder="sk-••••••••••••••••••••••"
                className="w-80"
              />
              <Button variant="secondary" size="sm">변경</Button>
            </div>
            <p className="text-xs text-gray-500">OpenAI Platform에서 발급받은 API 키</p>
          </div>
        </div>
      </section>
    </div>
  );
}

interface ToggleProps {
  id: string;
  defaultChecked?: boolean;
  label: string;
  description?: string;
}

function Toggle({ id, defaultChecked = false, label, description }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description ? <p className="mt-0.5 text-xs text-gray-500">{description}</p> : null}
      </div>
      <label htmlFor={id} className="relative inline-flex cursor-pointer items-center">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          defaultChecked={defaultChecked}
          aria-label={label}
        />
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-800 peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-gray-300" />
      </label>
    </div>
  );
}

function SecuritySettingsTab() {
  return (
    <div className="space-y-6">
      <section aria-label="세션 설정">
        <h2 className="mb-4 text-base font-semibold text-gray-900">세션 설정</h2>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="session-timeout" className="text-sm font-medium text-gray-700">
              세션 타임아웃 (분)
            </label>
            <input
              id="session-timeout"
              type="number"
              defaultValue={60}
              min={5}
              max={480}
              className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <p className="text-xs text-gray-500">비활성 상태 유지 시 자동 로그아웃 시간</p>
          </div>
        </div>
      </section>

      <section aria-label="비밀번호 정책">
        <h2 className="mb-4 text-base font-semibold text-gray-900">비밀번호 정책</h2>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="min-password-length" className="text-sm font-medium text-gray-700">
              최소 비밀번호 길이
            </label>
            <input
              id="min-password-length"
              type="number"
              defaultValue={8}
              min={6}
              max={32}
              className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div className="space-y-3 pt-2">
            <Toggle
              id="require-uppercase"
              defaultChecked
              label="대문자 포함 필수"
              description="비밀번호에 영문 대문자를 포함해야 합니다"
            />
            <Toggle
              id="require-number"
              defaultChecked
              label="숫자 포함 필수"
              description="비밀번호에 숫자를 포함해야 합니다"
            />
            <Toggle
              id="require-special"
              label="특수문자 포함 필수"
              description="비밀번호에 특수문자를 포함해야 합니다"
            />
          </div>
        </div>
      </section>

      <section aria-label="인증 설정">
        <h2 className="mb-4 text-base font-semibold text-gray-900">인증 설정</h2>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <Toggle
            id="require-2fa"
            label="2FA 필수 여부"
            description="모든 사용자에게 2단계 인증을 강제 적용합니다"
          />
          <Toggle
            id="allow-social-login"
            defaultChecked
            label="소셜 로그인 허용"
            description="Google 등 소셜 계정으로 로그인을 허용합니다"
          />
        </div>
      </section>
    </div>
  );
}

function NotificationsSettingsTab() {
  return (
    <div className="space-y-6">
      <section aria-label="알림 채널">
        <h2 className="mb-4 text-base font-semibold text-gray-900">알림 채널</h2>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <Toggle
            id="email-notifications"
            defaultChecked
            label="이메일 알림"
            description="과제 마감, 성적 공지 등 이메일 알림 발송"
          />
          <Toggle
            id="push-notifications"
            defaultChecked
            label="브라우저 푸시 알림"
            description="브라우저 알림 권한이 있는 사용자에게 실시간 알림 전송"
          />
          <Toggle
            id="sms-notifications"
            label="SMS 알림"
            description="중요 알림을 문자 메시지로 발송 (별도 비용 발생)"
          />
        </div>
      </section>

      <section aria-label="알림 이벤트">
        <h2 className="mb-4 text-base font-semibold text-gray-900">알림 이벤트</h2>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <Toggle
            id="notify-assignment-deadline"
            defaultChecked
            label="과제 마감 임박 알림"
            description="마감 24시간 전 학생에게 알림 발송"
          />
          <Toggle
            id="notify-grading-complete"
            defaultChecked
            label="채점 완료 알림"
            description="AI 채점 또는 교수 채점 완료 시 학생에게 알림"
          />
          <Toggle
            id="notify-system-error"
            defaultChecked
            label="시스템 오류 알림"
            description="관리자에게 시스템 오류 발생 시 즉시 알림"
          />
        </div>
      </section>
    </div>
  );
}

function StorageSettingsTab() {
  return (
    <div className="space-y-6">
      <section aria-label="파일 업로드 설정">
        <h2 className="mb-4 text-base font-semibold text-gray-900">파일 업로드 설정</h2>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="max-file-size" className="text-sm font-medium text-gray-700">
              최대 파일 크기 (MB)
            </label>
            <input
              id="max-file-size"
              type="number"
              defaultValue={50}
              min={1}
              className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <p className="text-xs text-gray-500">과제 제출 및 강의 자료 업로드 최대 크기</p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="allowed-extensions" className="text-sm font-medium text-gray-700">
              허용 파일 확장자
            </label>
            <input
              id="allowed-extensions"
              type="text"
              defaultValue=".pdf, .docx, .pptx, .zip, .py, .js, .java"
              className="w-96 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <p className="text-xs text-gray-500">쉼표로 구분하여 허용 확장자를 입력하세요</p>
          </div>
        </div>
      </section>

      <section aria-label="저장소 현황">
        <h2 className="mb-4 text-base font-semibold text-gray-900">저장소 현황</h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">사용 중</span>
            <span className="text-gray-500">47.3 GB / 100 GB</span>
          </div>
          <div
            className="h-3 w-full overflow-hidden rounded-full bg-gray-200"
            role="progressbar"
            aria-valuenow={47}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="저장소 사용률 47%"
          >
            <div className="h-full w-[47%] rounded-full bg-blue-500 transition-all" />
          </div>
          <p className="mt-2 text-xs text-gray-500">52.7 GB 남음</p>
        </div>
      </section>
    </div>
  );
}

const TAB_CONTENT: Record<TabId, React.ReactNode> = {
  ai: <AISettingsTab />,
  security: <SecuritySettingsTab />,
  notifications: <NotificationsSettingsTab />,
  storage: <StorageSettingsTab />,
};

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('ai');

  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar activeItem="시스템 설정" />

        <main className="flex-1 bg-gray-50 p-8">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">시스템 설정</h1>
            <p className="mt-1 text-sm text-gray-500">플랫폼 전반의 설정을 관리합니다</p>
          </div>

          {/* Tab navigation */}
          <div
            className="mb-6 flex border-b border-gray-200"
            role="tablist"
            aria-label="설정 탭"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-gray-800 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-label={TABS.find((t) => t.id === activeTab)?.label}
          >
            {TAB_CONTENT[activeTab]}
          </div>

          {/* Save button */}
          <div className="mt-8 flex justify-end">
            <Button size="md">설정 저장</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
