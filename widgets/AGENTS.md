# widgets/ AGENTS.md

**Parent:** [`../AGENTS.md`](../AGENTS.md)

## Overview

This is the **FSD widgets layer** — complex, independent UI blocks that are too large or specialized to be in `shared/ui/`, but reusable across pages.

Widgets typically:
- Combine multiple UI components
- Have role-specific or context-specific variants
- Are used across multiple pages
- Include some business logic or state management (if needed)

## Subdirectories

### `header/`

Role-specific header/navigation components.

- `LandingHeader` — Public landing page header with nav and CTA buttons
- `StudentHeader` — Student dashboard header with avatar and logout
- `ProfessorHeader` — Professor dashboard header with professor badge
- `AdminHeader` — Admin dashboard header (dark theme with admin badge)

**See:** [`widgets/header/AGENTS.md`](./header/AGENTS.md)

---

### `sidebar/`

Role-specific navigation sidebar components.

- `StudentSidebar` — Student navigation with dashboard, courses, assignments, grades, etc.
- `ProfessorSidebar` — Professor navigation with courses, assignments, grading, etc.
- `AdminSidebar` — Admin navigation with users, courses, logs (dark theme)

**See:** [`widgets/sidebar/AGENTS.md`](./sidebar/AGENTS.md)

---

## Import Pattern

```tsx
import { StudentHeader, ProfessorHeader, AdminHeader, LandingHeader } from '@/widgets/header';
import { StudentSidebar, ProfessorSidebar, AdminSidebar } from '@/widgets/sidebar';
```

## Layout Pattern

Widgets are typically used in page layouts to avoid duplication:

```tsx
// _pages/student-dashboard/ui/StudentDashboardPage.tsx
'use client';

import { StudentHeader } from '@/widgets/header';
import { StudentSidebar } from '@/widgets/sidebar';

export function StudentDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StudentHeader />
      <div className="flex flex-1">
        <StudentSidebar activeItem="대시보드" />
        <main className="flex-1 p-6">
          {/* Page content */}
        </main>
      </div>
    </div>
  );
}
```

## For AI Agents

### When to Create a Widget

Create a widget when:
- A component is used on 2+ pages
- It combines multiple `shared/ui` components
- It has role-specific or context-specific variants
- It's too large/complex to be a primitive UI component

### When to Keep as Page Component

Keep components in `_pages/` when:
- They're only used on one page
- They're specific to that page's business logic
- They don't need to be reused elsewhere

### Adding a New Widget

1. Create `widgets/<category>/` directory if needed
2. Create component file(s) inside
3. Create `widgets/<category>/index.ts` barrel export if it doesn't exist
4. Export component from barrel

**Example:**
```tsx
// widgets/footer/Footer.tsx
export function Footer() {
  return <footer>...</footer>;
}

// widgets/footer/index.ts
export { Footer } from './Footer';

// Usage in page
import { Footer } from '@/widgets/footer';
<Footer />
```

<!-- MANUAL: -->
