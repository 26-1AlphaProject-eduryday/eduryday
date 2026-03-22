# shared/lib/supabase/ AGENTS.md

**Parent:** [`../AGENTS.md`](../AGENTS.md)

## Overview

This module provides **Supabase client setup** and **UI seed data fetchers**.

The Supabase clients are used for authentication and querying the `ui_seed_data` table,
which contains fallback data for UI components when the database is unavailable or empty.

## Client Setup

### `getSupabaseServerClient(): SupabaseClient | null`

**Location:** `shared/lib/supabase/server.ts`

Creates a server-side Supabase client for use in Server Components and API routes.

**Features:**
- Session persistence disabled (stateless)
- Auto-refresh disabled (no token refresh)
- Returns `null` if environment variables are missing

**Usage:**
```tsx
import { getSupabaseServerClient } from '@/shared/lib/supabase/server';

const supabase = getSupabaseServerClient();
if (!supabase) {
  console.warn('Supabase not configured');
  return;
}

const { data, error } = await supabase.from('table').select('*');
```

**Environment Requirements:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

### `getSupabaseBrowserClient(): SupabaseClient | null`

**Location:** `shared/lib/supabase/auth-browser.ts`

Creates a client-side Supabase client for use in Client Components.

**Features:**
- Full auth session support
- Token refresh enabled
- Returns `null` if environment variables are missing

**Usage:**
```tsx
'use client';

import { getSupabaseBrowserClient } from '@/shared/lib/supabase/auth-browser';

const supabase = getSupabaseBrowserClient();
if (!supabase) {
  return <div>Supabase not configured</div>;
}

const { data } = await supabase.auth.getUser();
```

---

## UI Seed Data Fetchers

**Location:** `shared/lib/supabase/ui-seed.ts`

These async functions fetch seed data from the `ui_seed_data` table in Supabase.
If the query fails or data is missing, they return a fallback value.

### Pattern

All fetchers follow this pattern:

```tsx
async function getSeed<T>(key: string, fallback: T): Promise<T> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from('ui_seed_data')
    .select('payload')
    .eq('key', key)
    .single<SeedRow>();

  if (error || !data?.payload) return fallback;
  return data.payload as T;
}
```

### Available Fetchers

#### User Data

```tsx
export async function getCurrentStudent(): Promise<Student> { ... }
export async function getCurrentProfessor(): Promise<Professor> { ... }
```

#### Course Data

```tsx
export async function getStudentCourses(): Promise<StudentCourse[]> { ... }
export async function getProfessorCourses(): Promise<ProfessorCourse[]> { ... }
export async function getCourseWeeks(): Promise<Week[]> { ... }
export async function getCourseResources(): Promise<CourseResource[]> { ... }
export async function getDeadlines(): Promise<Deadline[]> { ... }
```

#### Assignment & Grading

```tsx
export async function getRubricCriteria(): Promise<RubricCriterion[]> { ... }
export async function getTestResults(): Promise<TestResult[]> { ... }
export async function getSubmissions(): Promise<Submission[]> { ... }
```

#### Chat

```tsx
export async function getConversations(): Promise<Conversation[]> { ... }
```

#### Professor Dashboard

```tsx
export async function getProfessorAssignments(): Promise<ProfessorAssignmentRecord[]> { ... }
export async function getProfessorAnnouncements(): Promise<ProfessorAnnouncementRecord[]> { ... }
export async function getProfessorDashboardStats(): Promise<ProfessorDashboardStat[]> { ... }
export async function getProfessorActivities(): Promise<ProfessorActivityRecord[]> { ... }
export async function getProfessorAnalyticsStatCards(): Promise<ProfessorAnalyticsStatCard[]> { ... }
export async function getProfessorMisconceptions(): Promise<ProfessorMisconceptionRecord[]> { ... }
export async function getProfessorWeeklyParticipation(): Promise<ProfessorWeeklyParticipationRecord[]> { ... }
export async function getProfessorQuestionPatterns(): Promise<ProfessorQuestionPatternRecord[]> { ... }
```

#### Student Dashboard

```tsx
export async function getStudentGrades(): Promise<StudentGradeRecord[]> { ... }
export async function getLearningStats(): Promise<LearningStatRecord[]> { ... }
export async function getCompletedCourses(): Promise<CompletedCourseRecord[]> { ... }
export async function getStudentDashboardStats(): Promise<StudentDashboardStat[]> { ... }
```

#### Landing Page

```tsx
export async function getLandingFeatures(): Promise<LandingFeatureRecord[]> { ... }
export async function getLandingStats(): Promise<LandingStatRecord[]> { ... }
export async function getLandingTeam(): Promise<LandingTeamRecord[]> { ... }
export async function getLandingFaq(): Promise<LandingFaqRecord[]> { ... }
```

#### Admin Dashboard

```tsx
export async function getAdminDashboardStats(): Promise<AdminDashboardStatRecord[]> { ... }
export async function getAdminUserDistribution(): Promise<AdminUserDistributionRecord[]> { ... }
export async function getAdminServerResources(): Promise<AdminServerResourceRecord[]> { ... }
export async function getAdminAlerts(): Promise<AdminAlertRecord[]> { ... }
export async function getAdminActivityLogs(): Promise<AdminActivityLogRecord[]> { ... }
export async function getAdminUserStats(): Promise<AdminUserStatRecord[]> { ... }
export async function getAdminUsers(): Promise<AdminUserRecord[]> { ... }
export async function getAdminCourseStats(): Promise<AdminCourseStatRecord[]> { ... }
export async function getAdminCourses(): Promise<AdminCourseRecord[]> { ... }
export async function getAdminLogStats(): Promise<AdminLogStatRecord[]> { ... }
export async function getAdminLogs(): Promise<AdminLogRecord[]> { ... }
```

### Usage Example

```tsx
// _pages/student-dashboard/ui/StudentDashboardPage.tsx
import { getCurrentStudent, getStudentDashboardStats } from '@/shared/lib/supabase/ui-seed';

export default async function StudentDashboardPage() {
  const student = await getCurrentStudent();
  const stats = await getStudentDashboardStats();

  return (
    <div>
      <h1>Welcome, {student.name}</h1>
      {stats.map(stat => <StatCard {...stat} key={stat.label} />)}
    </div>
  );
}
```

### Fallback Behavior

Each fetcher returns an empty or default value if:
- Supabase is not configured
- The key doesn't exist in `ui_seed_data`
- The query fails

**Example fallbacks:**
```tsx
getCurrentStudent()           // → { id: '', name: '학생', email: '' }
getCurrentProfessor()         // → { id: '', name: '교수', title: '님', email: '' }
getStudentCourses()           // → []
getProfessorDashboardStats()  // → []
```

---

## For AI Agents

### When to Use Seed Data

Use these fetchers when:
- Building dashboard pages that display seed UI data
- The backend API is still in development
- You need to render realistic sample data with proper TypeScript types

### Adding New Seed Data Fetcher

1. Define the TypeScript interface for the data shape
2. Add a new async function in `shared/lib/supabase/ui-seed.ts`
3. Use the `getSeed<T>()` pattern
4. Provide a meaningful fallback value
5. Export the function

**Example:**
```tsx
export interface MyDataRecord {
  id: string;
  title: string;
}

export async function getMyData(): Promise<MyDataRecord[]> {
  return getSeed<MyDataRecord[]>('my_data_key', []);
}
```

<!-- MANUAL: -->
