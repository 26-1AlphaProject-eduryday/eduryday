# widgets/header/ AGENTS.md

**Parent:** [`../AGENTS.md`](../AGENTS.md)

## Overview

Role-specific header components for different user dashboards and the landing page.

All headers are exported via `widgets/header/index.ts` barrel export.

## Components

### `LandingHeader`

Landing page header with navigation and call-to-action buttons.

**Features:**
- Static component (no client state)
- Logo with text on the left
- Navigation links: 기능 소개, 팀 소개, FAQ (scrolls to page sections)
- CTA buttons: 로그인 (secondary) and 시작하기 (primary)
- Responsive: nav links hidden on mobile

**Props:** None

**Usage:**
```tsx
import { LandingHeader } from '@/widgets/header';

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      {/* Rest of landing page */}
    </>
  );
}
```

**Styling:**
- White background with top border
- Gray text for nav links
- Centered layout with max-width constraint

---

### `StudentHeader`

Student dashboard header with notification icon and user profile.

**Features:**
- Client component (uses Supabase auth)
- Logo with text
- Notification bell icon (emoji)
- User avatar circle and name (loaded from `/api/v1/profile`)
- Logout button (signOut via Supabase)
- Responsive layout

**Props:** None

**Behavior:**
- Loads student name from profile API on mount
- Displays email prefix if profile API fails
- Default name: "학생" if no data available

**Usage:**
```tsx
import { StudentHeader } from '@/widgets/header';

export default function StudentDashboardPage() {
  return (
    <>
      <StudentHeader />
      {/* Rest of dashboard */}
    </>
  );
}
```

**Styling:**
- White background with bottom border
- Gray avatar placeholder and notification icon
- Logout button with hover effect

---

### `ProfessorHeader`

Professor dashboard header with professor role badge and user profile.

**Features:**
- Client component (uses Supabase auth)
- Logo with text and **"교수" (Professor) blue badge**
- Notification bell icon (emoji)
- User avatar circle and name
- Logout button (signOut via Supabase)

**Props:** None

**Behavior:**
- Loads professor name from `/api/v1/profile` on mount
- Default name: "교수" if no data available
- Includes blue badge to distinguish from student header

**Usage:**
```tsx
import { ProfessorHeader } from '@/widgets/header';

export default function ProfessorDashboardPage() {
  return (
    <>
      <ProfessorHeader />
      {/* Rest of dashboard */}
    </>
  );
}
```

**Styling:**
- White background with bottom border
- Blue badge with rounded pill shape
- Same layout as StudentHeader but with role indicator

---

### `AdminHeader`

Admin dashboard header with dark theme and admin role badge.

**Features:**
- Client component (uses Supabase auth)
- Logo with text and **"Admin" red badge** (dark theme)
- Notification bell icon (emoji, light color)
- User avatar and name (light text on dark)
- Logout button (light text, hover darker)
- Dark gray background (`bg-gray-800`)

**Props:** None

**Behavior:**
- Loads admin name from `/api/v1/profile` on mount
- Default name: "관리자" if no data available
- Dark theme for admin-only area separation

**Usage:**
```tsx
import { AdminHeader } from '@/widgets/header';

export default function AdminDashboardPage() {
  return (
    <>
      <AdminHeader />
      {/* Rest of admin dashboard */}
    </>
  );
}
```

**Styling:**
- Dark gray background (`bg-gray-800`)
- White logo text
- Light gray text for buttons and labels
- Red admin badge with rounded pill shape
- White/light icon colors for visibility on dark bg

---

## For AI Agents

### Header Selection by Role

Use this pattern to choose the correct header:

```tsx
// Landing page
<LandingHeader />

// Student dashboard
<StudentHeader />

// Professor dashboard
<ProfessorHeader />

// Admin dashboard
<AdminHeader />
```

### Client vs Server

All headers except `LandingHeader` are client components (`'use client'`):
- They call Supabase auth APIs
- They fetch profile data from `/api/v1/profile`
- They use React hooks (`useState`, `useEffect`)
- They can't be used in Server Components directly

**If you need a header in a Server Component:**
```tsx
// ❌ This won't work
export default async function Page() {
  return <StudentHeader />; // Error: Can't use 'use client' in Server Component
}

// ✅ Wrap in a client component
'use client';
export function PageWrapper() {
  return (
    <>
      <StudentHeader />
      {/* Content */}
    </>
  );
}
```

### Logout Behavior

All dashboard headers include logout via Supabase `signOut()`:
- Clears session from Supabase
- Redirects to `/login` page
- Uses Next.js `useRouter` for navigation

### Profile Loading

Dashboard headers load user name from `/api/v1/profile`:

**Expected response:**
```json
{
  "ok": true,
  "data": {
    "profile": {
      "id": "...",
      "name": "Alice",
      "email": "alice@example.com",
      "role": "student"
    }
  }
}
```

If the API fails, headers fall back to default names.

### Notification Icon

Currently, all headers display a notification bell emoji (🔔) as a placeholder.
To add real notifications, replace the emoji with a proper notification component and add click handlers.

<!-- MANUAL: -->
