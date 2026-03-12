# eduryday LMS — Product Requirements Document (PRD)

> **버전**: 1.0  
> **작성일**: 2026-03-11  
> **목표**: eduryday LMS 전체 기능 완성 (Vercel 배포 기준)  
> **범위**: 인증·CRUD·실시간 기능 완전 구현 + AI/Docker 채점 설계 문서화

---

## 1. 프로젝트 개요

### 1.1 제품 설명
eduryday는 국민대학교 소프트웨어학과를 위한 LMS(학습관리시스템)로, Split-View IDE, AI 튜터, No-Code 자동 채점을 핵심 기능으로 제공한다.

### 1.2 사용자 역할
| 역할 | 설명 | 승인 방식 |
|------|------|-----------|
| **학생 (student)** | 강좌 수강, 과제 제출, AI 튜터 사용 | 회원가입 후 관리자 승인 |
| **교수 (professor)** | 강좌 개설, 과제 생성, 채점 | 회원가입 후 관리자 승인 |
| **관리자 (admin)** | 전체 시스템 관리, 사용자 승인 | `eduryday@gmail.com` 계정 고정 |

### 1.3 기술 스택
- **Frontend**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **인증**: Supabase Auth + Google OAuth
- **배포**: Vercel
- **AI**: Claude API (AI 튜터, 자동 채점) — Phase 2
- **채점 실행**: Docker (코드 실행 샌드박스) — Phase 2

---

## 2. 현재 상태 (As-Is)

### 2.1 완성된 것
- ✅ 전체 UI 레이아웃 (26개 페이지)
- ✅ Supabase 클라이언트 연결 (`shared/lib/supabase/server.ts`)
- ✅ UI seed 데이터 38개 키 (`supabase/schema.sql`)
- ✅ 색상 가이드라인 (`docs/UI_COLOR_GUIDELINES.md`)

### 2.2 미구현 (To-Be)
- ❌ Supabase Auth 실제 연동 (로그인/회원가입 폼이 라우팅만 수행)
- ❌ Google OAuth 연동
- ❌ 역할 기반 접근 제어 (앱 코드 레벨)
- ❌ 관리자 사용자 승인 플로우
- ❌ 도메인 테이블 (users, courses, assignments, submissions, announcements 등)
- ❌ 모든 CRUD API (현재 stub 수준)
- ❌ 검색/필터/페이지네이션 동작
- ❌ 강좌 생성/관리 페이지
- ❌ 학생 마이페이지 폼 저장
- ❌ 공지 작성/수정/삭제
- ❌ 과제 생성 저장
- ❌ AI 튜터 실 API 연동 (Phase 2)
- ❌ Docker 채점 실행 환경 (Phase 2)

---

## 3. 데이터베이스 스키마 설계

### 3.1 테이블 목록

#### `profiles` — 사용자 프로필 (Supabase Auth users 확장)
```sql
id          uuid PRIMARY KEY REFERENCES auth.users(id)
email       text NOT NULL UNIQUE
name        text NOT NULL
role        text NOT NULL CHECK (role IN ('student','professor','admin'))
status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','suspended'))
student_id  text                          -- 학번 (학생만)
department  text
created_at  timestamptz DEFAULT now()
updated_at  timestamptz DEFAULT now()
```

#### `courses` — 강좌
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
title        text NOT NULL
description  text
professor_id uuid NOT NULL REFERENCES profiles(id)
semester     text NOT NULL                -- e.g. '2026-1'
section      text                         -- e.g. '01분반'
total_weeks  int NOT NULL DEFAULT 15
status       text NOT NULL DEFAULT 'active' CHECK (status IN ('active','closed','draft'))
created_at   timestamptz DEFAULT now()
updated_at   timestamptz DEFAULT now()
```

#### `enrollments` — 수강 신청
```sql
id         uuid PRIMARY KEY DEFAULT gen_random_uuid()
course_id  uuid NOT NULL REFERENCES courses(id)
student_id uuid NOT NULL REFERENCES profiles(id)
enrolled_at timestamptz DEFAULT now()
UNIQUE(course_id, student_id)
```

#### `assignments` — 과제
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
course_id    uuid NOT NULL REFERENCES courses(id)
title        text NOT NULL
description  text
type         text NOT NULL CHECK (type IN ('coding','essay','multiple-choice','file'))
deadline     timestamptz
status       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','closed'))
rubric       jsonb                         -- 채점 기준 (No-Code 채점용)
max_score    int NOT NULL DEFAULT 100
created_by   uuid NOT NULL REFERENCES profiles(id)
created_at   timestamptz DEFAULT now()
updated_at   timestamptz DEFAULT now()
```

