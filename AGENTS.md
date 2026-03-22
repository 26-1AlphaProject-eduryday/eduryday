# AGENTS.md — EduRyday Project Guide

**Generated:** 2026-03-22

## Project Overview

**EduRyday** is an AI-based Learning Management System (LMS) built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It uses **Feature-Sliced Design (FSD)** architecture with the App Router for routing-only concerns.

### Purpose
- **3 User Roles:** Student, Professor, Admin (role-specific experiences)
- **Core Features:** Split-View IDE (coding practice), AI Tutor (RAG-based hints), No-Code Rubric Engine (natural language grading)
- **Backend:** Supabase (authentication + database)
- **Status:** Frontend-primary development; mock API routes in place

### Stack Summary
- **Framework:** Next.js 16 App Router
- **UI:** React 19, Tailwind CSS v4
- **Language:** TypeScript (strict mode)
- **Package Manager:** npm
- **Architecture:** Feature-Sliced Design (FSD)

## Repository Layout

```
eduryday/
├── app/                    ← Next.js App Router (routing only, thin wrappers)
├── _pages/                 ← FSD: page compositions (underscore prevents Next.js Pages Router)
├── widgets/                ← FSD: complex independent blocks (headers, sidebars)
├── features/               ← FSD: user interactions (planned)
├── entities/               ← FSD: business entity models + mock data
├── shared/                 ← FSD: reusable primitives
│   ├── ui/                 ← Atomic components (Button, Card, Badge, etc.)
│   └── lib/                ← Utilities & API helpers (response.ts: ok(), fail())
├── app/api/v1/            ← Mock API routes (v1 API)
├── supabase/              ← Supabase configuration & migrations
├── public/                ← Static assets
├── docs/                  ← Process docs & checklists
├── scripts/               ← Setup & automation scripts
├── .githooks/             ← Git hooks (pre-commit, pre-push, post-checkout)
├── .github/               ← GitHub Actions & PR templates
├── .env.local             ← Local environment variables
├── CLAUDE.md              ← Developer guidance for Claude Code
├── AGENTS.md              ← This file
├── package.json           ← Dependencies & scripts
├── tsconfig.json          ← TypeScript configuration
├── next.config.ts         ← Next.js configuration
├── postcss.config.mjs     ← PostCSS & Tailwind setup
└── .eslintrc              ← ESLint configuration
```

### FSD Layer Details

#### `_pages/` — Page Compositions
Contains page-level components that compose widgets and shared UI. Named with `_` prefix to avoid Next.js Pages Router recognition.

**Current Pages:** landing, login, student-dashboard, course-detail, split-view-ide, ai-tutor, professor-dashboard, professor-assignments, professor-analytics, professor-announcements, admin-dashboard, admin-users, admin-courses, admin-logs, admin-settings, auth-role, pending, forgot-password

#### `widgets/` — Complex Reusable Blocks
Independent, feature-complete components: headers, sidebars, complex forms.

**Current:** LandingHeader, StudentHeader, ProfessorHeader, AdminHeader, StudentSidebar, ProfessorSidebar, AdminSidebar

#### `shared/` — Reusable Primitives
- `ui/` — Button, Card, Badge, ProgressBar, Input, StatCard
- `lib/` — API helpers, utilities (response.ts: `ok()`, `fail()`)

#### `entities/` — Business Models (Planned)
Data structures and domain logic.

#### `features/` — User Interactions (Planned)
Stateful feature modules combining UI and logic.

## Key Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts (Next.js 16, React 19, Tailwind 4, Supabase SSR) |
| `tsconfig.json` | TypeScript strict mode, path aliases (`@/*`), bundler resolution |
| `next.config.ts` | Next.js config (reactStrictMode enabled) |
| `postcss.config.mjs` | Tailwind CSS v4 PostCSS plugin setup |
| `.env.local` | Local environment variables (Supabase keys, API URLs) |
| `.env.example` | Template for required env vars |
| `CLAUDE.md` | Developer guidance (commands, conventions, design rules) |
| `AGENTS.md` | This file |
| `.eslintrc` | ESLint rules (Next.js recommended) |

### Source-Of-Truth Files (Critical)
- `package.json` — scripts and dependencies
- `tsconfig.json` — TS strict settings and path aliases
- `CLAUDE.md` — team conventions and design rules
- `docs/DEV_RULES.md` — additional coding and PR rules
- `docs/UI_COLOR_GUIDELINES.md` — button/text contrast and color consistency
- `shared/lib/api/response.ts` — API response shape (ok/fail helpers)

## Dev Commands

All commands use npm. **No test runner currently configured.**

```bash
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Type check with tsc --noEmit
```

