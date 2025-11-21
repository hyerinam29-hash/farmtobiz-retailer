# 데이터베이스 스키마 가이드

## 📊 테이블 구조 개요

### 1️⃣ 인증 및 사용자 관리 (2-Tier 구조)

```
┌─────────────────────────────────────────────┐
│ profiles (인증 + 역할)                      │
│ - clerk_user_id (Clerk 인증 ID)             │
│ - email                                     │
│ - role (retailer/wholesaler/admin)         │
│ - status (active/suspended)                │
└───────────────┬─────────────────────────────┘
                │ 1:1
                ▼
┌─────────────────────────────────────────────┐
│ users (상세 프로필)                         │
│ - profile_id (FK → profiles.id)            │
│ - name                                      │
│ - phone                                     │
│ - avatar_url                                │
└─────────────────────────────────────────────┘
```

**역할 분리:**
- **profiles**: Clerk 인증 정보, 역할(role), 계정 상태
- **users**: 사용자 실명, 연락처, 아바타 등 부가 정보

### 2️⃣ 역할별 상세 정보

```
profiles (role='retailer')
    │ 1:1
    └─> retailers (상호명, 주소, 연락처)

profiles (role='wholesaler')
    │ 1:1
    └─> wholesalers (사업자번호, 계좌, 익명코드, 승인상태)
```

### 3️⃣ 데이터 흐름

```
회원가입 흐름:
1. Clerk 인증 → clerk_user_id 발급
2. profiles 테이블 생성 (clerk_user_id, email, role)
3. users 테이블 생성 (profile_id, name, phone)
4. 역할별 테이블 생성:
   - role='retailer' → retailers 생성
   - role='wholesaler' → wholesalers 생성
```

## 💡 사용 예시

### 예시 1: 새로운 소매 사용자 생성

```typescript
// 1단계: profiles 생성 (Clerk 회원가입 후)
const { data: profile } = await supabase
  .from('profiles')
  .insert({
    clerk_user_id: clerkUserId,
    email: 'retailer@example.com',
    role: 'retailer',
  })
  .select()
  .single();

// 2단계: users 생성 (상세 프로필)
const { data: user } = await supabase
  .from('users')
  .insert({
    profile_id: profile.id,
    name: '홍길동',
    phone: '010-1234-5678',
  })
  .select()
  .single();

// 3단계: retailers 생성 (역할별 정보)
await supabase.from('retailers').insert({
  user_id: profile.id,
  business_name: '길동 마트',
  address: '서울시 강남구',
  phone: '010-1234-5678',
});
```

### 예시 2: 사용자 전체 정보 조회

```typescript
// profiles를 기준으로 JOIN
const { data } = await supabase
  .from('profiles')
  .select(`
    *,
    users (
      name,
      phone,
      avatar_url
    ),
    retailers (
      business_name,
      address
    )
  `)
  .eq('clerk_user_id', clerkUserId)
  .single();

// 결과:
// {
//   id: 'uuid',
//   clerk_user_id: 'clerk_xxx',
//   email: 'retailer@example.com',
//   role: 'retailer',
//   status: 'active',
//   users: {
//     name: '홍길동',
//     phone: '010-1234-5678',
//     avatar_url: null
//   },
//   retailers: {
//     business_name: '길동 마트',
//     address: '서울시 강남구'
//   }
// }
```

### 예시 3: 도매 사용자 승인 처리

```typescript
// 관리자가 도매 사용자 승인
const { data: wholesaler } = await supabase
  .from('wholesalers')
  .update({
    status: 'approved',
    approved_at: new Date().toISOString(),
  })
  .eq('id', wholesalerId)
  .select(`
    *,
    users:profiles!user_id (
      clerk_user_id,
      email,
      users (name, phone)
    )
  `)
  .single();

// 감사 로그 기록
await supabase.from('audit_logs').insert({
  user_id: adminProfileId,
  action: 'wholesaler_approve',
  target_type: 'wholesaler',
  target_id: wholesalerId,
  details: {
    business_name: wholesaler.business_name,
    business_number: wholesaler.business_number,
  },
});
```

## 🔐 RLS 정책 (프로덕션 전환 시)

현재는 개발 환경으로 RLS가 비활성화되어 있습니다. 프로덕션 배포 전에 다음 RLS 정책을 적용하세요:

### profiles 테이블

```sql
-- SELECT: 본인만 조회
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (clerk_user_id = auth.jwt() ->> 'sub');

-- UPDATE: 본인만 수정
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (clerk_user_id = auth.jwt() ->> 'sub');
```

### users 테이블

```sql
-- SELECT: 본인만 조회
CREATE POLICY "Users can view own details"
ON users FOR SELECT
USING (
  profile_id = (
    SELECT id FROM profiles 
    WHERE clerk_user_id = auth.jwt() ->> 'sub'
  )
);

-- UPDATE: 본인만 수정
CREATE POLICY "Users can update own details"
ON users FOR UPDATE
USING (
  profile_id = (
    SELECT id FROM profiles 
    WHERE clerk_user_id = auth.jwt() ->> 'sub'
  )
);
```

## ⚠️ 주의사항

### 1. CASCADE 삭제 체인

```
profiles 삭제 시:
  └─> users 삭제 (CASCADE)
  └─> retailers/wholesalers 삭제 (CASCADE)
      └─> orders 관련 데이터는 RESTRICT (삭제 불가)
```

**의미**: 사용자를 삭제하려면 먼저 관련된 모든 주문, 상품을 처리해야 함

### 2. 데이터 일관성

- `profiles.role`과 `retailers/wholesalers` 존재 여부가 일치해야 함
- 트리거나 애플리케이션 레벨에서 검증 권장

### 3. clerk_user_id 관리

- Clerk에서 발급한 ID를 **절대 변경하지 말 것**
- profiles 테이블이 인증의 중심이므로 신중하게 관리

## 🚀 마이그레이션 적용

```bash
# Supabase CLI 사용
supabase db reset

# 또는 Supabase Dashboard에서:
# SQL Editor → mk_schema.sql 내용 붙여넣기 → Run
```

## 📚 추가 참고

- **PRD**: `docs/PRD.md` - 전체 요구사항
- **AGENTS.md**: 프로젝트 구조 설명
- **Storage 설정**: `setup_product_images_storage.sql`