#### `submissions` — 과제 제출
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
assignment_id uuid NOT NULL REFERENCES assignments(id)
student_id    uuid NOT NULL REFERENCES profiles(id)
content       text                          -- 코드 또는 에세이 내용
file_url      text                          -- 파일 제출 URL
auto_score    int                           -- 자동 채점 점수
final_score   int                           -- 최종 점수 (교수 확정)
feedback      text
status        text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','grading','graded'))
submitted_at  timestamptz DEFAULT now()
graded_at     timestamptz
UNIQUE(assignment_id, student_id)
```

#### `announcements` — 공지사항
```sql
id         uuid PRIMARY KEY DEFAULT gen_random_uuid()
course_id  uuid NOT NULL REFERENCES courses(id)
author_id  uuid NOT NULL REFERENCES profiles(id)
title      text NOT NULL
content    text NOT NULL
pinned     boolean NOT NULL DEFAULT false
views      int NOT NULL DEFAULT 0
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```

#### `course_weeks` — 주차별 강의 구성
```sql
id        uuid PRIMARY KEY DEFAULT gen_random_uuid()
course_id uuid NOT NULL REFERENCES courses(id)
number    int NOT NULL
title     text NOT NULL
status    text NOT NULL DEFAULT 'locked' CHECK (status IN ('locked','in-progress','done'))
UNIQUE(course_id, number)
```

#### `lessons` — 강의 자료
```sql
id        uuid PRIMARY KEY DEFAULT gen_random_uuid()
week_id   uuid NOT NULL REFERENCES course_weeks(id)
title     text NOT NULL
type      text NOT NULL CHECK (type IN ('lecture','practice','quiz'))
file_url  text
completed_by jsonb DEFAULT '[]'            -- student_id 배열
order_num int NOT NULL DEFAULT 0
```

#### `ai_conversations` — AI 튜터 대화 (Phase 2)
```sql
id         uuid PRIMARY KEY DEFAULT gen_random_uuid()
student_id uuid NOT NULL REFERENCES profiles(id)
course_id  uuid REFERENCES courses(id)
title      text NOT NULL
messages   jsonb NOT NULL DEFAULT '[]'
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```

#### `activity_logs` — 시스템 로그 (관리자용)
```sql
id         bigserial PRIMARY KEY
user_id    uuid REFERENCES profiles(id)
type       text NOT NULL CHECK (type IN ('login','submit','ai','course','error','grading','access'))
message    text NOT NULL
ip         text
created_at timestamptz DEFAULT now()
```

### 3.2 RLS 정책 방향
- `profiles`: 본인만 UPDATE, 관리자는 전체 SELECT/UPDATE
- `courses`: 교수는 본인 강좌 CRUD, 학생은 수강 중인 강좌 SELECT
- `enrollments`: 학생 본인 SELECT, 교수는 본인 강좌 학생 SELECT
- `assignments`: 교수는 본인 강좌 CRUD, 학생은 수강 강좌 SELECT
- `submissions`: 학생 본인 CRUD, 교수는 본인 강좌 제출물 SELECT/UPDATE
- `announcements`: 교수는 본인 강좌 CRUD, 학생은 수강 강좌 SELECT
- `activity_logs`: 관리자만 SELECT, 시스템이 INSERT

---

## 4. 인증 플로우

### 4.1 회원가입
1. 사용자가 `/signup` 에서 이름, 이메일, 비밀번호, 역할(학생/교수), 학번(학생만) 입력
2. Google OAuth 버튼으로 구글 계정 연동 가능
3. `supabase.auth.signUp()` 호출 → `profiles` 테이블에 `status: 'pending'` 으로 INSERT
4. 이메일 인증 발송 (Supabase 기본 기능)
5. 이메일 인증 완료 후 "승인 대기 중" 화면 표시
6. 관리자(`eduryday@gmail.com`)가 `/admin/users` 에서 승인 → `status: 'active'` 로 UPDATE
7. 승인 완료 후 로그인 가능

### 4.2 로그인
1. `/login` 에서 이메일/비밀번호 또는 Google OAuth
2. `supabase.auth.signInWithPassword()` 또는 `signInWithOAuth({ provider: 'google' })`
3. 로그인 성공 후 `profiles` 에서 `role` 과 `status` 확인
4. `status === 'pending'` → "승인 대기 중" 페이지로 리다이렉트
5. `status === 'suspended'` → "계정 정지" 안내
6. `status === 'active'` → role에 따라 대시보드로 리다이렉트
   - `student` → `/student/dashboard`
   - `professor` → `/professor/dashboard`
   - `admin` → `/admin/dashboard`

### 4.3 역할 선택 (`/auth/role`)
- Google OAuth 최초 로그인 시 역할 미설정 상태면 `/auth/role` 로 이동
- 역할 선택 후 `profiles` 업데이트 → 승인 대기 상태로 전환

### 4.4 비밀번호 찾기
- `supabase.auth.resetPasswordForEmail()` 호출
- 이메일로 재설정 링크 발송

### 4.5 세션 관리
- `@supabase/ssr` 패키지 사용 (Next.js App Router 호환)
- `middleware.ts` 에서 세션 갱신 및 역할 기반 라우트 보호
- 미인증 접근 → `/login` 리다이렉트
- 역할 불일치 접근 → 본인 대시보드로 리다이렉트

---

## 5. 기능 요구사항

### Phase 1 — 핵심 기능 완성 (즉시 구현)

#### F-01: 인증 시스템
| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| F-01-1 | 이메일/비밀번호 회원가입 (Supabase Auth) | P0 |
| F-01-2 | Google OAuth 로그인/회원가입 | P0 |
| F-01-3 | 이메일 인증 플로우 | P0 |
| F-01-4 | 역할 선택 (학생/교수) 및 profiles 저장 | P0 |
| F-01-5 | 관리자 승인 플로우 (pending → active) | P0 |
| F-01-6 | 비밀번호 재설정 이메일 발송 | P0 |
| F-01-7 | middleware.ts 라우트 보호 | P0 |
| F-01-8 | 로그아웃 | P0 |

#### F-02: 관리자 기능
| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| F-02-1 | 사용자 목록 조회 (검색/필터/페이지네이션) | P0 |
| F-02-2 | 사용자 승인 (pending → active) | P0 |
| F-02-3 | 사용자 정지/활성화 (active ↔ suspended) | P0 |
| F-02-4 | 강좌 목록 조회 (검색/필터/페이지네이션) | P1 |
| F-02-5 | 강좌 삭제 | P1 |
| F-02-6 | 시스템 로그 조회 (필터/페이지네이션) | P1 |
| F-02-7 | 관리자 설정 저장 (시스템 설정) | P2 |

#### F-03: 교수 기능
| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| F-03-1 | 강좌 생성 (`/professor/courses/create`) | P0 |
| F-03-2 | 강좌 목록 조회 | P0 |
| F-03-3 | 강좌 상세/관리 (`/professor/courses/[id]/manage`) | P0 |
| F-03-4 | 과제 생성 (임시저장/게시) | P0 |
| F-03-5 | 과제 목록 조회 | P0 |
| F-03-6 | 제출물 목록 조회 및 채점 | P0 |
| F-03-7 | 공지 작성/수정/삭제 | P0 |
| F-03-8 | 성적 조회 및 최종 점수 확정 | P1 |
| F-03-9 | 학습 분석 데이터 조회 | P1 |

#### F-04: 학생 기능
| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| F-04-1 | 수강 중인 강좌 목록 조회 | P0 |
| F-04-2 | 강좌 상세 (주차별 강의 목록) | P0 |
| F-04-3 | 과제 목록 및 제출 | P0 |
| F-04-4 | 성적 조회 | P0 |
| F-04-5 | 마이페이지 프로필 수정 | P1 |
| F-04-6 | 대시보드 통계 (실데이터 기반) | P1 |

#### F-05: 공통 기능
| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| F-05-1 | 헤더 사용자 정보 (실 로그인 유저 표시) | P0 |
| F-05-2 | 활동 로그 자동 기록 (로그인, 제출, 채점 등) | P1 |
| F-05-3 | 파일 업로드 (Supabase Storage) | P1 |

### Phase 2 — 고급 기능 (설계 문서화, 구현은 추후)

#### F-06: AI 튜터 (설계만)
- Claude API (claude-3-5-sonnet) 연동
- RAG 기반 강의 자료 검색 (pgvector)
- 힌트 중심 응답 프롬프트 설계
- 대화 히스토리 저장 (`ai_conversations` 테이블)
- 스트리밍 응답 (Server-Sent Events)

#### F-07: Docker 채점 (설계만)
- 언어별 Docker 이미지 (Python, Java, C++, JavaScript)
- 채점 큐 시스템 (Supabase Realtime 또는 별도 큐)
- 타임아웃/메모리 제한 설정
- 테스트 케이스 실행 및 결과 반환
- No-Code 채점 기준 → 채점 로직 자동 생성 (Claude API)

---

## 6. API 설계

### 6.1 인증 관련 (Supabase Auth 직접 사용)
```
POST /auth/signup          → supabase.auth.signUp()
POST /auth/login           → supabase.auth.signInWithPassword()
POST /auth/google          → supabase.auth.signInWithOAuth({ provider: 'google' })
POST /auth/logout          → supabase.auth.signOut()
POST /auth/reset-password  → supabase.auth.resetPasswordForEmail()
GET  /auth/callback        → OAuth 콜백 처리
```

### 6.2 API Routes (`app/api/v1/`)
```
# 사용자
GET    /api/v1/users              관리자: 전체 목록 (검색/필터/페이지네이션)
PATCH  /api/v1/users/[id]         관리자: 상태 변경 (approve/suspend/activate)

