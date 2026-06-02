'use client';

import { useEffect, useState } from 'react';
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

interface AISettings {
  model?: string;
  maxQuestions?: number;
  hintLevel?: string;
}

interface SecuritySettings {
  sessionTimeout?: number;
  minPasswordLength?: number;
  requireUppercase?: boolean;
  requireNumber?: boolean;
  requireSpecial?: boolean;
  require2fa?: boolean;
  allowSocialLogin?: boolean;
}

interface NotificationSettings {
  email?: boolean;
  push?: boolean;
  sms?: boolean;
  assignmentDeadline?: boolean;
  gradingComplete?: boolean;
  systemError?: boolean;
}

interface StorageSettings {
  maxFileSize?: number;
  allowedExtensions?: string;
}

function AISettingsTab({ settings = {} }: { settings?: AISettings }) {
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
              defaultValue={settings.model ?? 'openrouter'}
            >
              <option value="openrouter">OpenRouter</option>
              <option value="gpt-4o">OpenAI GPT-4o</option>
              <option value="claude">Claude</option>
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
              defaultValue={settings.maxQuestions ?? 100}
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
              defaultValue={settings.hintLevel ?? 'moderate'}
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
              AI API 키
            </label>
            <Input
              id="ai-api-key-note"
              value="OPENROUTER_API_KEY 서버 환경변수로 관리됩니다"
              className="w-96"
              disabled
              readOnly
            />
            <p className="text-xs text-gray-500">보안상 API 키는 브라우저 설정 화면에 저장하지 않습니다</p>
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
          className="peer sr-only"
          defaultChecked={defaultChecked}
          aria-label={label}
        />
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-800 peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-gray-300" />
      </label>
    </div>
  );
}

function SecuritySettingsTab({ settings = {} }: { settings?: SecuritySettings }) {
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
              defaultValue={settings.sessionTimeout ?? 60}
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
              defaultValue={settings.minPasswordLength ?? 8}
              min={6}
              max={32}
              className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div className="space-y-3 pt-2">
            <Toggle
              id="require-uppercase"
              defaultChecked={settings.requireUppercase ?? true}
              label="대문자 포함 필수"
              description="비밀번호에 영문 대문자를 포함해야 합니다"
            />
            <Toggle
              id="require-number"
              defaultChecked={settings.requireNumber ?? true}
              label="숫자 포함 필수"
              description="비밀번호에 숫자를 포함해야 합니다"
            />
            <Toggle
              id="require-special"
              defaultChecked={settings.requireSpecial ?? false}
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
            defaultChecked={settings.require2fa ?? false}
            label="2FA 필수 여부"
            description="모든 사용자에게 2단계 인증을 강제 적용합니다"
          />
          <Toggle
            id="allow-social-login"
            defaultChecked={settings.allowSocialLogin ?? true}
            label="소셜 로그인 허용"
            description="Google 등 소셜 계정으로 로그인을 허용합니다"
          />
        </div>
      </section>
    </div>
  );
}

function NotificationsSettingsTab({ settings = {} }: { settings?: NotificationSettings }) {
  return (
    <div className="space-y-6">
      <section aria-label="알림 채널">
        <h2 className="mb-4 text-base font-semibold text-gray-900">알림 채널</h2>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <Toggle
            id="email-notifications"
            defaultChecked={settings.email ?? true}
            label="이메일 알림"
            description="과제 마감, 성적 공지 등 이메일 알림 발송"
          />
          <Toggle
            id="push-notifications"
            defaultChecked={settings.push ?? true}
            label="브라우저 푸시 알림"
            description="브라우저 알림 권한이 있는 사용자에게 실시간 알림 전송"
          />
          <Toggle
            id="sms-notifications"
            defaultChecked={settings.sms ?? false}
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
            defaultChecked={settings.assignmentDeadline ?? true}
            label="과제 마감 임박 알림"
            description="마감 24시간 전 학생에게 알림 발송"
          />
          <Toggle
            id="notify-grading-complete"
            defaultChecked={settings.gradingComplete ?? true}
            label="채점 완료 알림"
            description="AI 채점 또는 교수 채점 완료 시 학생에게 알림"
          />
          <Toggle
            id="notify-system-error"
            defaultChecked={settings.systemError ?? true}
            label="시스템 오류 알림"
            description="관리자에게 시스템 오류 발생 시 즉시 알림"
          />
        </div>
      </section>
    </div>
  );
}

