# AGENTS.md — Scripts

**Parent:** `../AGENTS.md`
**Generated:** 2026-03-22

## Overview

The `scripts/` directory contains utility scripts for project setup and automation.

---

## Scripts

### `setup-git-hooks.sh`
**Purpose:** Install and configure Git hooks.

**What It Does:**
1. Makes all hook files executable (chmod +x)
2. Sets `.githooks` as the Git hooks directory via `git config core.hooksPath .githooks`
3. Displays confirmation output

**Usage:**
```bash
./scripts/setup-git-hooks.sh
```

**Output:**
```
✅ Git hooks 경로 설정 완료: .githooks
- post-checkout: START_CHECKLIST 안내
- pre-commit: lint/typecheck
- pre-push: DONE_CHECKLIST 안내
```

**When to Run:**
- First setup after cloning the repo
- If git hooks stop working (reinstall)

**Hooks Installed:**
- `post-checkout` — Display START_CHECKLIST guidance
- `pre-commit` — Run lint/typecheck
- `pre-push` — Enforce branch protection & completion checklist

See `.githooks/AGENTS.md` for hook details.

---

## For AI Agents

### Script Discovery
```bash
ls -la scripts/  # List all scripts in the directory
```

### Script Execution
All scripts use `#!/usr/bin/env bash` shebang and require execution:
```bash
chmod +x scripts/<script-name>.sh  # Make executable
./scripts/<script-name>.sh         # Run
```

### Error Handling
All scripts use:
```bash
set -euo pipefail
```
This means:
- `set -e` — Exit on first error
- `set -u` — Exit if undefined variable is used
- `set -o pipefail` — Pipe failures cause script to fail

---

<!-- MANUAL: This file documents scripts in the scripts/ directory. Update when adding new scripts. -->
