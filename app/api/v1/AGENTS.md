# app/api/v1/ — API Endpoints

**Parent**: [../AGENTS.md](../AGENTS.md)

Complete reference for all EduRyday v1 API endpoints.

## Response Format

All responses use the pattern from `shared/lib/api/response.ts`:

```tsx
// Success
ok({ data: { ... } })
→ { ok: true, data: { ... } }

// Error
fail(code, message, statusCode)
→ { ok: false, code, message, status: statusCode }
```

## Health Check

### GET /api/v1/health

Service health check. No authentication required.

**Response:**
```json
{
  "ok": true,
  "data": {
    "service": "eduryday",
    "status": "healthy",
    "ts": "2026-03-22T10:30:00.000Z"
  }
}
```

---

## Profile

### GET /api/v1/profile

Fetch authenticated user's profile. Creates profile if missing.

**Auth**: Required (any role)

**Response:**
```json
{
  "ok": true,
  "data": {
    "profile": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "student",
      "status": "pending",
      "student_id": "20240001",
      "department": "컴퓨터공학부"
    }
  }
}
```

### PATCH /api/v1/profile

Update user profile.

**Auth**: Required (any role)

**Request Body:**
```json
{
  "name": "새이름",
  "role": "student",
  "department": "컴퓨터공학부",
  "studentId": "20240001"
}
```

**Validation**:
- `name` — required, min 1 char
- `role` — optional, must be `student` or `professor`
- `department` — required if role is set
- `studentId` — required if role is `student`

**Response:**
```json
{
  "ok": true,
  "data": {
    "name": "새이름",
    "role": "student",
    "studentId": "20240001",
    "department": "컴퓨터공학부",
    "status": "pending"
  }
}
```

**Status auto-update**:
- Configured `ADMIN_EMAIL` → `admin` + `active`
- Everyone else → `pending` (awaits admin approval)

---

## Courses

### GET /api/v1/courses

List courses. Students see only enrolled courses; professors see own courses; admins see all.

**Auth**: Required (any role)

**Query Parameters**:
- `status` — `all` (default), `active`, `closed`, `draft`, `pending`
- `semester` — `all` (default), or specific semester (e.g., `2026-spring`)
- `q` — Search query (searches title and professor name)
- `page` — Page number (default: 1)
- `pageSize` — Items per page (default: 10)

**Response:**
```json
{
  "ok": true,
  "data": {
    "courses": [
      {
        "id": "uuid",
        "name": "강좌명",
        "title": "강좌명",
        "description": "강좌 설명",
        "professor": "교수명",
        "semester": "2026-spring",
        "section": "A",
        "studentCount": 30,
        "students": 30,
        "currentWeek": 5,
        "totalWeeks": 15,
        "status": "진행중",
        "createdAt": "2026-03-01"
      }
    ],
    "total": 45,
    "page": 1,
    "pageSize": 10
  }
}
```

### POST /api/v1/courses

Create a new course.

**Auth**: Required (professor or admin)

**Request Body:**
```json
{
  "title": "강좌명",
  "description": "강좌 설명",
  "semester": "2026-spring",
  "section": "A",
  "professorName": "교수명",
  "studentCount": 30,
  "currentWeek": 1,
  "totalWeeks": 15,
  "status": "active"
}
```

**Validation**:
- `title` — required
- `semester` — required
- `status` — `active`, `closed`, or `draft` (default: `active`)

**Response:**
```json
{
  "ok": true,
  "data": {
    "id": "uuid",
    "title": "강좌명"
  }
}
```

### GET /api/v1/courses/[id]

Fetch single course details. Students must be enrolled.

**Auth**: Required (course owner, or any professor/admin, or enrolled student)

### PATCH /api/v1/courses/[id]

Update course. Professors can update own courses; admins can update any.

**Auth**: Required (professor/admin)

### DELETE /api/v1/courses/[id]

Delete course.

**Auth**: Required (professor/admin)

---

## Assignments

### GET /api/v1/assignments

List assignments. Can filter by course.

**Auth**: Required (any role)

**Query Parameters**:
- `courseId` — Filter by course ID

**Response:**
```json
{
  "ok": true,
  "data": {
    "assignments": [
      {
        "id": "uuid",
        "title": "과제명",
        "course": "강좌명",
        "type": "coding",
        "deadline": "2026-04-01T23:59:59Z",
        "submitted": 25,
        "total": 30,
        "graded": 10,
        "status": "active"
      }
    ]
  }
}
```

### POST /api/v1/assignments

