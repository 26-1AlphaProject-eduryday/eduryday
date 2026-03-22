# _pages/ Layer

**Parent:** `../AGENTS.md`

## Overview

The `_pages/` directory is the FSD pages layer. It contains page compositions that map to Next.js routes.

**Note on naming:** This layer is named `_pages/` (with leading underscore) instead of `pages/` because Next.js App Router reserves `pages/` as the Pages Router convention. Using `_pages/` prevents automatic routing conflicts while maintaining clear FSD semantics.

## Structure

Each page follows this consistent pattern:

```
_pages/<page-name>/
├── ui/
│   └── <PageName>Page.tsx      # Page component (client or server)
└── index.ts                     # Barrel export
```

- **`ui/<PageName>Page.tsx`** — The actual page component. Named `<PageName>Page` for clarity.
- **`index.ts`** — Simple re-export: `export { <PageName>Page } from './ui/<PageName>Page';`

## Page Directory

Pages are grouped by role and feature.

### Public/Auth Pages

| Page Directory | Component Name | Route | Purpose |
|---|---|---|---|
| `landing` | `LandingPage` | `/` | Homepage with features, team, stats, FAQ |
| `login` | `LoginPage` | `/login` | User login form |
| `signup` | `SignupPage` | `/signup` | User registration form |
| `forgot-password` | `ForgotPasswordPage` | `/forgot-password` | Password recovery |
| `auth-role` | `AuthRolePage` | `/auth-role` | Role selection during auth flow |
| `pending` | `PendingPage` | `/pending` | Pending/loading state page |

### Student Pages

| Page Directory | Component Name | Route | Purpose |
|---|---|---|---|
| `student-dashboard` | `StudentDashboardPage` | `/student/dashboard` | Student home with stats, courses, deadlines |
| `student-courses` | `StudentCoursesPage` | `/student/courses` | List of courses enrolled |
| `course-detail` | `CourseDetailPage` | `/student/courses/[id]` | Single course details + lessons |
| `student-assignments` | `StudentAssignmentsPage` | `/student/assignments` | Assignments and submissions |
| `student-grades` | `StudentGradesPage` | `/student/grades` | Grade tracking |
| `student-my-page` | `StudentMyPagePage` | `/student/my-page` | Profile and settings |
| `split-view-ide` | `SplitViewIdePage` | `/student/ide/[id]` | Coding IDE (split-view: problem + editor) |
| `ai-tutor` | `AiTutorPage` | `/student/ai-tutor` | AI tutor conversation interface |

### Professor Pages

| Page Directory | Component Name | Route | Purpose |
|---|---|---|---|
| `professor-dashboard` | `ProfessorDashboardPage` | `/professor/dashboard` | Professor home with quick stats |
| `professor-courses` | `ProfessorCoursesPage` | `/professor/courses` | List of courses taught |
| `professor-course-create` | `ProfessorCourseCreatePage` | `/professor/courses/create` | Create new course |
| `professor-course-manage` | `ProfessorCourseManagePage` | `/professor/courses/[id]/manage` | Edit/manage course |
| `professor-assignments` | `ProfessorAssignmentsPage` | `/professor/assignments` | Manage assignments |
| `create-assignment` | `CreateAssignmentPage` | `/professor/courses/[id]/assignments/create` | Create/edit assignment with rubric |
| `professor-grades` | `ProfessorGradesPage` | `/professor/grades` | View student grades |
| `grading-status` | `GradingStatusPage` | `/professor/courses/[id]/grading` | Grading progress and submissions |
| `professor-announcements` | `ProfessorAnnouncementsPage` | `/professor/announcements` | Manage course announcements |
| `professor-analytics` | `ProfessorAnalyticsPage` | `/professor/analytics` | Course analytics and insights |

### Admin Pages

| Page Directory | Component Name | Route | Purpose |
|---|---|---|---|
| `admin-dashboard` | `AdminDashboardPage` | `/admin/dashboard` | Admin home with system metrics |
| `admin-users` | `AdminUsersPage` | `/admin/users` | User management (CRUD) |
| `admin-courses` | `AdminCoursesPage` | `/admin/courses` | Course management |
| `admin-settings` | `AdminSettingsPage` | `/admin/settings` | System settings and config |
| `admin-logs` | `AdminLogsPage` | `/admin/logs` | Activity logs and auditing |

## For AI Agents

### Creating a New Page

1. **Create the page component:**
   ```tsx
   // _pages/<name>/ui/<Name>Page.tsx
   'use client'; // If using hooks or event handlers

   import { Widget } from '@/widgets/header'; // Import widgets
   import { SomeEntity } from '@/entities/some-entity'; // Import entity types
   import { Button } from '@/shared/ui'; // Import shared UI

   export function MyNewPage({ data }: { data: SomeEntity }) {
     return (
       <div>
         {/* Page layout and components */}
       </div>
     );
   }
   ```

2. **Create barrel export:**
   ```ts
   // _pages/<name>/index.ts
   export { MyNewPage } from './ui/MyNewPage';
   ```

3. **Create the Next.js route file:**
   ```tsx
   // app/my-route/page.tsx
   import { MyNewPage } from '@/_pages/my-name/ui/MyNewPage';

   export default function MyRoute() {
     return <MyNewPage />;
   }
   ```

### Component Patterns

**Server Components (async):**
- Pages can be async if they fetch from Supabase or API routes.
- Use `Promise.all()` for parallel data fetching.
- Example: `LandingPage` fetches landing UI seed data.

**Client Components:**
- Add `'use client'` at the top if the component uses `useState`, `useEffect`, or event handlers.
- Example: `LoginPage` needs `'use client'` for form input handling.

### Import Rules

- **Never import from `app/`** — page components are meant to be imported from `_pages/` into `app/`.
- **Never import from other pages** — pages should be independent compositions.
- Always import from `entities/`, `widgets/`, and `shared/`.

### Types and Props

- Define page-specific interfaces in the component file or a co-located `types.ts`.
- Pass data as props (whether fetched server-side or passed from the route wrapper).
- Keep types explicit and use strict TypeScript (`strict: true` in `tsconfig.json`).

Example from `StudentDashboardPage`:
```tsx
interface DashboardStudent { name: string; }
interface DashboardCourse { id: string; title: string; professor: string; progress: number; }

export async function StudentDashboardPage({
  student,
  courses,
}: {
  student: DashboardStudent;
  courses: DashboardCourse[];
}) {
  // ...
}
```

### Empty State Handling

Pages should gracefully handle empty data:
- Show a meaningful empty state message instead of blank screens.
- Example: "수강 중인 강좌가 없습니다." (No courses enrolled)
- Example: "학습 통계 데이터가 아직 없습니다." (No learning stats yet)

<!-- MANUAL: Pages are the composition layer where UI blocks (widgets) and domain entities come together. Keep them focused on layout and data flow; push reusable logic to widgets and entities. -->
