# app/ — Next.js App Router

**Parent**: [../AGENTS.md](../AGENTS.md)

This directory contains **routing only** — thin wrapper route files that import from the FSD `_pages/` layer and render page components.

All UI logic, state, data fetching, and business logic lives in the FSD layers:
- `_pages/` — page compositions (landing, login, dashboards, course detail, IDE, etc.)
- `widgets/` — independent complex UI blocks (headers, sidebars)
- `shared/ui/` — reusable primitives (Button, Card, Badge, etc.)

## Directory Structure

```
app/
├── layout.tsx                              Root layout (html, head, body)
├── globals.css                             Global styles (Tailwind)
├── page.tsx                                /
├── login/page.tsx                          /login
├── signup/page.tsx                         /signup
├── forgot-password/page.tsx                /forgot-password
├── auth/role/page.tsx                      /auth/role
├── pending/page.tsx                        /pending
├── student/
│   ├── page.tsx                            redirect → /student/dashboard
│   ├── dashboard/page.tsx                  /student/dashboard
│   ├── courses/page.tsx                    /student/courses
│   ├── courses/[id]/page.tsx               /student/courses/[id]
│   ├── ide/[id]/page.tsx                   /student/ide/[id]
│   ├── assignments/page.tsx                /student/assignments
│   ├── grades/page.tsx                     /student/grades
│   ├── my-page/page.tsx                    /student/my-page
│   └── ai-tutor/page.tsx                   /student/ai-tutor
├── professor/
│   ├── page.tsx                            redirect → /professor/dashboard
│   ├── dashboard/page.tsx                  /professor/dashboard
│   ├── courses/page.tsx                    /professor/courses
│   ├── courses/[id]/manage/page.tsx        /professor/courses/[id]/manage
│   ├── courses/[id]/grading/page.tsx       /professor/courses/[id]/grading
│   ├── courses/[id]/assignments/create/page.tsx  /professor/courses/[id]/assignments/create
│   ├── courses/create/page.tsx             /professor/courses/create
│   ├── assignments/page.tsx                /professor/assignments
│   ├── grades/page.tsx                     /professor/grades
│   ├── analytics/page.tsx                  /professor/analytics
│   └── announcements/page.tsx              /professor/announcements
├── admin/
│   ├── page.tsx                            redirect → /admin/dashboard
│   ├── dashboard/page.tsx                  /admin/dashboard
│   ├── users/page.tsx                      /admin/users
│   ├── courses/page.tsx                    /admin/courses
│   ├── logs/page.tsx                       /admin/logs
│   └── settings/page.tsx                   /admin/settings
├── auth/
│   ├── callback/route.ts                   /auth/callback (OAuth callback)
│   └── ...
└── api/                                    [see api/AGENTS.md]
```

## Routing Table

### Public Routes

| URL | Page Component | Description |
|-----|---|---|
| `/` | `_pages/landing` | Landing page |
| `/login` | `_pages/login` | Login form |
| `/signup` | `_pages/signup` | User registration |
| `/forgot-password` | `_pages/forgot-password` | Password reset flow |
| `/auth/role` | `_pages/auth-role-select` | Role selection during onboarding |
| `/pending` | `_pages/pending` | Account pending approval state |

### Student Routes

| URL | Page Component | Description |
|-----|---|---|
| `/student` | redirect | Redirect to dashboard |
| `/student/dashboard` | `_pages/student-dashboard` | Student home; shows enrolled courses, upcoming deadlines, progress stats |
| `/student/courses` | `_pages/student-courses` | Browse enrolled courses |
| `/student/courses/[id]` | `_pages/course-detail` | Course detail; assignments, announcements, progress |
| `/student/ide/[id]` | `_pages/split-view-ide` | Coding IDE for assignments |
| `/student/assignments` | `_pages/student-assignments` | Student assignment list |
| `/student/grades` | `_pages/student-grades` | View grades and feedback |
| `/student/my-page` | `_pages/student-my-page` | Profile and settings |
| `/student/ai-tutor` | `_pages/ai-tutor` | AI tutor interface (RAG-based hints) |

