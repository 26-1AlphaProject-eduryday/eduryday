# AGENTS.md — Git Hooks

**Parent:** `../AGENTS.md`
**Generated:** 2026-03-22

## Overview

The `.githooks/` directory contains Git hooks that enforce project conventions and provide developer guidance at key moments in the Git workflow.

**Setup:** Hooks are installed via `./scripts/setup-git-hooks.sh`, which sets `.githooks` as the core.hooksPath.

---

## Hooks

### `post-checkout`
**Trigger:** After checking out a branch (git checkout, git pull, branch switch)

**Purpose:** Display START_CHECKLIST guidance when entering a feature/fix/chore branch.

**Behavior:**
- Detects branch name pattern (feature/*, fix/*, chore/*)
- Displays startup reminders:
  - 📌 Link to `docs/START_CHECKLIST.md`
  - 📘 Link to `docs/DEV_RULES.md`
- Non-blocking (doesn't prevent checkout)

**For Developers:**
When you switch to a feature branch, review the START_CHECKLIST before beginning work.

---

### `pre-commit`
**Trigger:** Before committing changes (git commit)

**Purpose:** Run linting and type checking to catch errors early.

**Behavior:**
- Checks if `npm run lint` exists and runs it
- Checks if `npm run typecheck` exists and runs it
- Logs warnings (not errors) if scripts fail or don't exist
- Non-blocking (warnings only; commit still proceeds)

**Output Example:**
```
🔎 pre-commit: lint/typecheck 실행
✅ All checks passed
```

**For Developers:**
- Fix lint and type errors before committing, but hook won't block if you proceed anyway
- Run `npm run lint --fix` to auto-fix ESLint issues
- Check typecheck output and fix manually

---

### `pre-push`
**Trigger:** Before pushing to remote (git push)

**Purpose:** Enforce branch protection and confirm completion checklist.

**Behavior:**
- **Blocks direct pushes to `main` or `master`**
  - Error: "Direct pushes to main are blocked. Create a feature/fix branch and open a PR instead."
  - Exit code: 1 (push rejected)
- **Allows feature/fix/chore branches** with reminders:
  - ✅ Confirm DONE_CHECKLIST reviewed (`docs/DONE_CHECKLIST.md`)
  - ✅ Recommend attaching before/after screenshots to PR

**For Developers:**
1. Always work on a feature/fix/chore branch
2. Review `DONE_CHECKLIST.md` before pushing
3. Include screenshots in PR description if UI changed

---

## Installation

Hooks are automatically installed when you run:
```bash
./scripts/setup-git-hooks.sh
```

This script:
1. Makes all hook files executable
2. Sets `git config core.hooksPath .githooks`
3. Confirms setup with `✅ Git hooks 경로 설정 완료`

---

## Related Documentation

- `docs/START_CHECKLIST.md` — What to check before starting work
- `docs/DONE_CHECKLIST.md` — What to verify before pushing/PR
- `docs/DEV_RULES.md` — Development conventions

---

## For AI Agents

### Hook Mechanics
- Hooks use `bash` with `set -euo pipefail` (exit on error, undefined vars, pipe failures)
- All output is logged to terminal
- None are blocking (warnings only) except pre-push's main branch protection

### Common Hook Issues

**`pre-commit` shows ⚠️ but commit succeeds:**
This is expected—lint/typecheck warn but don't block.

**`pre-push` blocks push to main:**
This is intentional. Create a feature branch instead:
```bash
git checkout -b fix/issue-name
git push origin fix/issue-name
```

**Hooks not running at all:**
Run setup script:
```bash
./scripts/setup-git-hooks.sh
```

---

<!-- MANUAL: This file documents Git hooks configured in .githooks/. Update when adding new hooks or modifying hook behavior. -->
