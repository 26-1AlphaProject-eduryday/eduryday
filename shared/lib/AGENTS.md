# shared/lib/ AGENTS.md

**Parent:** [`../AGENTS.md`](../AGENTS.md)

## Overview

This directory contains **utility functions and helper modules** for shared functionality.
Organized into focused subdirectories by concern.

## Subdirectories

### `api/`

**Purpose:** API response helpers for consistent response formatting.

**Key Function:**
- `ok<T>(data: T)` → Returns `{ ok: true, data }`
- `fail(code: string, message: string, status?: number)` → Returns `{ ok: false, code, message }`

**See:** [`shared/lib/api/AGENTS.md`](./api/AGENTS.md)

---

### `auth/`

**Purpose:** Authentication utilities — types, profile helpers, role normalization, routing.

**Key Exports:**
- `AppRole` type: `'student' | 'professor' | 'admin'`
- `ProfileStatus` type: `'pending' | 'active' | 'suspended'`
- `ProfileRecord` interface: user profile data structure
- `isAdminEmail(email)` → Check if email is the admin email
- `normalizeRole(role)` → Validate and normalize role string
- `normalizeStatus(status)` → Validate and normalize status string
- `getDashboardPath(role)` → Get dashboard route for role

**See:** [`shared/lib/auth/AGENTS.md`](./auth/AGENTS.md)

---

### `supabase/`

**Purpose:** Supabase client setup and UI seed data fetchers.

**Key Modules:**
- `server.ts` → `getSupabaseServerClient()` for server-side use
- `auth-browser.ts` → `getSupabaseBrowserClient()` for client-side use
- `ui-seed.ts` → Async data fetchers for UI seed data (getCurrentStudent, getProfessorCourses, etc.)

**See:** [`shared/lib/supabase/AGENTS.md`](./supabase/AGENTS.md)

---

## Import Pattern

```tsx
// API helpers
import { ok, fail } from '@/shared/lib/api/response';

// Auth utilities
import { normalizeRole, getDashboardPath, isAdminEmail } from '@/shared/lib/auth/profile';

// Supabase client
import { getSupabaseServerClient } from '@/shared/lib/supabase/server';
import { getSupabaseBrowserClient } from '@/shared/lib/supabase/auth-browser';

// UI seed data
import { getCurrentStudent, getProfessorCourses } from '@/shared/lib/supabase/ui-seed';
```

<!-- MANUAL: -->