Create assignment.

**Auth**: Required (professor or admin)

**Request Body:**
```json
{
  "title": "과제명",
  "courseId": "uuid",
  "description": "과제 설명",
  "type": "coding",
  "deadline": "2026-04-01T23:59:59Z",
  "status": "active",
  "rubric": [
    { "criterion": "정확성", "weight": 50 },
    { "criterion": "코드 품질", "weight": 30 },
    { "criterion": "문서화", "weight": 20 }
  ]
}
```

**Validation**:
- `title` — required
- `courseId` — required
- `type` — `coding`, `essay`, `multiple-choice`, or `file` (default: `coding`)
- `status` — `active` or `draft` (default: `draft`)

**Response:**
```json
{
  "ok": true,
  "data": {
    "id": "uuid",
    "title": "과제명",
    "createdAt": "2026-03-22T10:30:00Z"
  }
}
```

### GET /api/v1/assignments/[id]

Fetch assignment details.

**Auth**: Required (any role with course access)

### PATCH /api/v1/assignments/[id]

Update assignment. Professors can update own assignments; admins can update any.

**Auth**: Required (professor/admin)

### DELETE /api/v1/assignments/[id]

Delete assignment.

**Auth**: Required (professor/admin)

---

## Submissions

### GET /api/v1/submissions

List submissions. Can filter by assignment. Students see own submissions only.

**Auth**: Required (any role)

**Query Parameters**:
- `assignmentId` — Filter by assignment ID

**Response:**
```json
{
  "ok": true,
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "name": "학생명",
        "studentId": "20240001",
        "submittedAt": "03-22 10:30",
        "autoScore": "85/100",
        "testsPassed": "8/10",
        "aiAnalysis": "코드 구조가 좋음. 변수명 개선 필요.",
        "aiAnalysisVariant": "green",
        "aiSubNote": "피드백 추가",
        "finalScore": "85",
        "status": "graded"
      }
    ]
  }
}
```

**Status values**: `submitted`, `grading`, `graded`, `unsubmitted`

### POST /api/v1/submissions

Submit assignment answer.

**Auth**: Required (active student)

**Request Body:**
```json
{
  "assignmentId": "uuid",
  "studentName": "학생명",
  "studentNumber": "20240001",
  "answer": "코드 또는 답변 내용"
}
```

**Validation**:
- `assignmentId` — required

**Response:**
```json
{
  "ok": true,
  "data": {
    "id": "uuid",
    "status": "submitted",
    "assignmentId": "uuid"
  }
}
```

Submissions are saved as `submitted`, then automatic/manual grading moves them through `grading` and `graded`.

### GET /api/v1/submissions/[id]

Fetch submission details. Students see own; professors/admins see all.

**Auth**: Required (any role with access)

### PATCH /api/v1/submissions/[id]

Update submission status/score. Professors/admins only.

**Auth**: Required (professor/admin)

**Request Body**:
```json
{
  "status": "graded",
  "finalScore": 95,
  "feedback": "매우 좋은 제출입니다."
}
```

---

## Users

### GET /api/v1/users

Admin only. List all users with filtering.

**Auth**: Required (admin)

**Query Parameters**:
- `role` — `all` (default), `student`, `professor`, `admin`
- `status` — `all` (default), `pending`, `active`, `suspended`
- `q` — Search name or email
- `page` — Page number (default: 1)
- `pageSize` — Items per page (default: 10)

**Response:**
```json
{
  "ok": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "name": "홍길동",
        "email": "hong@example.com",
        "role": "교수",
        "status": "활성",
        "joinedAt": "2026-03-01",
        "lastLogin": "2026-03-22 10:30"
      }
    ],
    "total": 150,
    "page": 1,
    "pageSize": 10,
    "stats": {
      "totalUsers": 150,
      "students": 100,
      "professors": 40,
      "active": 145
    }
  }
}
```

### GET /api/v1/users/[id]

Fetch user details. Users see own; admins see all.

**Auth**: Required (any role)

### PATCH /api/v1/users/[id]

Update user. Users update own; admins update any.

**Auth**: Required (any role)

**Request Body**:
```json
{
  "name": "새이름",
  "status": "active"
}
```

---

## Announcements

### GET /api/v1/announcements

List announcements. Can filter by course.

**Auth**: Required (any role)

**Query Parameters**:
- `courseId` — Filter by course ID

