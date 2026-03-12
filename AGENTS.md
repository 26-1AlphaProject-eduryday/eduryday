# AGENTS.md
Guide for coding agents in `eduryday`.
This file records repository-specific commands and implementation conventions.

## Project Snapshot
- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4
- Architecture: Feature-Sliced Design (FSD)
- Package manager: npm (`package-lock.json` present)
- Goal: LMS UI with role-specific experiences (Student/Professor/Admin)

## Repository Layout
- `app/`: Next.js route files (thin wrappers)
- `_pages/`: page compositions (FSD page layer)
- `widgets/`: large reusable UI blocks
- `entities/`: domain models + mock data
- `shared/ui`: reusable primitives
- `shared/lib`: shared helpers (including API response helpers)
- `app/api/v1`: mock API routes
- `docs/`: process docs and coding/PR rules
- `scripts/`: repository automation helpers
- `public/`: static assets for Next.js
- `.githooks/`: local git hooks for workflow checks

## Source-Of-Truth Files
- `package.json` for scripts
- `tsconfig.json` for TS strict settings and aliases
- `CLAUDE.md` for team conventions
- `docs/DEV_RULES.md` for additional coding and PR rules
- `docs/UI_COLOR_GUIDELINES.md` for button/text contrast and color consistency
- `shared/lib/api/response.ts` for API response shape

## Commands
Run from repo root: `/Users/simjoon/develop/eduryday`

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

Recommended verification sequence:

```bash
npm run lint && npm run typecheck && npm run build
```

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

## Naming Conventions
- Components/pages/widgets: `PascalCase`
- Variables/functions/helpers: `camelCase`
- Interfaces/types: `PascalCase`
- Static constants: `UPPER_SNAKE_CASE`
- Route wrapper component names often end with `Route`

## TypeScript Rules
`tsconfig.json` uses `strict: true`.
- Keep prop and payload types explicit.
- Prefer unions for controlled variants and status fields.
- Use generics where patterns exist (`ok<T>(data: T)`).
- Do not weaken typing for convenience.
- Validate unknown request data before property access.

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

## Quick Checklist For Agents
- Route wrapper is thin and delegates to `_pages`.
- Imports follow alias and ordering conventions.
- Types are explicit and strict-safe.
- API routes use `ok()` / `fail()` helpers.
- Lint, typecheck, build all pass.
- No fabricated test commands are reported when tests are not configured.
