# Launch Readiness

## Verification Baseline

- Required local checks:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- CI baseline:
  - GitHub Actions workflow at `.github/workflows/ci.yml`
  - Runs lint, typecheck, and build on push and pull request

## Monitoring / Error Reporting

- Current direction: add a production error reporting integration before launch (`Sentry` or equivalent).
- Minimum requirement for v1:
  - uncaught route/render errors must be observable from production
  - deploy owner must have a single dashboard or alert destination for failures

## Backup / Rollback

- Supabase migrations must be applied only after confirming the target project is linked correctly.
- Before production migration execution:
  - verify target Supabase project ref
  - confirm latest schema backup/export exists
  - keep previous production deployment available in Vercel for rollback
- Rollback approach for v1:
  - revert the application deployment in Vercel
  - apply compensating DB migration if schema rollback is needed

## Deployment Notes

- `SUPABASE_SERVICE_ROLE_KEY` remains server-only.
- Google OAuth production redirect URLs must match the Vercel domain.
- Design-only routes removed from v1 navigation should stay inaccessible from operational flows until they are real-data-backed.