### Professor Routes

| URL | Page Component | Description |
|-----|---|---|
| `/professor` | redirect | Redirect to dashboard |
| `/professor/dashboard` | `_pages/professor-dashboard` | Professor home; courses, pending reviews, stats |
| `/professor/courses` | `_pages/professor-courses` | Manage courses |
| `/professor/courses/create` | `_pages/create-course` | Create new course |
| `/professor/courses/[id]/manage` | `_pages/course-manage` | Course settings and roster |
| `/professor/courses/[id]/grading` | `_pages/grading-status` | Grading interface and submission list |
| `/professor/courses/[id]/assignments/create` | `_pages/create-assignment` | Create assignment with rubric builder |
| `/professor/assignments` | `_pages/professor-assignments` | View all assignments |
| `/professor/grades` | `_pages/professor-grades` | Grade management |
| `/professor/analytics` | `_pages/professor-analytics` | Course analytics and reports |
| `/professor/announcements` | `_pages/professor-announcements` | Post course announcements |

### Admin Routes

| URL | Page Component | Description |
|-----|---|---|
| `/admin` | redirect | Redirect to dashboard |
| `/admin/dashboard` | `_pages/admin-dashboard` | System overview; user counts, active courses, activity logs |
| `/admin/users` | `_pages/admin-users` | User management (filter, approve, suspend) |
| `/admin/courses` | `_pages/admin-courses` | Course administration |
| `/admin/logs` | `_pages/admin-logs` | Activity and error logs |
| `/admin/settings` | `_pages/admin-settings` | System settings and configuration |

## Layout Files

| File | Scope | Purpose |
|---|---|---|
| `app/layout.tsx` | Root | Sets metadata, imports `globals.css`, renders `<html>` and `<body>` with `{children}` |
| `app/globals.css` | App | Tailwind import, box-sizing reset, default font/margin/padding, base link styling |

## For AI Agents

### Route File Pattern

Every `page.tsx` file in `app/` should follow this pattern:

```tsx
import { PageName } from '@/_pages/page-name/ui/PageName';

export default function RouteHandler() {
  return <PageName />;
}
```

Or with async data fetching (using Supabase):

```tsx
import { PageName } from '@/_pages/page-name/ui/PageNamePage';
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export default async function RouteHandler() {
  const auth = await getRouteAuthContext();
  const client = getServiceRoleClient();

  // Fetch data, pass as props to component
  const data = await fetchData(client);

  return <PageName data={data} />;
}
```

### Rules

1. **Never put UI logic in `app/`** — Keep route files thin wrappers only
2. **Import from `_pages/` not `pages/`** — Next.js uses `pages/` for Pages Router detection; we use `_pages/`
3. **Use `async` for data fetching** — Leverage Next.js 15/16 Server Components
4. **Auth context** — Call `getRouteAuthContext()` and `getServiceRoleClient()` for protected routes
5. **Error fallback** — Return a component with empty state if auth fails or data is missing
6. **Create FSD page first** — Before adding a new route file, create the FSD page component in `_pages/`

### Adding a New Route

1. Create the FSD page component:
   ```
   _pages/my-page/ui/MyPage.tsx
   ```
2. Create the route file:
   ```tsx
   app/my-path/page.tsx
   import { MyPage } from '@/_pages/my-page/ui/MyPage';
   export default function MyRoute() { return <MyPage />; }
   ```

## API Routes

API endpoints live in `app/api/`. See [api/AGENTS.md](api/AGENTS.md) for endpoint documentation.

<!-- MANUAL: App Router layer documentation. Next.js 15/16 with FSD. All UI logic in _pages/ and shared/. Route files are thin wrappers only. -->
