# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

No test runner is configured yet.

---

## Architecture: FSD + Next.js App Router

This project uses **Feature-Sliced Design (FSD)** with the Next.js 15/16 App Router. The `app/` directory handles routing only — all UI logic lives in FSD layers.

```
app/                    ← Next.js App Router (routing only, thin wrappers)
_pages/                 ← FSD: page compositions (언더스코어: Next.js 라우팅 제외)
widgets/                ← FSD: independent complex blocks (Header, Sidebar)
features/               ← FSD: user interactions (to be added)
entities/               ← FSD: business entities (to be added)
shared/                 ← FSD: reusable primitives
  ui/                   ← Button, Card, Badge, ProgressBar, Input, StatCard
  lib/                  ← API helpers (ok, fail)
```

> **주의**: Next.js의 `pages/` 디렉토리는 Pages Router로 인식되므로 FSD pages 레이어는 `_pages/`로 명명.

### Routing Table

| URL | FSD Page | Description |
|-----|----------|-------------|
| `/` | `pages/landing` | 랜딩 페이지 |
| `/login` | `pages/login` | 로그인 |
| `/student` | redirect → `/student/dashboard` | |
| `/student/dashboard` | `pages/student-dashboard` | 학생 대시보드 |
| `/student/courses/[id]` | `pages/course-detail` | 강좌 상세 |
| `/student/ide/[id]` | `pages/split-view-ide` | Split-View IDE |
| `/student/ai-tutor` | `pages/ai-tutor` | AI 튜터 |
| `/professor` | redirect → `/professor/dashboard` | |
| `/professor/dashboard` | `pages/professor-dashboard` | 교수 대시보드 |
| `/professor/courses/[id]/assignments/create` | `pages/create-assignment` | 과제 생성 |
| `/professor/courses/[id]/grading` | `pages/grading-status` | 채점 현황 |
| `/admin` | redirect → `/admin/dashboard` | |
| `/admin/dashboard` | `pages/admin-dashboard` | 관리자 대시보드 |

### Adding a New Page

1. Create `_pages/<page-name>/ui/<PageName>Page.tsx` (FSD page component)
2. Create the Next.js route file in `app/` that imports and renders it:
   ```tsx
   import { MyPage } from '@/_pages/my-page/ui/MyPage';
   export default function MyRoute() { return <MyPage />; }
   ```

### Widgets

| Widget | Description |
|--------|-------------|
| `widgets/header/LandingHeader` | 랜딩 전용 헤더 (nav + CTA 버튼) |
| `widgets/header/StudentHeader` | 학생용 헤더 (아바타, 알림) |
| `widgets/header/ProfessorHeader` | 교수용 헤더 (교수 badge) |
| `widgets/header/AdminHeader` | 관리자 헤더 (dark, Admin badge) |
| `widgets/sidebar/StudentSidebar` | 학생 사이드바 (`activeItem` prop) |
| `widgets/sidebar/ProfessorSidebar` | 교수 사이드바 (`activeItem` prop) |
| `widgets/sidebar/AdminSidebar` | 관리자 사이드바 dark 테마 (`activeItem` prop) |

### Shared UI

```tsx
import { Button, Card, Badge, ProgressBar, Input, StatCard } from '@/shared/ui';
```

- `Button`: `variant` (primary/secondary/danger), `size` (sm/md/lg), `fullWidth`
- `Badge`: `variant` (default/green/blue/yellow/red/purple)
- `ProgressBar`: `value` (0-100), `color` (gray/blue/green)
- `StatCard`: `label`, `value`, `trend?`, `trendColor?`

---

## Dev Conventions

### Commits
Conventional style: `feat(ui): ...`, `fix(api): ...`, `chore(docs): ...`

### Branches
- `feature/*` — new features
- `fix/*` — bug fixes
- `chore/*` — config/docs/ops

### Naming
- Components/Pages/Widgets: `PascalCase`
- Utils/hooks: `camelCase`

### Design Rule
**HTML 목업을 기준으로 정확히 구현** — `mockups/*.html` 참조. 임의 리디자인 금지.
우선순위: 레이아웃 정확도 → 타이포/여백 → 인터랙션

### API Layer
`lib/api/response.ts`의 `ok()` / `fail()` 헬퍼 사용. 에러 포맷: `{ ok: false, code, message }`.

### PR Checklist
`npm run lint` + `npm run typecheck` 통과 필수. 구현 전후 스크린샷 첨부.

---

## Tailwind CSS

npm 패키지로 설치됨 (CDN 아님). `@import "tailwindcss"` in `app/globals.css`. PostCSS config: `postcss.config.mjs`.

---

## Project Context

EduRyday는 AI 기반 LMS. 3개 역할: **학생(Student)**, **교수(Professor)**, **관리자(Admin)**.
핵심 기능: Split-View IDE (코딩 실습) + AI 튜터 (RAG 기반 힌트) + No-Code Rubric Engine (자연어 채점).

백엔드 미정 (Supabase 검토 중). 현재 API routes (`app/api/v1/`)는 mock 데이터 반환.
HTML 목업 원본: `mockups/*.html` (디자인 레퍼런스용).
