#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

chmod +x .githooks/post-checkout .githooks/pre-commit .githooks/pre-push

git config core.hooksPath .githooks

echo "✅ Git hooks 경로 설정 완료: .githooks"
echo "- post-checkout: START_CHECKLIST 안내"
echo "- pre-commit: lint/typecheck"
echo "- pre-push: DONE_CHECKLIST 안내"
