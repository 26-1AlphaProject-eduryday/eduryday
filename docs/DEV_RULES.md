# DEV_RULES.md

## 1) 브랜치 전략
- `main`: 배포 가능 상태만 유지
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정
- `chore/*`: 설정/문서/운영 정리

권장 브랜치 예시:
- `feature/alpha-ui-pdf-v1`
- `fix/alpha-form-validation`
- `chore/docs-hook-setup`

## 2) 커밋 규칙 (Conventional 스타일)
- `feat(ui): ...`
- `feat(api): ...`
- `fix(ui): ...`
- `fix(api): ...`
- `chore(docs): ...`
- `chore(ci): ...`

원칙:
- 한 커밋 = 한 목적
- 커밋 메시지는 "무엇을/왜"가 드러나야 함

## 3) Next.js 코드 규칙
### 명명
- 컴포넌트: `PascalCase` (`AlphaDashboard.tsx`)
- util/hooks: `camelCase` (`formatDeadline.ts`, `useAlphaDeadline.ts`)

### 라우팅/구조
- PDF 디자인 반영 화면은 우선 `app/(alpha-ui)/...` 단위로 분리
- 공통 컴포넌트는 `components/`로 분리하고 페이지는 최대한 얇게 유지

### API Route
- 입력 검증 필수 (스키마 검증 권장)
- 에러 응답 포맷 통일:
```json
{ "ok": false, "code": "VALIDATION_ERROR", "message": "..." }
```

## 4) PR 기준
- PR은 작게, 리뷰 가능한 단위로
- 스크린샷 첨부 (PDF 원본 대비)
- 체크리스트 통과 필수:
  - START_CHECKLIST 확인
  - pre-commit 통과 (lint/typecheck)
  - DONE_CHECKLIST 확인

## 5) 디자인 반영 원칙
- "PDF 페이지 디자인 그대로" 우선
- 임의 리디자인 금지 (필요 시 별도 합의)
- 폰트/간격/색상/타이포 우선순위:
  1. 레이아웃 정확도
  2. 타이포/여백
  3. 인터랙션 개선