function StorageSettingsTab({ settings = {} }: { settings?: StorageSettings }) {
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
              defaultValue={settings.maxFileSize ?? 10}
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
              defaultValue={settings.allowedExtensions ?? '.pdf, .docx, .pptx, .zip, .py, .js, .java'}
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

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('ai');
  const [saveMessage, setSaveMessage] = useState('');
  const [settings, setSettings] = useState<Record<string, unknown>>({});

  useEffect(() => {
    fetch('/api/v1/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.settings) {
          setSettings(data.data.settings);
        }
      })
      .catch(() => {
        // non-blocking: settings will remain empty defaults
      });
  }, []);

  function getInputValue(id: string, fallback = '') {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
    return el?.value ?? fallback;
  }

  function getNumberValue(id: string, fallback: number) {
    const value = Number(getInputValue(id, String(fallback)));
    return Number.isFinite(value) ? value : fallback;
  }

  function getChecked(id: string, fallback: boolean) {
    const el = document.getElementById(id) as HTMLInputElement | null;
    return el?.checked ?? fallback;
  }

  async function handleSave() {
    const payload: Record<string, unknown> = { ...settings };

    if (activeTab === 'ai') {
      payload.ai = {
        model: getInputValue('ai-model', 'openrouter'),
        maxQuestions: getNumberValue('max-questions', 100),
        hintLevel: getInputValue('hint-level', 'moderate'),
      };
    }

    if (activeTab === 'security') {
      payload.security = {
        sessionTimeout: getNumberValue('session-timeout', 60),
        minPasswordLength: getNumberValue('min-password-length', 8),
        requireUppercase: getChecked('require-uppercase', true),
        requireNumber: getChecked('require-number', true),
        requireSpecial: getChecked('require-special', false),
        require2fa: getChecked('require-2fa', false),
        allowSocialLogin: getChecked('allow-social-login', true),
      };
    }

    if (activeTab === 'notifications') {
      payload.notifications = {
        email: getChecked('email-notifications', true),
        push: getChecked('push-notifications', true),
        sms: getChecked('sms-notifications', false),
        assignmentDeadline: getChecked('notify-assignment-deadline', true),
        gradingComplete: getChecked('notify-grading-complete', true),
        systemError: getChecked('notify-system-error', true),
      };
    }

    if (activeTab === 'storage') {
      payload.storage = {
        maxFileSize: getNumberValue('max-file-size', 10),
        allowedExtensions: getInputValue('allowed-extensions', '.pdf, .docx, .pptx, .zip, .py, .js, .java'),
      };
    }

    try {
      const res = await fetch('/api/v1/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSettings(payload);
        setSaveMessage('설정이 저장되었습니다.');
      } else {
        setSaveMessage('저장에 실패했습니다.');
      }
    } catch {
      setSaveMessage('저장에 실패했습니다.');
    }
    setTimeout(() => setSaveMessage(''), 3000);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar />

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
            {activeTab === 'ai' ? <AISettingsTab settings={settings.ai as AISettings | undefined} /> : null}
            {activeTab === 'security' ? <SecuritySettingsTab settings={settings.security as SecuritySettings | undefined} /> : null}
            {activeTab === 'notifications' ? <NotificationsSettingsTab settings={settings.notifications as NotificationSettings | undefined} /> : null}
            {activeTab === 'storage' ? <StorageSettingsTab settings={settings.storage as StorageSettings | undefined} /> : null}
          </div>

          {/* Save button */}
          <div className="mt-8 flex items-center justify-end gap-4">
            {saveMessage ? (
              <p className={`text-sm ${saveMessage.includes('실패') ? 'text-red-600' : 'text-green-600'}`}>
                {saveMessage}
              </p>
            ) : null}
            <Button size="md" onClick={handleSave}>설정 저장</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
