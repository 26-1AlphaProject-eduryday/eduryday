# AGENTS.md — Documentation

**Parent:** `../AGENTS.md`
**Generated:** 2026-03-22

## Overview

The `docs/` directory contains project-specific documentation, checklists, and guidelines for developers.

---

## Documentation Files

### `PRD.md`
**Purpose:** Product Requirements Document (27.4 KB)

**Content:** Overall product vision, features, user flows, and acceptance criteria for EduRyday LMS.

**Use:** Reference for feature scope and acceptance criteria before implementation.

---

### `DEV_RULES.md`
**Purpose:** Development conventions and rules (1.5 KB)

**Content:** Naming conventions, commit style, branch naming, code organization rules.

**Use:** Quick reference when implementing features.

**Related:** `../CLAUDE.md` has detailed guidance.

---

### `START_CHECKLIST.md`
**Purpose:** Pre-work checklist (860 B)

**Content:** What to verify before starting work on a feature/fix.

**Trigger:** Automatically displayed by post-checkout hook when entering a feature/fix/chore branch.

**Use:** Review before beginning work on a new branch.

---

### `DONE_CHECKLIST.md`
**Purpose:** Pre-push/PR checklist (772 B)

**Content:** What to verify before pushing or opening a pull request.

**Trigger:** Reminder displayed by pre-push hook.

**Use:** Review before pushing to origin or opening a PR.

**Typical Items:**
- [ ] npm run lint passes
- [ ] npm run typecheck passes
- [ ] Before/after screenshots (if UI changes)
- [ ] CLAUDE.md conventions followed
- [ ] PRD requirements met

---

### `UI_COLOR_GUIDELINES.md`
**Purpose:** Color palette and Tailwind usage guide (2.1 KB)

**Content:** Brand colors, semantic color usage, Tailwind customization.

**Use:** When styling components, ensure color consistency with brand guidelines.

---

### `LAUNCH_READINESS.md`
**Purpose:** Pre-launch checklist (1.3 KB)

**Content:** Requirements for production deployment (security, performance, documentation).

**Use:** Before deploying to production.

---

## Document Structure

All documentation files use Markdown format. Each checklist is designed to be:
- **Scannable:** Headers, bullet points, tables
- **Actionable:** Clear yes/no items or steps
- **Progressive:** Start with START_CHECKLIST, end with DONE_CHECKLIST

---

## Related Documentation

| File | Location | Purpose |
|------|----------|---------|
| CLAUDE.md | `../CLAUDE.md` | Developer guidance (commands, FSD architecture, conventions) |
| AGENTS.md (root) | `../AGENTS.md` | Project structure & directory overview |
| .githooks/AGENTS.md | `../.githooks/AGENTS.md` | Git hooks documentation |
| scripts/AGENTS.md | `../scripts/AGENTS.md` | Setup scripts documentation |

---

## For AI Agents

### How to Reference Docs

**In implementation:**
- Read `DEV_RULES.md` for naming/structure rules
- Read `PRD.md` for feature requirements
- Read `UI_COLOR_GUIDELINES.md` for color usage

**Before pushing:**
- Review `DONE_CHECKLIST.md`
- Confirm all checklist items pass

**Before production:**
- Review `LAUNCH_READINESS.md`

### Document Locations
```bash
docs/DEV_RULES.md              # Conventions
docs/PRD.md                    # Product requirements
docs/START_CHECKLIST.md        # Pre-work checklist
docs/DONE_CHECKLIST.md         # Pre-push checklist
docs/LAUNCH_READINESS.md       # Production readiness
docs/UI_COLOR_GUIDELINES.md    # Color & styling
```

### Updating Documentation

When docs change:
1. Update the markdown file
2. Commit with `chore(docs): update <filename>`
3. Reference updated docs in PR description

---

<!-- MANUAL: This file documents the docs/ directory contents. Update when adding new documentation files or checklists. -->
