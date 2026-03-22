# app/api/ — API Layer

**Parent**: [../AGENTS.md](../AGENTS.md)

This directory contains versioned API endpoints. Currently, all endpoints are under `v1/`.

## Directory Structure

```
app/api/
└── v1/
    ├── health/
    │   └── route.ts                        GET /api/v1/health
    ├── profile/
    │   └── route.ts                        GET, PATCH /api/v1/profile
    ├── courses/
    │   ├── route.ts                        GET, POST /api/v1/courses
    │   └── [id]/route.ts                   GET, PATCH, DELETE /api/v1/courses/[id]
    ├── assignments/
    │   ├── route.ts                        GET, POST /api/v1/assignments
    │   └── [id]/route.ts                   GET, PATCH, DELETE /api/v1/assignments/[id]
    ├── submissions/
    │   ├── route.ts                        GET, POST /api/v1/submissions
    │   └── [id]/route.ts                   GET, PATCH /api/v1/submissions/[id]
    ├── users/
    │   ├── route.ts                        GET /api/v1/users (admin only)
    │   └── [id]/route.ts                   GET, PATCH /api/v1/users/[id]
    ├── announcements/
    │   ├── route.ts                        GET, POST /api/v1/announcements
    │   └── [id]/route.ts                   GET, PATCH, DELETE /api/v1/announcements/[id]
    └── logs/
        └── route.ts                        GET /api/v1/logs (admin only)
```

## Response Format

All endpoints use the response helpers from `shared/lib/api/response.ts`:

### Success Response
```json
{
  "ok": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "ok": false,
  "code": "ERROR_CODE",
  "message": "Human-readable message",
  "status": 400
}
```

Common error codes:
- `UNAUTHORIZED` (401) — Not logged in or insufficient permissions
- `FORBIDDEN` (403) — Authenticated but action not allowed
- `VALIDATION_ERROR` (400) — Request validation failed
- `DB_ERROR` (500) — Database operation failed
- `CONFIG_ERROR` (500) — Missing Supabase configuration

## Auth & Data Access

All routes:
1. Call `getRouteAuthContext()` to get `{ userId, email, role, status }`
2. Call `getServiceRoleClient()` to get Supabase client with service role credentials
3. Check `auth.role` to enforce role-based access control (student, professor, admin)
4. Return error responses early if auth/config fails

Roles:
- `student` — Can only access own data
- `professor` — Can create courses, assignments; grade submissions
- `admin` — Can access all data, manage users, view logs
- `null` — Not yet approved; limited access

## Endpoint Reference

See [v1/AGENTS.md](v1/AGENTS.md) for complete endpoint documentation and examples.

<!-- MANUAL: API layer documentation. Versioned structure (v1/). Response helpers from shared/lib/api/response. Auth via Supabase. -->
