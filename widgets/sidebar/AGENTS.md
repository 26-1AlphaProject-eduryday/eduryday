# widgets/sidebar/ AGENTS.md

**Parent:** [`../AGENTS.md`](../AGENTS.md)

## Overview

Role-specific navigation sidebar components for dashboards.

All sidebars are exported via `widgets/sidebar/index.ts` barrel export.

## Components

### `StudentSidebar`

Student navigation sidebar with course and assignment links.

**Props:**
```tsx
interface StudentSidebarProps {
  activeItem?: string;  // Label of current active nav item
}
```

**Navigation Items:**
- 대시보드 → `/student/dashboard`
- 내 강좌 → `/student/courses`
- 과제 → `/student/assignments`
- 성적 → `/student/grades`
- 마이페이지 → `/student/my-page`

**Features:**
- Static component (no client-side logic)
- Highlights active item with light gray background
- Hover effect on inactive items
- Full height sidebar (`min-h-screen`)
- Light gray border on right

**Usage:**
```tsx
import { StudentSidebar } from '@/widgets/sidebar';

export default function StudentDashboardPage() {
  return (
    <div className="flex">
      <StudentSidebar activeItem="대시보드" />
      <main className="flex-1 p-6">
        {/* Page content */}
      </main>
    </div>
  );
}
```

**Active Item Styling:**
- Background: light gray (`bg-gray-100`)
- Font weight: medium
- Text color: dark gray (`text-gray-900`)

**Inactive Item Styling:**
- Text color: gray (`text-gray-600`)
- Hover: light gray background, dark text
- Transition: smooth color change

---

### `ProfessorSidebar`

Professor navigation sidebar with course and grading management links.

**Props:**
```tsx
interface ProfessorSidebarProps {
  activeItem?: string;  // Label of current active nav item
}
```

**Navigation Items:**
- 대시보드 → `/professor/dashboard`
- 내 강좌 → `/professor/courses`
- 과제 관리 → `/professor/assignments`
- 채점 현황 → `/professor/courses/1/grading`
- 성적 관리 → `/professor/grades`
- 공지사항 → `/professor/announcements`

**Features:**
- Same layout and styling as StudentSidebar
- Role-appropriate navigation items
- Static component
- Full height with right border

**Usage:**
```tsx
import { ProfessorSidebar } from '@/widgets/sidebar';

export default function ProfessorDashboardPage() {
  return (
    <div className="flex">
      <ProfessorSidebar activeItem="대시보드" />
      <main className="flex-1 p-6">
        {/* Page content */}
      </main>
    </div>
  );
}
```

**Styling:** Same as StudentSidebar (light theme)

---

### `AdminSidebar`

Admin navigation sidebar with dark theme (dark gray background).

**Props:**
```tsx
interface AdminSidebarProps {
  activeItem?: string;  // Label of current active nav item
}
```

**Navigation Items:**
- 대시보드 → `/admin/dashboard`
- 사용자 관리 → `/admin/users`
- 강좌 관리 → `/admin/courses`
- 로그/모니터링 → `/admin/logs`

**Features:**
- Dark gray background (`bg-gray-800`)
- White text for active items
- Light gray text for inactive items
- Full height sidebar
- No right border (dark background extends)

**Usage:**
```tsx
import { AdminSidebar } from '@/widgets/sidebar';

export default function AdminDashboardPage() {
  return (
    <div className="flex">
      <AdminSidebar activeItem="대시보드" />
      <main className="flex-1 p-6">
        {/* Page content */}
      </main>
    </div>
  );
}
```

**Active Item Styling (Dark Theme):**
- Background: darker gray (`bg-gray-700`)
- Font weight: medium
- Text color: white

**Inactive Item Styling (Dark Theme):**
- Text color: light gray (`text-gray-300`)
- Hover: darker gray background, white text
- Transition: smooth color change

---

## For AI Agents

### Active Item Pattern

Always pass the `activeItem` prop to highlight the current page:

```tsx
// On /student/dashboard page
<StudentSidebar activeItem="대시보드" />

// On /student/courses page
<StudentSidebar activeItem="내 강좌" />

// On /professor/courses/1/grading page
<ProfessorSidebar activeItem="채점 현황" />
```

The `activeItem` label must **exactly match** one of the navigation item labels.

### Using in Layout Components

Create a layout wrapper to avoid duplication:

```tsx
// _pages/student-dashboard/ui/StudentDashboardLayout.tsx
'use client';

import { StudentHeader } from '@/widgets/header';
import { StudentSidebar } from '@/widgets/sidebar';
import { ReactNode } from 'react';

interface StudentLayoutProps {
  children: ReactNode;
  activeItem: string;
}

export function StudentLayout({ children, activeItem }: StudentLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <StudentHeader />
      <div className="flex flex-1">
        <StudentSidebar activeItem={activeItem} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

Then reuse:

```tsx
// _pages/student-dashboard/ui/StudentDashboardPage.tsx
import { StudentLayout } from './StudentDashboardLayout';

export default function StudentDashboardPage() {
  return (
    <StudentLayout activeItem="대시보드">
      {/* Dashboard content */}
    </StudentLayout>
  );
}
```

### Theme Consistency

- **StudentSidebar & ProfessorSidebar:** Light theme (white bg)
- **AdminSidebar:** Dark theme (gray-800 bg)
- **LandingHeader:** Light theme
- **StudentHeader & ProfessorHeader:** Light theme
- **AdminHeader:** Dark theme

Match header and sidebar themes for the same role.

### Width

All sidebars are 16rem (`w-64`) wide:

```tsx
<aside className="min-h-screen w-64 ...">
  {/* Content */}
</aside>
```

If you need a different width, adjust the layout flexbox:

```tsx
<div className="flex">
  <Sidebar /> {/* w-64 */}
  <main className="flex-1"> {/* Takes remaining space */}
</div>
```

<!-- MANUAL: -->
