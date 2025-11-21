# 스키마 변경 이력

## 2025-11-21: 테이블 역할 분리 (옵션 B 적용)

### 🎯 변경 목적
`profiles`와 `users` 테이블의 역할을 명확히 분리하여 책임을 나눔

### 📊 변경 내용

#### 1. profiles 테이블 (변경 없음)
- **역할**: Clerk 인증 정보 + 역할 관리
- **필드**: clerk_user_id, email, role, status
- **책임**: 인증, 권한 관리, 계정 상태

#### 2. users 테이블 (대폭 수정) ⭐
**이전 구조:**
```sql
CREATE TABLE "users" (
    "clerk_user_id" TEXT NOT NULL UNIQUE,  -- 중복!
    "role" VARCHAR(20),                    -- 중복!
    "email" TEXT,                          -- 중복!
    "name" TEXT NOT NULL
);
```

**새 구조:**
```sql
CREATE TABLE "users" (
    "profile_id" UUID NOT NULL UNIQUE,     -- profiles 참조
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "avatar_url" TEXT
);
```

**제거된 필드:**
- ❌ `clerk_user_id` → profiles에만 존재
- ❌ `role` → profiles에만 존재
- ❌ `email` → profiles에서 관리

**추가된 필드:**
- ✅ `profile_id` → profiles 테이블 참조 (FK)
- ✅ `phone` → 연락처
- ✅ `avatar_url` → 프로필 이미지

### 🔗 관계도

```
┌────────────────┐
│   profiles     │ (인증 + 역할)
│  - Clerk ID    │
│  - 이메일      │
│  - 역할        │
│  - 상태        │
└───────┬────────┘
        │ 1:1
        ▼
┌────────────────┐
│     users      │ (상세 프로필)
│  - 이름        │
│  - 전화번호    │
│  - 아바타      │
└────────────────┘
        │
        ▼
┌────────────────┐
│ retailers/     │ (역할별 정보)
│ wholesalers    │
└────────────────┘
```

### 🔧 추가된 제약조건

```sql
-- 외래키
ALTER TABLE "users" ADD CONSTRAINT fk_users_profile 
  FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") 
  ON DELETE CASCADE;

-- 인덱스
CREATE INDEX idx_users_profile_id ON "users" ("profile_id");
```

### 📝 코멘트 추가

```sql
COMMENT ON TABLE "profiles" IS 'Clerk 인증 정보 및 역할 관리 테이블';
COMMENT ON COLUMN "profiles"."clerk_user_id" IS 'Clerk 사용자 ID (인증용)';
COMMENT ON COLUMN "profiles"."role" IS '사용자 역할: retailer, wholesaler, admin';

COMMENT ON TABLE "users" IS '사용자 상세 프로필 정보 테이블';
COMMENT ON COLUMN "users"."profile_id" IS 'profiles 테이블 참조 (1:1 관계)';
```

### ✅ 장점

1. **명확한 책임 분리**
   - profiles: 인증 및 권한 (변경 빈도 낮음)
   - users: 프로필 정보 (변경 빈도 높음)

2. **데이터 중복 제거**
   - clerk_user_id는 profiles에만
   - role, email도 profiles에만

3. **확장성**
   - users 테이블에 추가 필드 자유롭게 추가 가능
   - 인증 정보와 프로필 정보 독립적으로 관리

4. **보안**
   - 민감한 인증 정보(profiles)와 일반 프로필 정보(users) 분리
   - RLS 정책을 다르게 적용 가능

### 🔄 마이그레이션 가이드

#### 기존 데이터가 있는 경우:

```sql
-- 1. 임시 백업
CREATE TABLE users_backup AS SELECT * FROM users;

-- 2. 기존 users 테이블 삭제
DROP TABLE users CASCADE;

-- 3. 새 스키마 적용
-- (mk_schema.sql 실행)

-- 4. 데이터 마이그레이션
INSERT INTO users (profile_id, name, phone)
SELECT 
  p.id as profile_id,
  ub.name,
  NULL as phone  -- 기존 데이터에 phone이 없으면 NULL
FROM users_backup ub
JOIN profiles p ON p.clerk_user_id = ub.clerk_user_id;

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

### 📚 관련 문서

- `README_SCHEMA.md`: 스키마 사용 가이드
- `mk_schema.sql`: 전체 스키마 정의
- `docs/PRD.md`: 프로젝트 요구사항

---

## 2025-11-21: PRD 누락 사항 반영

### 추가된 내용:
- ✅ CHECK 제약조건 (모든 ENUM 필드)
- ✅ UNIQUE 제약조건 (business_number, anonymous_code, order_number)
- ✅ DEFAULT 값 (moq, shipping_fee, stock_quantity 등)
- ✅ delivery_method 필드 추가
- ✅ ai_keywords, suggested_keywords를 TEXT[] 배열로 변경
- ✅ variant_id를 NULL 허용으로 변경
- ✅ 외래키 ON DELETE 정책 조정
- ✅ 테이블 및 컬럼 코멘트 추가

자세한 내용은 Git 커밋 히스토리 참고.