# 강좌
GET    /api/v1/courses            역할별 강좌 목록
POST   /api/v1/courses            교수: 강좌 생성
GET    /api/v1/courses/[id]       강좌 상세
PATCH  /api/v1/courses/[id]       교수: 강좌 수정
DELETE /api/v1/courses/[id]       관리자/교수: 강좌 삭제

# 과제
GET    /api/v1/assignments        강좌별 과제 목록
POST   /api/v1/assignments        교수: 과제 생성
PATCH  /api/v1/assignments/[id]   교수: 과제 수정
DELETE /api/v1/assignments/[id]   교수: 과제 삭제

# 제출
GET    /api/v1/submissions        과제별 제출 목록 (교수) / 본인 제출 (학생)
POST   /api/v1/submissions        학생: 과제 제출
PATCH  /api/v1/submissions/[id]   교수: 채점 (final_score, feedback)

# 공지
GET    /api/v1/announcements      강좌별 공지 목록
POST   /api/v1/announcements      교수: 공지 작성
PATCH  /api/v1/announcements/[id] 교수: 공지 수정
DELETE /api/v1/announcements/[id] 교수: 공지 삭제

# 로그 (관리자)
GET    /api/v1/logs               관리자: 시스템 로그 (필터/페이지네이션)

# 헬스체크
GET    /api/v1/health             서버 상태 확인
```

---

## 7. 라우트 보호 설계 (`middleware.ts`)

```
공개 라우트:
  /                  랜딩
  /login
  /signup
  /forgot-password
  /auth/callback     OAuth 콜백

