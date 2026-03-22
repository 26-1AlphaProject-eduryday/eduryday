# Launch Readiness Checklist

> **버전**: 1.0-launch  
> **기준일**: 2026-03-22  
> **목표**: eduryday LMS v1 실 서비스 런치 준비 상태 점검

---

## 1. 인증 (Authentication)

- [x] Google OAuth 로그인/회원가입 연동 (Supabase Auth)
- [x] 이메일/비밀번호 로그인 (Supabase Auth signInWithPassword)
- [x] `/auth/callback` OAuth 콜백 처리
- [x] `/auth/role` 역할 선택 플로우 (Google OAuth 최초 로그인)
- [x] `/pending` 승인 대기 화면
- [x] `middleware.ts` 역할 기반 라우트 보호
- [x] 비밀번호 재설정 이메일 (`/forgot-password`)
- [x] 로그아웃

## 2. 프로필 및 DB 스키마

- [x] `profiles` 테이블 (`id`, `email`, `name`, `role`, `status`, `student_id`, `department`)
- [x] `courses` 테이블
- [x] `assignments` 테이블
- [x] `announcements` 테이블
- [x] `submissions` 테이블
- [x] `activity_logs` 테이블
- [x] `enrollments` 테이블 (수강 신청)
- [x] `course_weeks` 테이블 (주차별 강의 구성)
- [x] `lessons` 테이블 (강의 자료)
- [x] RLS 정책 활성화 (`profiles`)

## 3. 실데이터 기반 페이지 (ui-seed 제거)

- [x] 학생 대시보드 — 실 DB 쿼리 (수강 강좌, 마감 과제 기반 통계)
- [x] 교수 대시보드 — 실 DB 쿼리 (담당 강좌, 과제 기반 통계)
- [x] 관리자 대시보드 — 실 DB 쿼리 (사용자/강좌/로그 기반 통계)
- [x] 학생 내 강좌 — enrollment 기반 DB 쿼리
- [x] 학생 강좌 상세 — enrollment + course_weeks + lessons 기반 DB 쿼리
- [x] 학생 성적 — 실 DB 쿼리 (submissions 기반)
- [x] 학생 마이페이지 — 실 DB 쿼리 (profile 기반)
- [x] 교수 공지사항 — 실 DB 쿼리 (announcements 기반)

## 4. 디자인 전용 라우트 처리

- [x] `/student/ai-tutor` — 사이드바에서 제거 + `/student/dashboard` 리다이렉트
- [x] `/professor/analytics` — 사이드바에서 제거 + `/professor/dashboard` 리다이렉트
- [x] `/admin/settings` — 사이드바에서 제거 + `/admin/dashboard` 리다이렉트

## 5. CI/CD

- [x] GitHub Actions CI 워크플로 (`.github/workflows/ci.yml`)
- [x] ESLint 플랫 설정 (`eslint.config.mjs`)
- [ ] Vercel 프로덕션 배포 연결
- [ ] 환경변수 Vercel에 설정 (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)

## 6. Supabase 배포 체크리스트

> 아래 항목은 Supabase 프로젝트를 실제로 연결한 후 진행합니다.

- [ ] `supabase link --project-ref <ref>` 로 프로젝트 연결
- [ ] `supabase db push` 로 전체 마이그레이션 실행
- [ ] Google OAuth Provider 활성화 (Supabase 대시보드 > Authentication > Providers)
- [ ] Site URL 설정 (`https://eduryday.vercel.app`)
- [ ] Redirect URLs 등록 (`https://eduryday.vercel.app/auth/callback`)
- [ ] `eduryday@gmail.com` 관리자 계정 초기 생성 및 확인

## 7. 빌드 검증 결과

| 항목 | 결과 |
|------|------|
| `npm run lint` | ✅ 통과 |
| `npm run typecheck` | ✅ 통과 (0 오류) |
| `npm run build` | ✅ 통과 |

## 8. 알려진 미구현 항목 (Phase 2)

| 항목 | 설명 |
|------|------|
| AI 튜터 실 API | Claude API 연동 미완 (Phase 2) |
| Docker 채점 | 실행 환경 미구성 (Phase 2) |
| 파일 업로드 | Supabase Storage 미연동 |
| Split-View IDE | 기초 구현만 존재 |

---

> 이 문서는 런치 준비 완료 후 갱신합니다.
