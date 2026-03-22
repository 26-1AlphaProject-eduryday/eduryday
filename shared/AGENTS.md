# shared/ AGENTS.md

**Parent:** [`../AGENTS.md`](../AGENTS.md)

This is the **FSD shared layer** — the foundation of the Feature-Sliced Design architecture.
The shared layer contains reusable primitives (UI components, utilities, helpers) that can be imported by any other FSD layer (`_pages/`, `widgets/`, `features/`, `entities/`).

## Directory Structure

```
shared/
├── ui/              ← Reusable UI components (Button, Card, Badge, etc.)
├── lib/             ← Utility functions and helpers
│   ├── api/         ← API response helpers (ok, fail)
│   ├── auth/        ← Authentication utilities (profile, roles)
│   └── supabase/    ← Supabase client setup and data fetchers
└── AGENTS.md        ← This file
```

## For AI Agents

### Core Rules

1. **Lowest FSD layer** — Shared can import from nowhere except external packages and Node APIs. Nothing should import shared circularly.
2. **No business logic** — Shared contains only reusable, business-logic-free primitives.
3. **Used everywhere** — UI components and utilities here are safe to use in `_pages/`, `widgets/`, `features/`, and `entities/`.

### UI Components

All UI components use **Tailwind CSS v4** (inline classes, no separate CSS files).

- No external CSS dependencies
- Variants and sizes are controlled via string unions and props
- Components accept optional `className` for composition
- Export all components via `shared/ui/index.ts` barrel

**See:** [`shared/ui/AGENTS.md`](./ui/AGENTS.md)

### Shared Library Modules

- **`lib/api/`** — API response helpers (`ok()`, `fail()`) for consistency
- **`lib/auth/`** — Profile types, role normalization, dashboard routing
- **`lib/supabase/`** — Supabase client setup and UI seed data fetchers

**See:** [`shared/lib/AGENTS.md`](./lib/AGENTS.md)

## Import Patterns

```tsx
// UI components via barrel export
import { Button, Card, Badge, Input, ProgressBar, StatCard } from '@/shared/ui';

// API helpers
import { ok, fail } from '@/shared/lib/api/response';

// Auth utilities
import { normalizeRole, getDashboardPath, isAdminEmail } from '@/shared/lib/auth/profile';

// Supabase client
import { getSupabaseServerClient } from '@/shared/lib/supabase/server';

// UI seed data fetchers
import { getCurrentStudent, getProfessorCourses } from '@/shared/lib/supabase/ui-seed';
```

## Common Tasks

### Adding a New UI Component

1. Create `shared/ui/<component-name>.tsx` with props interface and component function
2. Export from `shared/ui/index.ts`
3. Use Tailwind CSS classes only (no external CSS)
4. Include size/variant variants if applicable
5. Accept optional `className` for composition

**Example:**
```tsx
// shared/ui/my-component.tsx
interface MyComponentProps {
  label: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function MyComponent({ label, variant = 'primary', className = '' }: MyComponentProps) {
  const variantClasses = { primary: '...', secondary: '...' };
  return <div className={`${variantClasses[variant]} ${className}`.trim()}>{label}</div>;
}
```

```tsx
// shared/ui/index.ts
export { MyComponent } from './my-component';
```

### Adding a New Auth Helper

1. Add to `shared/lib/auth/profile.ts`
2. Export the function
3. Document the purpose in the file

### Adding a New Data Fetcher

1. Add async function to `shared/lib/supabase/ui-seed.ts`
2. Use the `getSeed<T>()` pattern for consistency
3. Provide TypeScript interface for the data shape
4. Provide fallback value

<!-- MANUAL: -->
