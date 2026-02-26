import { ReactNode } from 'react';
import { Card, Page, Button, Stat } from '@/components/ui/primitives';

export const alphaPages: Record<string, ReactNode> = {
  '01-landing': (
    <Page title="AI와 함께하는 차세대 코딩 교육">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="강의·실습·채점 통합">
          <p className="mb-5 text-sm leading-6 text-slate-600 sm:text-base">
            분절된 도구를 하나로 묶은 올인원 학습 플랫폼입니다. 교수자 부담은 줄이고,
            학생 피드백은 더 빠르고 공정하게 제공합니다.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button>무료로 시작</Button>
            <Button kind="secondary">데모 보기</Button>
          </div>
        </Card>
        <Card title="핵심 화면 미리보기">
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-100 p-10 text-center text-sm text-slate-500">
            Hero / Product Screenshot
          </div>
        </Card>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="채점 시간 절감" value="90%+" />
        <Stat label="평균 피드백" value="3초" />
        <Stat label="AI 튜터" value="24/7" />
        <Stat label="학습 공정성" value="100%" />
      </div>
    </Page>
  ),

  '02-login': (
    <Page title="로그인">
      <div className="mx-auto w-full max-w-md">
        <Card title="EduRyday 로그인">
          <form className="space-y-3">
            <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" placeholder="이메일" />
            <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" placeholder="비밀번호" type="password" />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>계정을 잊으셨나요?</span>
              <a href="#" className="underline">비밀번호 찾기</a>
            </div>
            <div className="pt-1">
              <Button>로그인</Button>
            </div>
          </form>
        </Card>
      </div>
    </Page>
  ),

  '03-student-dashboard': (
    <Page title="학생 대시보드">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="수강 강좌">
          <ul className="space-y-2 text-sm text-slate-700">
            <li>알고리즘 기초 (3주차 진행중)</li>
            <li>자료구조 입문 (2주차 진행중)</li>
            <li>실전 문제풀이 (과제 마감 D-1)</li>
          </ul>
        </Card>
        <Card title="진행률">
          <div className="space-y-2 text-sm">
            <div>주차 완료율 68%</div>
            <div className="h-2 rounded bg-slate-200"><div className="h-2 w-2/3 rounded bg-slate-800" /></div>
          </div>
        </Card>
        <Card title="알림">
          <ul className="space-y-2 text-sm text-slate-700">
            <li>오늘 21:00 과제 제출 마감</li>
            <li>내일 10:00 퀴즈 예정</li>
            <li>튜터 피드백 4건 도착</li>
          </ul>
        </Card>
      </div>
    </Page>
  ),

  '04-course-detail': (
    <Page title="강좌 상세">
      <div className="grid gap-4 lg:grid-cols-3"><Card title="커리큘럼">주차별 목록</Card><Card title="자료실">PDF/코드/동영상</Card><Card title="공지">강의 공지</Card></div>
    </Page>
  ),

  '05-split-view-ide': (
    <Page title="Split-View IDE">
      <div className="grid gap-4 xl:grid-cols-2"><Card title="문제/설명">문제 본문, 입력/출력</Card><Card title="코드/실행 결과">에디터 + 테스트 결과 + 제출</Card></div>
    </Page>
  ),

  '06-ai-tutor': (
    <Page title="AI 튜터">
      <Card title="RAG 기반 Q&A"><div className="space-y-3 text-sm"><p>[You] 테스트 2 왜 실패하나요?</p><p>[AI] 경계 조건(base case) 확인해보세요.</p><input className="w-full rounded border p-2" placeholder="메시지 입력..."/></div></Card>
    </Page>
  ),

  '07-professor-dashboard': (
    <Page title="교수 대시보드"><div className="grid grid-cols-2 gap-4 lg:grid-cols-4"><Stat label="강좌" value="4"/><Stat label="미채점" value="28"/><Stat label="오늘 피드백" value="56"/><Stat label="질문" value="14"/></div></Page>
  ),

  '08-create-assignment': (
    <Page title="과제 생성 (No-Code Rubric)"><Card title="자연어 채점 기준"><div className="space-y-2"><textarea className="h-24 w-full rounded border p-2" placeholder="기준 1: 변수명을 직관적으로..."/><textarea className="h-24 w-full rounded border p-2" placeholder="기준 2: 시간복잡도 O(n) 이하..."/><Button>저장</Button></div></Card></Page>
  ),

  '09-grading-status': (
    <Page title="채점 현황"><div className="grid gap-4 lg:grid-cols-2"><Card title="자동 채점 결과">제출/통과/실패 통계</Card><Card title="수동 리뷰 큐">교수 확인 필요 항목</Card></div></Page>
  ),

  '10-admin-dashboard': (
    <Page title="관리자 대시보드"><div className="grid gap-4 lg:grid-cols-3"><Card title="사용자 관리">역할/계정 상태</Card><Card title="시스템 상태">서버/큐/에러율</Card><Card title="로그">최근 운영 로그</Card></div></Page>
  ),
};
