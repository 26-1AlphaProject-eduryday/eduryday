# shared/lib/api/ AGENTS.md

**Parent:** [`../AGENTS.md`](../AGENTS.md)

## Overview

This module provides **response helpers** for consistent API response formatting across all `app/api/v1/` routes.

## Functions

### `ok<T>(data: T): Response`

Returns a successful response with status 200.

**Signature:**
```tsx
export function ok<T>(data: T) {
  return Response.json({ ok: true, data });
}
```

**Usage:**
```tsx
// app/api/v1/profile/route.ts
import { ok } from '@/shared/lib/api/response';

export async function GET() {
  const profile = { id: '123', name: 'Alice', role: 'student' };
  return ok(profile);
}
```

**Response:**
```json
{
  "ok": true,
  "data": { "id": "123", "name": "Alice", "role": "student" }
}
```

---

### `fail(code: string, message: string, status?: number): Response`

Returns an error response with configurable status code (default 400).

**Signature:**
```tsx
export function fail(code: string, message: string, status = 400) {
  return Response.json({ ok: false, code, message }, { status });
}
```

**Usage:**
```tsx
// app/api/v1/profile/route.ts
import { fail } from '@/shared/lib/api/response';

export async function GET() {
  const user = await getUser();
  if (!user) {
    return fail('AUTH_REQUIRED', 'User not authenticated', 401);
  }
  // ... rest of handler
}
```

**Response (401):**
```json
{
  "ok": false,
  "code": "AUTH_REQUIRED",
  "message": "User not authenticated"
}
```

---

## For AI Agents

### API Response Shape

All API routes in `app/api/v1/` must follow this shape:

**Success:**
```tsx
{ ok: true, data: <T> }
```

**Error:**
```tsx
{ ok: false, code: string, message: string }
```

### Common Patterns

```tsx
// Validation error
if (!body.email) {
  return fail('INVALID_EMAIL', 'Email is required', 400);
}

// Not found
if (!record) {
  return fail('NOT_FOUND', 'Record not found', 404);
}

// Unauthorized
if (!isAdmin) {
  return fail('FORBIDDEN', 'Admin access required', 403);
}

// Server error
try {
  // ...
} catch (error) {
  return fail('SERVER_ERROR', 'Internal server error', 500);
}
```

### Never Use `Response.json()` Directly

Always use `ok()` or `fail()` to maintain consistent response shape across the API.

<!-- MANUAL: -->
