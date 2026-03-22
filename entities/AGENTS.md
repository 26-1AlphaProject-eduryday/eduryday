# entities/ Layer

**Parent:** `../AGENTS.md`

## Overview

The `entities/` directory is the FSD entities layer. It defines the business domain types and models that are shared across pages and widgets. Each entity is a self-contained business concept (User, Course, Assignment, Submission, Chat).

## Structure

Each entity follows this consistent pattern:

```
entities/<entity-name>/
├── model/
│   └── types.ts                 # TypeScript interfaces and types
└── index.ts                     # Barrel export
```

- **`model/types.ts`** — Domain type definitions (interfaces, unions, constants).
- **`index.ts`** — Re-export all types: `export type { Type1, Type2 } from './model/types';`

## Entity Directory

### user/

**Exports:**
- `Student` — Student user profile
- `Professor` — Professor user profile with title
- `UserRole` — Role union: `'student' | 'professor' | 'admin'`

**Key types:**
```ts
interface Student {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface Professor {
  id: string;
  name: string;       // e.g., "이현기"
  title: string;      // e.g., "교수님"
  email: string;
  avatarUrl?: string;
}

type UserRole = 'student' | 'professor' | 'admin';
```

**Use cases:**
- Import when displaying user info in headers, profiles, or dashboards.
- Store in session or context for role-based routing.

---

### course/

**Exports:**
- `StudentCourse` — Course view for students (progress tracking)
- `ProfessorCourse` — Course view for professors (management)
- `Week` — Week structure within a course
- `Lesson` — Individual lesson (lecture, practice, quiz)
- `LessonType` — Type union: `'lecture' | 'practice' | 'quiz'`
- `WeekStatus` — Status union: `'done' | 'in-progress' | 'locked'`
- `CourseResource` — Downloadable/viewable course material
- `Deadline` — Course deadline item

**Key types:**
```ts
interface StudentCourse {
  id: string;
  title: string;
  professor: string;
  progress: number;         // 0-100
}

interface ProfessorCourse {
  id: string;
  title: string;
  semester: string;
  students: number;
  currentWeek: number;
  totalWeeks: number;
}

interface Week {
  id: string;
  number: number;
  title: string;
  status: WeekStatus;
  lessons?: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  completed: boolean;
  active?: boolean;
}

interface CourseResource {
  id: string;
  title: string;
  completed: boolean;
  isPdf?: boolean;
}

interface Deadline {
  id: string;
  title: string;
  course: string;
  dday: string;
  ddayUrgent: boolean;
  date: string;
}
```

**Use cases:**
- Use `StudentCourse` in dashboards and course lists.
- Use `ProfessorCourse` in professor management pages.
- Use `Week` and `Lesson` in course detail and IDE pages.
- Use `Deadline` in dashboard deadline sections.

---

### assignment/

**Exports:**
- `Assignment` — Assignment metadata
- `RubricCriterion` — Grading rubric criterion
- `TestResult` — Automated test result
- `TestResultStatus` — Test status union: `'pass' | 'fail' | 'pending'`

**Key types:**
```ts
interface Assignment {
  id: string;
  title: string;
  type: 'coding' | 'essay' | 'multiple-choice' | 'file';
  deadline: string;
  totalScore: number;
}

interface RubricCriterion {
  id: number;
  weight: number;
  description: string;
  aiResult: string;
}

interface TestResult {
  label: string;
  status: TestResultStatus;
  detail: string;
}

type TestResultStatus = 'pass' | 'fail' | 'pending';
```

**Use cases:**
- Use `Assignment` in student assignment lists and detail pages.
- Use `RubricCriterion` when displaying grading rubrics.
- Use `TestResult` in IDE pages to show test execution results.

---

### submission/

**Exports:**
- `Submission` — Student submission record
- `SubmissionStatus` — Status union: `'complete' | 'reviewing' | 'unsubmitted'`
- `AiAnalysisVariant` — AI analysis color variant: `'green' | 'yellow' | 'red'`

**Key types:**
```ts
interface Submission {
  id: string;
  name: string;
  studentId: string;
  submittedAt: string;
  autoScore: string;
  testsPassed: string;
  aiAnalysis: string;
  aiAnalysisVariant: AiAnalysisVariant;
  aiSubNote?: string;
  finalScore: string;
  status: SubmissionStatus;
}

type SubmissionStatus = 'complete' | 'reviewing' | 'unsubmitted';
type AiAnalysisVariant = 'green' | 'yellow' | 'red';
```

**Use cases:**
- Use in grading pages and submission lists.
- Display AI analysis with color coding (green = good, yellow = warning, red = needs work).
- Track submission status throughout the grading workflow.

---

### chat/

**Exports:**
- `Conversation` — AI tutor conversation record

**Key types:**
```ts
interface Conversation {
  id: string;
  title: string;
  course: string;
  time: string;
  active?: boolean;
}
```

**Use cases:**
- Use in AI tutor page to list conversation history.
- Track active conversation state.

---

## For AI Agents

### Import Pattern

All entity types are barrel-exported from `index.ts`. Always import from the entity root:

```tsx
// Correct
import type { Student, Professor } from '@/entities/user';
import type { StudentCourse, Deadline } from '@/entities/course';
import type { Assignment, TestResult } from '@/entities/assignment';

// Avoid
import type { Student } from '@/entities/user/model/types'; // Too deep
```

### Using Entity Types

1. **In page components:** Define local interface extending or composing entity types
   ```tsx
   import type { StudentCourse, Deadline } from '@/entities/course';

   interface StudentDashboardProps {
     courses: StudentCourse[];
     deadlines: Deadline[];
   }
   ```

2. **In widgets:** Accept entity types as props
   ```tsx
   interface CourseCardProps {
     course: StudentCourse;
     onSelect?: (id: string) => void;
   }
   ```

3. **In shared utilities:** Define reusable functions over entities
   ```tsx
   export function formatDeadline(deadline: Deadline): string {
     // ...
   }
   ```

### Mock Data (Legacy)

Before migration to Supabase is complete, some entities may provide mock data constants:

- Prefix: `MOCK_*` (e.g., `MOCK_STUDENT_COURSES`, `MOCK_SUBMISSIONS`)
- These are temporary and should be replaced with real API fetchers
- Check `shared/lib/supabase/` for data-fetching functions as the backend stabilizes

Example structure (may vary by entity):
```ts
export const MOCK_STUDENT_COURSES: StudentCourse[] = [
  { id: '1', title: '...' , professor: '...', progress: 50 },
  // ...
];
```

### Supabase Migration

The project is transitioning to Supabase. Data fetchers are moving to `shared/lib/supabase/`:

- Check `shared/lib/supabase/*.ts` for functions like `getStudentCourses()`, `getAssignments()`, etc.
- These async functions replace mock data.
- Pages can call these functions directly (server components) or via API routes.

### Adding a New Entity

1. Create the directory structure:
   ```
   entities/new-entity/
   ├── model/
   │   └── types.ts
   └── index.ts
   ```

2. Define types in `model/types.ts`:
   ```tsx
   export interface NewEntity {
     id: string;
     // ... fields
   }

   export type NewEntityStatus = 'active' | 'inactive';
   ```

3. Barrel-export in `index.ts`:
   ```ts
   export type { NewEntity, NewEntityStatus } from './model/types';
   ```

4. Import and use across pages and widgets:
   ```tsx
   import type { NewEntity } from '@/entities/new-entity';
   ```

<!-- MANUAL: Entities define the business domain. Keep types stable; avoid implementation details. Types should be importable by any page or widget without creating circular dependencies. -->