### Setup
```bash
npm install                    # Install dependencies
./scripts/setup-git-hooks.sh   # Configure git hooks
```

### Recommended Verification Sequence
```bash
npm run lint && npm run typecheck && npm run build
```

All commands run from repo root: `/Users/simjoon/develop/eduryday`

## Test Runner Status (Important)
- No test script is defined in `package.json`
- No `*.test.*` or `*.spec.*` files are present
- Therefore there is no supported single-test command right now

Use this instead today:
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Optional manual validation via `npm run dev`

If a test framework is added later, update this file with:
- full-suite command
- single-file command
- single-test-by-name command

## Cursor / Copilot Instructions Check
Checked and not found:
- `.cursorrules`
- `.cursor/rules/`
- `.github/copilot-instructions.md`

Current conclusion:
- No Cursor-specific or Copilot-specific rule files are active in this repo.

## Routing Convention (App Router + FSD)
- Keep `app/**/page.tsx` minimal and declarative.
- Route files should import a page component from `_pages/.../ui/...` and return it.
- Put real page UI composition in `_pages`, not in `app` route wrappers.

## Imports
- Use external imports first, then internal alias imports.
- Prefer `@/*` aliases (configured in `tsconfig.json`) over long relative paths.
- Use index barrel exports when a module already provides one (`shared/ui`, `entities/*`).
- Keep imports stable and explicit.

## Formatting and File Style
- TypeScript + TSX only for application code.
- Single quotes and semicolons are standard.
- Use multiline JSX props when lines get long.
- Tailwind classes are inline in `className` strings.
- Extract repeated static data to constants (e.g., `NAV_ITEMS`, `STAT_ITEMS`).
- Comments can be used, but keep them purposeful and concise.

## Development Conventions

### Naming
- **Components/Pages/Widgets:** PascalCase (`StudentHeader`, `CoursePage`)
- **Utils/hooks:** camelCase (`useAuthContext`, `formatDate`)
- **Files:** kebab-case for directories, PascalCase for components
- **Interfaces/types:** PascalCase
- **Static constants:** UPPER_SNAKE_CASE
- **Route wrappers:** Often end with `Route` suffix

### Commits
Use Conventional Commits:
```
feat(ui): add student sidebar navigation
fix(api): handle missing course data
chore(docs): update routing table
refactor(shared): simplify button component
```

**Branches:**
- `feature/*` — New features
- `fix/*` — Bug fixes
- `chore/*` — Config, docs, ops

### Design Rule: HTML Mockup Compliance
**Implement exactly to the HTML mockups in `mockups/*.html`—no arbitrary redesigns.**

Priority order:
1. Layout accuracy
2. Typography & spacing
3. Interactions

**Note:** `mockups/` directory is referenced by convention but not currently on disk. Preserve existing UI patterns and avoid speculative redesign.

### API Layer
Use response helpers from `shared/lib/api/response.ts`:
```typescript
export const ok = (data: any) => ({ ok: true, data });
export const fail = (code: string, message: string) => ({ ok: false, code, message });
```

All API responses follow: `{ ok: boolean, data?: any, code?: string, message?: string }`

### PR Checklist
- `npm run lint` passes
- `npm run typecheck` passes
- Before/after screenshots attached (if UI changes)
- DONE_CHECKLIST.md reviewed (`docs/DONE_CHECKLIST.md`)

## Adding a New Page

1. **Create FSD page component:**
   ```
   _pages/<page-name>/ui/<PageName>Page.tsx
   ```

2. **Create Next.js route file in `app/`:**
   ```typescript
   import { MyPage } from '@/_pages/my-page/ui/MyPagePage';
   export default function Route() { return <MyPage />; }
   ```

3. **Export from page's index.ts (optional but recommended):**
   ```typescript
   // _pages/my-page/index.ts
   export { MyPagePage } from './ui/MyPagePage';
   ```

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.1.6 | Framework & App Router |
| react | 19.0.0 | UI library |
| react-dom | 19.0.0 | React DOM adapter |
| tailwindcss | 4.2.1 | Utility-first CSS |
| @tailwindcss/postcss | 4.2.1 | Tailwind v4 PostCSS plugin |
| typescript | 5.7.2 | Type safety |
| @supabase/supabase-js | 2.99.0 | Supabase client |
| @supabase/ssr | 0.9.0 | Supabase SSR adapter |
| eslint | 9.15.0 | Linting |
| eslint-config-next | 16.1.6 | Next.js ESLint rules |

## TypeScript Rules

`tsconfig.json` uses `strict: true`:
- Keep prop and payload types explicit.
- Prefer unions for controlled variants and status fields.
- Use generics where patterns exist (`ok<T>(data: T)`).
- Do not weaken typing for convenience.
- Validate unknown request data before property access.
- No implicit `any`

