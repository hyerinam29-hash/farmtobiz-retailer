# Supabase 연동 문제 수정 가이드

## 🔍 문제 원인

기존 코드와 데이터베이스 스키마가 불일치했습니다:

### 이전 구조 (❌ 잘못됨)
```typescript
// 코드: users 테이블에 clerk_id 사용
await supabase.from("users").insert({
  clerk_id: clerkUser.id,  // ❌
  name: userName
});
```

```sql
-- 스키마: users 테이블에 clerk_id 없음
CREATE TABLE users (
  profile_id UUID,  -- profiles 참조
  name TEXT
);
```

## ✅ 수정된 구조 (2-Tier)

### 테이블 관계
```
profiles (인증 + 역할)
  ├── clerk_user_id (Clerk ID)
  ├── email
  ├── role
  └── status
       │ 1:1
       ▼
users (상세 프로필)
  ├── profile_id (FK → profiles.id)
  ├── name
  ├── phone
  └── avatar_url
```

## 📝 수정된 파일

### 1. `app/api/sync-user/route.ts` ⭐ 가장 중요

**변경 내용:**
- 2단계 동기화: profiles → users
- 상세한 로그 추가
- 에러 메시지 개선

**동작 방식:**
```typescript
// 1단계: profiles 테이블 upsert
const profile = await supabase.from("profiles").upsert({
  clerk_user_id: clerkUser.id,
  email: email,
  role: "retailer",
  status: "active"
});

// 2단계: users 테이블 upsert
const user = await supabase.from("users").upsert({
  profile_id: profile.id,
  name: name,
  phone: phone,
  avatar_url: avatar
});
```

### 2. `app/auth-test/page.tsx`

**변경 내용:**
- ProfileData, UserData 인터페이스 추가
- profiles와 users 조회 로직 수정
- 이름 업데이트 로직 수정 (profile_id 사용)
- UI 개선 (2-Tier 구조 명확히 표시)

**UI 변경:**
- 📋 Profiles 테이블 (파란색 박스)
- 👤 Users 테이블 (초록색 박스)

## 🚀 적용 방법

### 1단계: Supabase 테이블 확인

```sql
-- 테이블 존재 여부 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'users');

-- profiles 테이블 구조 확인
\d profiles

-- users 테이블 구조 확인
\d users
```

**필수 컬럼:**
- `profiles`: clerk_user_id, email, role, status
- `users`: profile_id (FK), name, phone, avatar_url

### 2단계: RLS 확인 (개발 환경)

```sql
-- RLS가 비활성화되어 있어야 함
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'users');

-- 결과: rowsecurity = false

-- 비활성화 명령어 (필요 시)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### 3단계: 기존 데이터 마이그레이션 (필요 시)

기존에 잘못된 구조로 데이터가 있다면:

```sql
-- 1. 기존 users 테이블 백업
CREATE TABLE users_old AS SELECT * FROM users;

-- 2. users 테이블 삭제
DROP TABLE users CASCADE;

-- 3. 새 스키마 적용 (mk_schema.sql 실행)

-- 4. 데이터 마이그레이션 (clerk_id → profile_id)
INSERT INTO users (profile_id, name, phone, avatar_url)
SELECT 
  p.id as profile_id,
  u.name,
  NULL as phone,
  NULL as avatar_url
FROM users_old u
JOIN profiles p ON p.clerk_user_id = u.clerk_id
ON CONFLICT (profile_id) DO NOTHING;

-- 5. 확인
SELECT 
  p.clerk_user_id,
  p.email,
  p.role,
  u.name,
  u.phone
FROM profiles p
LEFT JOIN users u ON u.profile_id = p.id;
```

## 🧪 테스트 방법

### 1. 로그인 후 콘솔 확인

브라우저 콘솔에서 다음 로그가 보여야 합니다:

```
🔄 [sync-user] 동기화 시작
✅ [sync-user] Clerk userId: user_xxx
✅ [sync-user] Clerk 사용자 정보: {...}
📝 [sync-user] profiles 테이블 upsert 시도...
✅ [sync-user] profiles 저장 완료: uuid
📝 [sync-user] users 테이블 upsert 시도...
✅ [sync-user] users 저장 완료: uuid
🎉 [sync-user] 동기화 성공!
```

### 2. Auth Test 페이지 확인

`/auth-test` 페이지에서:
- ✅ Supabase 연결 성공
- ✅ Clerk 사용자 정보 표시
- ✅ Profiles 테이블 데이터 표시 (파란색)
- ✅ Users 테이블 데이터 표시 (초록색)

### 3. Supabase Dashboard 확인

Tables → profiles:
```
clerk_user_id | email          | role     | status
------------- | -------------- | -------- | ------
user_xxx      | user@email.com | retailer | active
```

Tables → users:
```
profile_id | name  | phone | avatar_url
---------- | ----- | ----- | ----------
uuid       | 홍길동 | NULL  | https://...
```

## ❌ 자주 발생하는 에러

### 에러 1: "프로필을 찾을 수 없습니다"

**원인:** sync-user API가 호출되지 않음

**해결:**
1. `components/providers/sync-user-provider.tsx` 확인
2. `app/layout.tsx`에 `<SyncUserProvider>` 추가 확인
3. 브라우저 콘솔에서 네트워크 탭 확인 (`/api/sync-user` 호출 여부)

### 에러 2: "column 'clerk_id' does not exist"

**원인:** 스키마가 업데이트되지 않음

**해결:**
```sql
-- 새 스키마 적용
-- mk_schema.sql 전체 재실행 또는
-- DROP & CREATE 스크립트 실행
```

### 에러 3: RLS policy violation

**원인:** RLS가 활성화되어 있음

**해결:**
```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

## 📋 체크리스트

### 필수 확인 사항
- [ ] Supabase에 `profiles` 테이블 존재
- [ ] Supabase에 `users` 테이블 존재
- [ ] `profiles.clerk_user_id` 컬럼 존재
- [ ] `users.profile_id` 컬럼 존재
- [ ] RLS가 비활성화됨 (개발 환경)
- [ ] `app/api/sync-user/route.ts` 수정됨
- [ ] `app/auth-test/page.tsx` 수정됨
- [ ] `SyncUserProvider`가 RootLayout에 추가됨

### 테스트 확인
- [ ] 로그인 시 콘솔에 sync-user 로그 출력
- [ ] `/auth-test` 페이지에서 데이터 조회 성공
- [ ] 이름 수정 기능 작동
- [ ] 에러 없이 정상 작동

## 🎯 다음 단계

1. **프로덕션 전환 시:**
   - RLS 정책 활성화
   - 역할별 RLS 정책 추가
   - 보안 검토

2. **추가 기능:**
   - 역할 선택 UI 추가
   - 전화번호 입력 기능
   - 아바타 업로드 기능

## 📚 관련 문서

- `supabase/migrations/mk_schema.sql` - 전체 스키마 정의
- `supabase/migrations/README_SCHEMA.md` - 스키마 사용 가이드
- `supabase/migrations/CHANGELOG.md` - 변경 이력
- `docs/PRD.md` - 프로젝트 요구사항

---

**작성일:** 2025-11-21  
**버전:** 1.0  
**상태:** ✅ 수정 완료