**Response:**
```json
{
  "ok": true,
  "data": {
    "announcements": [
      {
        "id": "uuid",
        "title": "공지 제목",
        "content": "공지 내용",
        "courseId": "uuid",
        "course": "강좌명",
        "createdAt": "2026-03-22",
        "views": 45,
        "pinned": true
      }
    ]
  }
}
```

### POST /api/v1/announcements

Create announcement.

**Auth**: Required (professor or admin)

**Request Body:**
```json
{
  "title": "공지 제목",
  "content": "공지 내용",
  "courseId": "uuid",
  "pinned": true
}
```

**Validation**:
- `title` — required
- `content` — required
- `courseId` — required

**Response:**
```json
{
  "ok": true,
  "data": {
    "id": "uuid"
  }
}
```

### GET /api/v1/announcements/[id]

Fetch announcement.

**Auth**: Required (any role)

### PATCH /api/v1/announcements/[id]

Update announcement. Creators can update own; admins can update any.

**Auth**: Required (professor/admin)

### DELETE /api/v1/announcements/[id]

Delete announcement.

**Auth**: Required (professor/admin)

---

## Logs

### GET /api/v1/logs

Admin only. List activity logs.

**Auth**: Required (admin)

**Query Parameters**:
- `type` — `login`, `submit`, `ai`, `course`, `error`, `grading`, `access`
- `page` — Page number
- `limit` — Items per request

**Response:**
```json
{
  "ok": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "type": "login",
        "user": "홍길동",
        "userRole": "student",
        "message": "로그인 성공",
        "ip": "192.168.1.1",
        "createdAt": "2026-03-22T10:30:00Z"
      }
    ]
  }
}
```

---

## For AI Agents

### Response Helper Pattern

Import and use helpers from `shared/lib/api/response.ts`:

```tsx
import { ok, fail } from '@/shared/lib/api/response';

// Success
return ok({ data: value });

// Error
return fail('ERROR_CODE', 'Human message', 401);
```

### Auth Pattern

```tsx
import { getRouteAuthContext, getServiceRoleClient } from '@/shared/lib/supabase/route';

export async function GET(req: Request) {
  const auth = await getRouteAuthContext();
  if (!auth) {
    return fail('UNAUTHORIZED', '로그인이 필요합니다.', 401);
  }

  const client = getServiceRoleClient();
  if (!client) {
    return fail('CONFIG_ERROR', 'Supabase 설정 오류', 500);
  }

  // Now use client to query Supabase
  const { data, error } = await client.from('table').select('*');
  if (error) {
    return fail('DB_ERROR', error.message, 500);
  }

  return ok({ result: data });
}
```

### Query Building

```tsx
let query = client.from('table').select('id, name, email');

// Filter by field
query = query.eq('status', 'active');

// Search (case-insensitive like)
query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);

// Pagination
const page = 1;
const pageSize = 10;
const from = (page - 1) * pageSize;
const to = from + pageSize - 1;
query = query.range(from, to);

// Execute with count
const { data, error, count } = await query;
```

### Type Safety

Define interface for each table row:

```tsx
interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin' | null;
  status: 'pending' | 'active' | 'suspended';
}

const rows = (data ?? []) as UserRow[];
```

### Validation Pattern

```tsx
const body = await req.json().catch(() => null);

if (!body?.required_field) {
  return fail('VALIDATION_ERROR', 'required_field is required');
}

const trimmed = typeof body?.name === 'string' ? body.name.trim() : '';
if (trimmed.length < 1) {
  return fail('VALIDATION_ERROR', 'name must have 1+ chars');
}
```

### Role-Based Access Control

```tsx
// Require specific role
if (!auth || auth.role !== 'admin') {
  return fail('UNAUTHORIZED', '관리자 권한이 필요합니다.', 401);
}

// Require account to be active
if (auth.status !== 'active') {
  return fail('FORBIDDEN', '활성 계정만 이용 가능합니다.', 403);
}

// Allow multiple roles
if (!auth || (auth.role !== 'professor' && auth.role !== 'admin')) {
  return fail('UNAUTHORIZED', '교수 또는 관리자 권한이 필요합니다.', 401);
}
```

### Upsert Pattern (Create or Update)

```tsx
const { data, error } = await client
  .from('profiles')
  .upsert(
    {
      id: auth.userId,
      name: 'new name',
      email: auth.email,
    },
    { onConflict: 'id' } // Which column triggers the conflict
  )
  .select('id, name')
  .single();
```

<!-- MANUAL: Comprehensive API endpoint reference for v1. All endpoints documented with auth, request/response formats, query parameters, validation. Supabase patterns and response helpers. -->
