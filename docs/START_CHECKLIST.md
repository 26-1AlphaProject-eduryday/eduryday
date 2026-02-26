# START_CHECKLIST.md

개발 시작 전에 아래를 반드시 확인:

## A. 브랜치/범위
- [ ] 현재 브랜치가 `feature/*` / `fix/*` / `chore/*` 인가?
- [ ] 이번 작업 범위(페이지/컴포넌트)가 명확한가?
- [ ] PDF 원본 기준 페이지를 확인했는가?

## B. 규칙
- [ ] `docs/DEV_RULES.md`를 읽었는가?
- [ ] 컴포넌트 PascalCase / util/hooks camelCase를 지킬 준비가 되었는가?
- [ ] API 입력 검증/에러 포맷 규칙을 확인했는가?

## C. 실행 환경
- [ ] 의존성 설치 완료 (`npm i`)
- [ ] 개발 서버 실행 확인 (`npm run dev`)
- [ ] lint/typecheck 명령 확인 (`npm run lint`, `npm run typecheck`)

## D. 산출물
- [ ] 완료 후 비교 스크린샷(원본 PDF vs 구현 화면) 남길 계획인가?
- [ ] PR 설명 템플릿에 작업 이유/결과를 정리할 수 있는가?
