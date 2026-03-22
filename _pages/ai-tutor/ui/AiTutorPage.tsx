'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { UIMessage } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import { StudentHeader } from '@/widgets/header';
import { StudentSidebar } from '@/widgets/sidebar';

interface ConversationItem {
  id: string;
  title: string;
  messageCount: number;
  updatedAt: string;
}

function getMessageText(message: UIMessage): string {
  for (const part of message.parts) {
    if (part.type === 'text') return part.text;
  }
  return '';
}

export function AiTutorPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [aiAvailable, setAiAvailable] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const { messages, sendMessage, setMessages, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/v1/chat',
      prepareSendMessagesRequest: ({ messages: msgs, body, ...rest }) => ({
        ...rest,
        body: { ...body, messages: msgs, conversationId: activeConversationId },
      }),
    }),
    onFinish: async ({ message, messages: allMessages }) => {
      const convId = activeConversationId;
      if (convId) {
        const firstUserMsg = allMessages.find((m) => m.role === 'user');
        await fetch(`/api/v1/conversations/${convId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: allMessages,
            title:
              allMessages.length <= 2 && firstUserMsg
                ? getMessageText(firstUserMsg).slice(0, 30) + '...'
                : undefined,
          }),
        });
        loadConversations();
      }
    },
    onError: (err) => {
      if (err.message.includes('설정되지 않았습니다')) {
        setAiAvailable(false);
      }
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadConversations() {
    const res = await fetch('/api/v1/conversations', { cache: 'no-store' });
    const json = await res.json();
    if (json.ok) {
      setConversations(
        (json.data.conversations ?? []).map(
          (c: { id: string; title: string; message_count: number; updated_at?: string }) => ({
            id: c.id,
            title: c.title,
            messageCount: c.message_count,
            updatedAt: c.updated_at?.replace('T', ' ').slice(0, 16) ?? '',
          })
        )
      );
    }
    setSidebarLoading(false);
  }

  async function handleNewConversation() {
    const res = await fetch('/api/v1/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '새 대화' }),
    });
    const json = await res.json();
    if (json.ok) {
      setActiveConversationId(json.data.id);
      setMessages([]);
      await loadConversations();
    }
  }

  async function handleSelectConversation(id: string) {
    setActiveConversationId(id);
    const res = await fetch(`/api/v1/conversations/${id}`, { cache: 'no-store' });
    const json = await res.json();
    if (json.ok && json.data.conversation.messages) {
      setMessages(json.data.conversation.messages);
    }
  }

  async function handleDeleteConversation(id: string) {
    await fetch(`/api/v1/conversations/${id}`, { method: 'DELETE' });
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setMessages([]);
    }
    await loadConversations();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue('');
    sendMessage({ text });
  }

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <div className="flex h-screen flex-col bg-white">
      <StudentHeader />
      <div className="flex flex-1 overflow-hidden">
        {/* Student nav sidebar */}
        <StudentSidebar />

        {/* Conversation list sidebar */}
        <aside className="hidden w-72 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
          <div className="border-b border-gray-200 p-4">
            <button
              type="button"
              onClick={handleNewConversation}
              className="w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              + 새 대화 시작
            </button>
          </div>

          <nav className="flex-1 overflow-auto p-3" aria-label="대화 목록">
            <p className="mb-3 px-1 text-xs font-medium text-gray-500">최근 대화</p>
            {sidebarLoading ? (
              <div className="space-y-2 px-1">
                <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="px-1 text-xs text-gray-400">대화가 없습니다</p>
            ) : (
              <ul className="space-y-1">
                {conversations.map((conv) => (
                  <li key={conv.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        activeConversationId === conv.id
                          ? 'border border-blue-200 bg-blue-50 text-blue-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{conv.title}</p>
                        <p className="text-xs text-gray-400">{conv.messageCount}개 메시지</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteConversation(conv.id)}
                      className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-red-500 group-hover:block"
                      aria-label="대화 삭제"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </nav>
        </aside>

        {/* Chat area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {!aiAvailable ? (
            <div className="flex flex-1 items-center justify-center p-8">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h2 className="mb-2 text-lg font-bold text-gray-900">AI 튜터 서비스 준비 중</h2>
                <p className="text-sm text-gray-500">
                  AI 서비스 API 키가 설정되지 않았습니다.
                  <br />
                  관리자에게 ANTHROPIC_API_KEY 설정을 요청해주세요.
                </p>
              </div>
            </div>
          ) : !activeConversationId ? (
            <div className="flex flex-1 items-center justify-center p-8">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <span className="text-2xl">AI</span>
                </div>
                <h2 className="mb-2 text-lg font-bold text-gray-900">AI 튜터에게 질문하세요</h2>
                <p className="mb-6 text-sm text-gray-500">
                  코딩 실습, 알고리즘 개념, 과제 힌트 등
                  <br />
                  학습에 관한 모든 질문에 답변합니다.
                </p>
                <button
                  type="button"
                  onClick={handleNewConversation}
                  className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                  새 대화 시작하기
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-auto p-6" role="log" aria-label="AI 튜터 대화">
                <div className="mx-auto max-w-3xl space-y-6">
                  {messages.length === 0 && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                      AI 튜터에게 질문을 입력하세요. 정답을 직접 알려주지 않고 힌트와 설명으로
                      도와드립니다.
                    </div>
                  )}

                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {m.role === 'assistant' && (
                        <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">
                          AI
                        </div>
                      )}
                      <div
                        className={`max-w-lg rounded-2xl px-4 py-3 text-sm ${
                          m.role === 'user'
                            ? 'rounded-tr-sm bg-gray-800 text-white'
                            : 'rounded-tl-sm bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{getMessageText(m)}</div>
                      </div>
                      {m.role === 'user' && (
                        <div className="ml-3 h-8 w-8 shrink-0 rounded-full bg-gray-300" />
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-start">
                      <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">
                        AI
                      </div>
                      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3">
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: '0ms' }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error.message}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <form
                  onSubmit={handleSubmit}
                  className="mx-auto flex max-w-3xl items-center gap-3"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="질문을 입력하세요..."
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="전송"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </form>
                <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-gray-400">
                  AI 튜터는 정답을 직접 알려주지 않고 힌트와 설명으로 도와드립니다.
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
