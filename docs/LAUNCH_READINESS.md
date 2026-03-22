# Launch Readiness

## v1 Real Service Launch Checklist

### US-001 – Authentication (Google-only)
- [x] `/login` is Google OAuth only (email/password removed)
- [x] `/signup` is an application form (not account creation)
- [x] Profile API persists `name`, `role`, `student_id`, `department`
- [x] Auth callback routes new users to `/signup`, returning users to `/pending` or dashboard
- [x] Supabase migration: `20260322150000_profiles_signup_application.sql`

### US-002 – Course Domain Core
- [x] Supabase migration: `20260322154000_launch_domain_core.sql`
- [x] `enrollments`, `course_weeks`, `lessons` tables added
- [x] Courses API enforces enrollment-backed student access
- [x] Student courses pages use DB-backed queries

### US-003 – Page Launch Readiness
- [x] Launch-critical pages (dashboard, my-page, grades, courses, etc.) are off `ui-seed`
- [x] Design-only hidden routes (`/student/ai-tutor`, `/professor/analytics`, `/admin/settings`) redirect away
- [x] Sidebar entries removed for hidden routes
- [x] `ui-seed` is used only by landing page and hidden design pages

### US-004 – CI and Tooling
- [x] `eslint.config.mjs` created
- [x] `package.json` lint script updated to `eslint .`
- [x] `.github/workflows/ci.yml` added (lint + typecheck + build)

## Known Limitations

- Remote Supabase migration execution was not performed in this PR.
  The repo is not linked to a Supabase project ref locally.
  Migrations must be applied manually or via the Supabase dashboard before launch.

## How to Apply Migrations

```bash
supabase link --project-ref <YOUR_PROJECT_REF>
supabase db push
```

Or apply SQL files directly in the Supabase dashboard:
1. `supabase/migrations/20260322150000_profiles_signup_application.sql`
2. `supabase/migrations/20260322154000_launch_domain_core.sql`