인증 필요 (로그인 + active 상태):
  /student/*         role === 'student'
  /professor/*       role === 'professor'
  /admin/*           role === 'admin' (eduryday@gmail.com)

승인 대기:
  /pending           status === 'pending' 사용자 전용
```

---

## 8. 미구현 페이지 목록

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 강좌 생성 | `/professor/courses/create` | 교수가 새 강좌 개설 |
| 강좌 관리 | `/professor/courses/[id]/manage` | 주차/강의 자료 관리 |
| 승인 대기 | `/pending` | 회원가입 후 관리자 승인 대기 화면 |
| OAuth 콜백 | `/auth/callback` | Google OAuth 리다이렉트 처리 |

---

## 9. 구현 순서 (우선순위)

### Sprint 1 — 인증 기반 (최우선)
1. `@supabase/ssr` 패키지 설치 및 클라이언트 재구성
2. `supabase/migrations/` — 도메인 테이블 마이그레이션 SQL 작성
3. `middleware.ts` — 세션 갱신 + 라우트 보호
4. `/auth/callback` — OAuth 콜백 라우트
5. `/login` — 실제 Supabase Auth 연동 (이메일 + Google OAuth)
6. `/signup` — 회원가입 + profiles INSERT
7. `/forgot-password` — 비밀번호 재설정 이메일
8. `/auth/role` — 역할 선택 후 profiles 업데이트
9. `/pending` — 승인 대기 페이지

### Sprint 2 — 관리자 CRUD
10. `/api/v1/users` — 사용자 목록/승인/정지 API
11. `/admin/users` — 실데이터 연동 + 검색/필터/페이지네이션
12. `/api/v1/courses` — 강좌 CRUD API
13. `/admin/courses` — 실데이터 연동
14. `/api/v1/logs` — 로그 조회 API
15. `/admin/logs` — 실데이터 연동

### Sprint 3 — 교수 CRUD
16. `/professor/courses/create` — 강좌 생성 페이지
17. `/professor/courses/[id]/manage` — 강좌 관리 페이지
18. `/api/v1/assignments` — 과제 CRUD API
19. `/professor/assignments` — 실데이터 연동
20. `/api/v1/announcements` — 공지 CRUD API
21. `/professor/announcements` — 실데이터 연동 (작성/수정/삭제)
22. `/api/v1/submissions` — 제출물 조회/채점 API
23. `/professor/grading-status` — 실데이터 연동

### Sprint 4 — 학생 기능
24. `/student/courses` — 실데이터 연동
25. `/student/course/[id]` — 강좌 상세 실데이터
26. `/student/assignments` — 과제 제출 기능
27. `/student/grades` — 성적 실데이터
28. `/student/my-page` — 프로필 수정 저장

### Sprint 5 — 헤더/공통 + 배포
29. 헤더 컴포넌트 — 실 로그인 유저 정보 표시
30. 활동 로그 자동 기록 미들웨어
31. Vercel 환경변수 설정 및 배포
32. Supabase 프로덕션 프로젝트 마이그레이션 실행

---

## 10. 환경변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # 서버 전용 (관리자 작업)

# Google OAuth (Supabase 대시보드에서 설정)
# → Supabase > Authentication > Providers > Google

# 관리자 계정
ADMIN_EMAIL=eduryday@gmail.com

# Phase 2
ANTHROPIC_API_KEY=                # AI 튜터
```

---

## 11. Vercel 배포 체크리스트

- [ ] Supabase 프로덕션 프로젝트 생성
- [ ] 마이그레이션 SQL 실행
- [ ] Google OAuth 앱 등록 (Google Cloud Console)
- [ ] Supabase Auth > Google Provider 활성화
- [ ] Supabase Auth > Site URL = `https://eduryday.vercel.app`
- [ ] Supabase Auth > Redirect URLs 추가
- [ ] Vercel 환경변수 설정
- [ ] `vercel.json` 설정 (필요시)
- [ ] 도메인 연결

---

## 12. 비기능 요구사항

| 항목 | 요구사항 |
|------|----------|
| 성능 | 페이지 로드 < 2초 (LCP 기준) |
| 보안 | RLS 활성화, SUPABASE_SERVICE_ROLE_KEY 서버 전용 사용 |
| 접근성 | 색상 대비 WCAG AA 준수 (UI_COLOR_GUIDELINES.md 기준) |
| 타입 안전성 | TypeScript strict mode, 모든 API 응답 타입 정의 |
| 에러 처리 | 모든 API 라우트 `ok()`/`fail()` 헬퍼 사용 |

---

## 13. 제외 범위 (이번 PRD 외)

- AI 튜터 실제 Claude API 연동 (설계만)
- Docker 채점 실행 환경 (설계만)
- 알림 시스템 (이메일/푸시)
- CSV 내보내기
- 모바일 앱
- 다국어 지원
