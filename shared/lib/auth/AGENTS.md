# shared/lib/auth/ AGENTS.md

**Parent:** [`../AGENTS.md`](../AGENTS.md)

## Overview

This module provides **authentication utilities** — types for roles and user status, profile validation, and routing helpers.

## Types

### `AppRole`

```tsx
type AppRole = 'student' | 'professor' | 'admin';
```

The three user roles in EduRyday.

---

### `ProfileStatus`

```tsx
type ProfileStatus = 'pending' | 'active' | 'suspended';
```

User account status:
- `pending` — Account created but not yet activated
- `active` — Account is active and can log in
- `suspended` — Account is temporarily suspended

---

### `ProfileRecord`

```tsx
interface ProfileRecord {
  id: string;
  email: string;
  name: string;
  role: AppRole | null;
  status: ProfileStatus;
  student_id?: string | null;      // For students
  department?: string | null;       // For professors
}
```

Complete user profile structure.

---

## Functions

### `isAdminEmail(email: string | null | undefined): boolean`

Checks if an email matches the admin email (from `ADMIN_EMAIL` env var, default: `eduryday@gmail.com`).

**Usage:**
```tsx
import { isAdminEmail } from '@/shared/lib/auth/profile';

if (isAdminEmail(user.email)) {
  // Grant admin privileges
}
```

---

### `normalizeRole(role: string | null | undefined): AppRole | null`

Validates and normalizes a role string. Returns the role if valid, or `null` if invalid.

**Usage:**
```tsx
import { normalizeRole } from '@/shared/lib/auth/profile';

const validatedRole = normalizeRole(rawRole);
if (!validatedRole) {
  return fail('INVALID_ROLE', 'Role must be student, professor, or admin');
}
```

**Returns:**
- `'student'`, `'professor'`, or `'admin'` if input matches
- `null` otherwise

---

### `normalizeStatus(status: string | null | undefined): ProfileStatus`

Validates and normalizes a status string. Returns the status if valid, or `'pending'` as default.

**Usage:**
```tsx
import { normalizeStatus } from '@/shared/lib/auth/profile';

const validatedStatus = normalizeStatus(rawStatus);
// Returns 'active' or 'suspended' if valid, 'pending' otherwise
```

**Returns:**
- `'active'` if input is `'active'`
- `'suspended'` if input is `'suspended'`
- `'pending'` otherwise (default)

---

### `getDashboardPath(role: AppRole): string`

Returns the dashboard route path for a given role.

**Usage:**
```tsx
import { getDashboardPath } from '@/shared/lib/auth/profile';

const dashPath = getDashboardPath(user.role);
router.push(dashPath);
```

**Returns:**
- `'/student/dashboard'` for `'student'`
- `'/professor/dashboard'` for `'professor'`
- `'/admin/dashboard'` for `'admin'`

---

## For AI Agents

### Environment Variables

The admin email is controlled by `ADMIN_EMAIL` environment variable:

```bash
ADMIN_EMAIL=eduryday@gmail.com  # Default if not set
```

Update in `.env.local` or deployment config to change the admin email.

### Type Safety

Always use these helpers to validate user input before using it:

```tsx
// ❌ Unsafe
const role: AppRole = rawRole as AppRole;

// ✅ Safe
const role = normalizeRole(rawRole);
if (!role) {
  return fail('INVALID_ROLE', '...');
}
```

<!-- MANUAL: -->