## API and Error Handling
For `app/api/v1/**/route.ts`:
- Use `ok()` and `fail()` from `@/shared/lib/api/response`.
- Success: `ok({ ... })`
- Error: `fail(code, message, status?)`
- Canonical error payload shape: `{ ok: false, code, message }`

## UI Guardrails
From project instructions in `CLAUDE.md`:
- Implement to match `mockups/*.html`
- No arbitrary redesign
- Priority: layout accuracy -> typography/spacing -> interactions

Repository note:
- `mockups/` is referenced by convention docs but is not currently present on disk.
- If mockup files are unavailable, preserve existing UI patterns and avoid speculative redesign.

Practical UI guidance:
- Reuse `shared/ui` components before adding new primitives.
- Preserve role-specific patterns in headers/sidebars.
- Keep existing visual language unless the task explicitly requests change.
- Follow `docs/UI_COLOR_GUIDELINES.md` for button/link/input color tokens and contrast.

## Agent Workflow
Before coding:
- Inspect nearby files for local patterns.
- Prefer extending existing structure over introducing new architecture.

After coding:

```bash
npm run lint
npm run typecheck
npm run build
```

If checks fail:
- Fix root cause, then rerun all checks.
- Do not hand off in a failing state.

## Git / PR Conventions
- Commit style examples: `feat(ui): ...`, `fix(api): ...`, `chore(docs): ...`
- Branch names: `feature/*`, `fix/*`, `chore/*`
- PR baseline: pass lint + typecheck, include screenshots for UI changes
- `.githooks/pre-commit` runs lint and typecheck as warnings (informational, non-blocking)

## For AI Agents

### Architecture Rules (Strict)

1. **FSD Separation:**
   - `app/` = routing only, thin wrappers
   - `_pages/` = page-level compositions (not `pages/`)
   - `widgets/` = complex reusable blocks
   - `shared/` = primitives (ui components, utilities)

2. **HTML Mockup Compliance:**
   - Design reference: `mockups/*.html` (currently not on disk; preserve existing patterns)
   - Follow mockups precisely—no arbitrary redesigns
   - Priority: layout accuracy → typography → interactions

3. **TypeScript:** Strict mode enabled
   - All symbols must be typed
   - No implicit `any`

4. **Tailwind CSS:**
   - Version 4.2.1 with PostCSC plugin
   - No CSS-in-JS; use utility classes only
   - Config in `postcss.config.mjs`

5. **API Responses:**
   - Use `ok()` and `fail()` from `shared/lib/api/response.ts`
   - Format: `{ ok: boolean, data?, code?, message? }`

### Before Coding
- Inspect nearby files for local patterns.
- Prefer extending existing structure over introducing new architecture.
- Read `CLAUDE.md` for team conventions.
- Check `docs/DEV_RULES.md` for additional rules.

### After Coding
```bash
npm run lint
npm run typecheck
npm run build
```

If checks fail:
- Fix root cause, then rerun all checks.
- Do not hand off in a failing state.

### Quick Checklist For Agents
- [ ] Route wrapper is thin and delegates to `_pages`
- [ ] Imports follow alias and ordering conventions
- [ ] Types are explicit and strict-safe
- [ ] API routes use `ok()` / `fail()` helpers
- [ ] No arbitrary redesigns from mockups
- [ ] Lint, typecheck, build all pass
- [ ] No fabricated test commands (tests not configured)

## Related Documentation

- `.githooks/AGENTS.md` — Git hooks documentation
- `scripts/AGENTS.md` — Setup scripts documentation
- `docs/AGENTS.md` — Documentation files
- `CLAUDE.md` — Developer guidance & conventions
- `docs/DEV_RULES.md` — Additional coding rules
- `docs/PRD.md` — Product requirements
- `docs/START_CHECKLIST.md` — Pre-work checklist
- `docs/DONE_CHECKLIST.md` — Pre-push checklist
- `docs/LAUNCH_READINESS.md` — Production readiness
- `docs/UI_COLOR_GUIDELINES.md` — Color & styling guidelines

## Project Status

- **Frontend:** Active development (pages, widgets, UI components)
- **Backend:** Supabase integration in progress
- **API Routes:** Mock data in `app/api/v1/` (pending real backend)
- **Testing:** No test runner configured yet
- **Deployment:** TBD (GitHub Actions workflow planned)

---

<!-- MANUAL: This file documents the overall structure, conventions, and guidance for working with EduRyday. Update when adding new top-level directories or changing FSD layer structure. Companion files: .githooks/AGENTS.md, scripts/AGENTS.md, docs/AGENTS.md -->
