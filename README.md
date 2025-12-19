<div align="center">
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next.JS_15-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=black" alt="next.js" />
    <img src="https://img.shields.io/badge/-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="react" />
    <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="tailwind" />
    <img src="https://img.shields.io/badge/-Clerk-6C47FF?style=for-the-badge&logoColor=white&logo=clerk" alt="clerk" />
    <img src="https://img.shields.io/badge/-Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="supabase" />
    <img src="https://img.shields.io/badge/-Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="gemini" />
    <img src="https://img.shields.io/badge/-Toss_Payments-0066FF?style=for-the-badge&logoColor=white" alt="tosspayments" />
  </div>

  <h1 align="center">FarmToBiz Retailer</h1>
  <h3 align="center">농산물 도매/소매 B2B 플랫폼</h3>

  <p align="center">
    AI 기반 농수산물 거래 플랫폼 - 소매상의 스마트한 도매 구매를 위한 올인원 솔루션
  </p>
</div>

## 📋 목차

1. [소개](#소개)
2. [기술 스택](#기술-스택)
3. [주요 기능](#주요-기능)
4. [시작하기](#시작하기)
5. [추가 설정 및 팁](#추가-설정-및-팁)
6. [프로젝트 구조](#프로젝트-구조)

## 소개

농수산물 소매상을 위한 AI 기반 B2B 도매 구매 플랫폼입니다. 도매상의 익명화와 AI 표준화를 통해 투명하고 안전한 거래 환경을 제공합니다.

**핵심 특징:**
- 🤖 **AI 기반 상품 추천**: Gemini AI가 구매 패턴과 시장 트렌드를 분석하여 최적의 상품 추천
- 🔒 **안전한 거래 환경**: 도매상 정보 익명화로 개인정보 보호
- 🚚 **스마트 배송 시스템**: 소매점 운영 시간에 맞춘 배송 시간 지정
- 💳 **통합 결제 시스템**: Toss Payments 연동으로 안전한 결제 처리
- 📊 **실시간 시장 가격**: KAMIS API 연동으로 실시간 시세 정보 제공
- 🌙 **모던 UI/UX**: 다크모드 지원, 반응형 디자인, 접근성 준수

## 기술 스택

### 프레임워크 & 라이브러리

- **[Next.js 15](https://nextjs.org/)** - React 프레임워크 (App Router, Server Components)
- **[React 19](https://react.dev/)** - UI 라이브러리
- **[TypeScript](https://www.typescriptlang.org/)** - 타입 안정성

### 인증 & 데이터베이스

- **[Clerk](https://clerk.com/)** - 사용자 인증 및 관리
  - Google, 이메일 등 다양한 로그인 방식 지원
  - 한국어 UI 지원
  - Supabase와 네이티브 통합
- **[Supabase](https://supabase.com/)** - PostgreSQL 데이터베이스
  - 실시간 데이터 동기화
  - Row Level Security (RLS)
  - 파일 스토리지

### UI & 스타일링

- **[Tailwind CSS v4](https://tailwindcss.com/)** - 유틸리티 우선 CSS 프레임워크
- **[shadcn/ui](https://ui.shadcn.com/)** - 재사용 가능한 컴포넌트 라이브러리
- **[Radix UI](https://www.radix-ui.com/)** - 접근성 높은 헤드리스 컴포넌트
- **[lucide-react](https://lucide.dev/)** - 아이콘 라이브러리

### AI & 외부 API

- **[Google Gemini AI](https://ai.google.dev/)** - 상품 추천 및 챗봇 기능
- **[KAMIS API](https://www.kamis.or.kr/)** - 실시간 농산물 시장 가격 정보
- **[Toss Payments](https://toss.dev/)** - 안전한 결제 처리 시스템

### 폼 & 검증

- **[React Hook Form](https://react-hook-form.com/)** - 폼 상태 관리
- **[Zod](https://zod.dev/)** - 스키마 검증

### 상태 관리 & 유틸리티

- **[Zustand](https://zustand-demo.pmnd.rs/)** - 경량 상태 관리 (장바구니 등)
- **[TanStack Query](https://tanstack.com/query/)** - 서버 상태 관리
- **[date-fns](https://date-fns.org/)** - 날짜/시간 처리
- **[es-toolkit](https://es-toolkit.slash.page/)** - 모던 JavaScript 유틸리티

## 주요 기능

### 🔐 다중 역할 인증 시스템
- **역할 기반 접근 제어**: 소매상(Retailer), 도매상(Wholesaler), 관리자(Admin) 역할별 맞춤 기능
- **Clerk 통합**: 안전한 사용자 인증 및 권한 관리
- **자동 동기화**: Clerk 사용자 정보를 Supabase에 자동 동기화
- **한국어 UI**: Clerk 한국어 로컬라이제이션 지원

### 🤖 AI 기반 소매상 대시보드
- **개인화 추천**: 구매 이력 기반 AI 상품 추천 시스템
- **시장 트렌드 분석**: 실시간 농산물 가격 및 재고 예측
- **스마트 알림**: 재고 부족, 가격 변동 등 긴급 알림
- **Bento Grid 레이아웃**: 모듈형 대시보드로 효율적인 정보 배치

### 🛒 지능형 상품 검색 및 구매
- **AI 상품명 표준화**: 혼란스러운 상품명을 AI가 일관된 형식으로 정제
- **Command Palette**: `Cmd+K`로 상품, 카테고리, 주문 내역 통합 검색
- **익명화된 도매 정보**: 보안을 위해 도매상 정보 익명 표시 (Partner #F2B-01)
- **배송 필터링**: 새벽/일반 배송 옵션으로 운영 시간에 맞는 상품 필터링

### 💳 안전한 결제 및 배송 시스템
- **Toss Payments 연동**: 안정적인 결제 처리 및 에스크로 기능
- **플랫폼 수취**: 모든 결제는 FarmToBiz 플랫폼 명의로 진행
- **스마트 배송 시간 지정**: 소매점 운영 시간에 맞춘 배송 스케줄링
- **실시간 배송 추적**: 타임라인 기반 배송 상태 모니터링

### 💬 AI 고객 지원 챗봇
- **통합 인터페이스**: 모든 페이지에서 Floating Action Button으로 접근
- **배송/상품 문의**: 도매 배송 정보, 상품 상세 정보 즉시 답변
- **PII 마스킹**: 응답 생성 시 개인정보 자동 마스킹으로 보안 유지
- **Command Palette 통합**: 검색과 AI 질의 동시 지원

### 📊 실시간 시장 데이터
- **KAMIS API 연동**: 농림축산식품부 공공 API로 실시간 시세 정보
- **가격 예측**: AI 기반 미래 가격 트렌드 예측
- **지역별 가격 비교**: 전국 주요 도매시장 가격 비교 기능

## 시작하기

### 필수 요구사항

시스템에 다음이 설치되어 있어야 합니다:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (v18 이상)
- [pnpm](https://pnpm.io/) (권장 패키지 매니저)

```bash
# pnpm 설치
npm install -g pnpm
```

### 프로젝트 초기화

FarmToBiz 플랫폼을 로컬 환경에서 실행하기 위한 설정입니다:

#### 1. Supabase 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속하여 로그인
2. **"New Project"** 클릭
3. Organization 선택 (없으면 새로 생성)
4. 프로젝트 정보 입력:
   - **Name**: 원하는 프로젝트 이름
   - **Database Password**: 안전한 비밀번호 생성 (기억할 필요 없음, Supabase가 관리)
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국 서비스용)
   - **Pricing Plan**: Free 또는 Pro 선택
5. **"Create new project"** 클릭하고 프로젝트가 준비될 때까지 대기 (~2분)

#### 2. Clerk 프로젝트 생성

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 접속하여 로그인
2. **"Create application"** 클릭
3. 애플리케이션 정보 입력:
   - **Application name**: 원하는 이름 (예: `SaaS Template`)
   - **Sign-in options**: Email, Google 등 원하는 인증 방식 선택
4. **"Create application"** 클릭
5. Quick Start 화면에서 **"Continue in Dashboard"** 클릭

#### 3. Clerk + Supabase 통합

> **중요**: 2025년 4월부터 Clerk의 네이티브 Supabase 통합을 사용합니다. JWT Template은 더 이상 필요하지 않습니다.

**3-1. Clerk Frontend API URL 확인**

1. Clerk Dashboard → **API Keys** 메뉴
2. **"Frontend API"** URL 복사 (예: `https://your-app-12.clerk.accounts.dev`)
   - 이 URL을 메모해두세요 (다음 단계에서 사용)

**3-2. Supabase에서 Clerk 인증 제공자 설정**

1. Supabase Dashboard로 돌아가기
2. 프로젝트 선택 → **Settings** → **Authentication** → **Providers**
3. 페이지 하단으로 스크롤하여 **"Third-Party Auth"** 섹션 찾기
4. **"Enable Custom Access Token"** 또는 **"Add Provider"** 클릭
5. 다음 정보 입력:

   - **Provider Name**: `Clerk` (또는 원하는 이름)
   - **JWT Issuer (Issuer URL)**:
     ```
     https://your-app-12.clerk.accounts.dev
     ```
     (`your-app-12` 부분을 실제 Clerk Frontend API URL로 교체)

   - **JWKS Endpoint (JWKS URI)**:
     ```
     https://your-app-12.clerk.accounts.dev/.well-known/jwks.json
     ```
     (동일하게 실제 URL로 교체)

6. **"Save"** 또는 **"Add Provider"** 클릭

**3-3. 통합 확인**

[Clerk 공식 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase)에서 추가 정보를 확인할 수 있습니다.

#### 4. Supabase Storage 생성 및 설정

1. Supabase Dashboard → **Storage** 메뉴
2. **"New bucket"** 클릭
3. 버킷 정보 입력:
   - **Name**: `uploads` (`.env.example`과 동일하게)
   - **Public bucket**: 필요에 따라 선택
     - Public: 누구나 URL로 파일 접근 가능
     - Private: 인증된 사용자만 접근 (RLS 정책 필요)
4. **"Create bucket"** 클릭

#### 5. 데이터베이스 스키마 적용

1. Supabase Dashboard → **SQL Editor** 메뉴
2. **"New query"** 클릭
3. `supabase/migrations/schema.sql` 파일 내용을 복사하여 붙여넣기
4. **"Run"** 클릭하여 실행
5. 성공 메시지 확인 (`Success. No rows returned`)

**주요 테이블:**
- `users`: Clerk 사용자와 동기화되는 사용자 정보 테이블
- `retailers`: 소매상 프로필 및 사업자 정보
- `wholesalers`: 도매상 정보 (익명화된 식별자와 지역 정보)
- `products`: 농수산물 상품 정보 (AI 표준화된 상품명)
- `orders`: 주문 및 결제 정보
- `cart_items`: 장바구니 상품 정보
- `inquiries`: 고객 문의 및 AI 챗봇 대화 기록
- `delivery_addresses`: 배송 주소 관리
- `market_prices`: 실시간 농산물 시세 데이터

#### 6. 환경 변수 설정

**6-1. 저장소 클론 및 의존성 설치**

```bash
git clone <your-repository-url>
cd saas-template
pnpm install
```

**6-2. .env 파일 생성**

```bash
cp .env.example .env
```

**6-3. Supabase 환경 변수 설정**

1. Supabase Dashboard → **Settings** → **API**
2. 다음 값들을 복사하여 `.env` 파일에 입력:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="<Project URL>"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon public key>"
   SUPABASE_SERVICE_ROLE_KEY="<service_role secret key>"
   NEXT_PUBLIC_STORAGE_BUCKET="uploads"
   ```

> **⚠️ 주의**: `service_role` 키는 모든 RLS를 우회하는 관리자 권한이므로 절대 공개하지 마세요!

**6-4. Clerk 환경 변수 설정**

1. Clerk Dashboard → **API Keys**
2. 다음 값들을 복사하여 `.env` 파일에 입력:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<Publishable Key>"
   CLERK_SECRET_KEY="<Secret Key>"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/"
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/"
   ```

#### 7. Cursor MCP 설정 (선택사항)

> Cursor AI를 사용하는 경우, Supabase MCP 서버를 설정하면 AI가 데이터베이스를 직접 조회하고 관리할 수 있습니다.

**7-1. Supabase Access Token 생성**

1. Supabase Dashboard → 우측 상단 프로필 아이콘 클릭
2. **Account Settings** → **Access Tokens**
3. **"Generate new token"** 클릭
4. Token name 입력 (예: `cursor-mcp`)
5. 생성된 토큰 복사 (다시 볼 수 없으므로 안전한 곳에 보관)

**7-2. .cursor/mcp.json 설정**

`.cursor/mcp.json` 파일을 열고 `your_supabase_access_token` 부분을 실제 토큰으로 교체:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ]
    }
  }
}
```

**7-3. Cursor 재시작**

Cursor를 완전히 종료하고 다시 실행하여 MCP 서버 설정을 적용합니다.

#### 8. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

**주요 페이지:**
- `/retailer/dashboard`: AI 기반 소매상 대시보드
- `/retailer/products`: 상품 검색 및 구매
- `/retailer/cart`: 장바구니 및 주문 관리
- `/retailer/orders`: 주문 내역 및 배송 추적
- `/retailer/cs`: 고객 문의 및 AI 챗봇
- `/admin/dashboard`: 관리자 대시보드
- `/wholesaler/*`: 도매상 전용 페이지들

### 개발 명령어

```bash
# 개발 서버 실행 (Turbopack)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린팅
pnpm lint
```

## 추가 설정 및 팁

### Clerk 한국어 설정

프로젝트에 이미 Clerk 한국어 로컬라이제이션이 적용되어 있습니다. `app/layout.tsx`의 `ClerkProvider`에서 `koKR` locale이 설정되어 있습니다.

### Supabase RLS (Row Level Security) 정책

프로젝트의 `users` 테이블에는 기본 RLS 정책이 설정되어 있습니다:

- **SELECT**: 사용자는 자신의 데이터만 조회 가능
- **INSERT**: 새 사용자 생성 가능
- **UPDATE**: 사용자는 자신의 데이터만 수정 가능

추가 테이블 생성 시 RLS 정책을 반드시 설정하세요:

```sql
-- 테이블 생성
CREATE TABLE your_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(clerk_id),
  -- 기타 컬럼들
);

-- RLS 활성화
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- SELECT 정책
CREATE POLICY "Users can view their own data"
  ON your_table FOR SELECT
  USING (auth.jwt()->>'sub' = user_id);

-- INSERT 정책
CREATE POLICY "Users can insert their own data"
  ON your_table FOR INSERT
  WITH CHECK (auth.jwt()->>'sub' = user_id);
```

### 추가 로그인 방식 설정

Clerk에서 추가 로그인 방식을 활성화하려면:

1. Clerk Dashboard → **User & Authentication** → **Social Connections**
2. 원하는 제공자 선택 (Google, GitHub, Discord 등)
3. OAuth 자격 증명 입력 (제공자 개발자 콘솔에서 생성)
4. **Enable** 클릭

## 프로젝트 구조

```
farmtobiz-retailer/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # 인증 관련 페이지
│   │   ├── sign-in/            # 로그인
│   │   ├── sign-up/            # 회원가입
│   │   └── role-selection/     # 역할 선택
│   ├── admin/                   # 관리자 페이지
│   │   ├── dashboard/          # 관리자 대시보드
│   │   └── wholesalers/        # 도매상 관리
│   ├── api/                     # API Routes
│   │   ├── ai/                 # Gemini AI API
│   │   ├── market-prices/      # 실시간 시세 API
│   │   ├── payments/           # Toss Payments API
│   │   └── sync-user/          # 사용자 동기화
│   ├── retailer/                # 소매상 페이지
│   │   ├── dashboard/          # AI 대시보드
│   │   ├── products/           # 상품 검색/구매
│   │   ├── cart/               # 장바구니
│   │   ├── orders/             # 주문 관리
│   │   ├── cs/                 # 고객 문의
│   │   └── profile/            # 프로필 관리
│   └── globals.css             # Tailwind CSS 설정
│
├── components/                  # React 컴포넌트
│   ├── admin/                  # 관리자 컴포넌트
│   ├── common/                 # 공통 컴포넌트
│   ├── retailer/               # 소매상 전용 컴포넌트
│   ├── ui/                     # shadcn/ui 컴포넌트
│   ├── providers/              # Context Providers
│   │   ├── query-provider.tsx  # TanStack Query
│   │   ├── sync-user-provider.tsx # 사용자 동기화
│   │   └── theme-provider.tsx  # 다크모드
│   └── role-selection-header.tsx
│
├── lib/                         # 유틸리티 및 설정
│   ├── api/                    # 외부 API 클라이언트
│   │   ├── ai-inquiry.ts       # AI 문의 처리
│   │   ├── market-prices.ts    # 시세 API
│   │   └── gemini.ts           # Gemini AI 설정
│   ├── supabase/               # Supabase 클라이언트들
│   │   ├── queries/            # 데이터베이스 쿼리들
│   │   ├── clerk-client.ts     # Client Component용
│   │   ├── server.ts           # Server Component용
│   │   ├── service-role.ts     # 관리자용
│   │   └── client.ts           # 공개 데이터용
│   ├── payments/               # 결제 관련 유틸리티
│   ├── utils/                  # 공통 유틸리티
│   ├── validation/             # Zod 스키마 검증
│   └── clerk/                  # Clerk 설정
│
├── actions/                     # Server Actions
│   ├── admin/                  # 관리자 액션
│   ├── retailer/               # 소매상 액션
│   └── wholesaler/             # 도매상 액션
│
├── hooks/                       # Custom React Hooks
│   ├── use-cart-data.ts        # 장바구니 데이터
│   ├── use-market-prices.ts    # 시세 데이터
│   ├── use-sync-user.ts        # 사용자 동기화
│   └── use-toss-payment.ts     # Toss 결제
│
├── stores/                      # Zustand 상태 관리
│   └── cart-store.ts           # 장바구니 상태
│
├── types/                       # TypeScript 타입 정의
│   ├── cart.ts                 # 장바구니 타입
│   ├── order.ts                # 주문 타입
│   ├── product.ts              # 상품 타입
│   └── database.ts             # 데이터베이스 타입
│
├── supabase/                    # Supabase 설정
│   ├── migrations/             # 데이터베이스 마이그레이션
│   └── config.toml             # 프로젝트 설정
│
├── docs/                        # 문서 및 디자인
│   ├── design-handoff/         # 디자인 파일들
│   ├── retailer/               # 소매상 관련 문서
│   │   ├── RE_PRD.md          # 요구사항 정의서
│   │   ├── RE_TODO.md         # 작업 목록
│   │   └── Payment_API.md     # 결제 API 문서
│   └── PRD.md                  # 전체 PRD
│
├── .cursor/                     # Cursor AI 규칙
│   └── rules/                  # 개발 컨벤션
│
├── middleware.ts                # Next.js 미들웨어
├── CLAUDE.md                    # AI 에이전트 가이드
├── AGENTS.md                    # 프로젝트 가이드
└── package.json                 # 의존성 관리
```

### 주요 파일 설명

- **`middleware.ts`**: 역할 기반 라우팅 및 Clerk 인증 미들웨어
- **`app/retailer/dashboard/page.tsx`**: AI 기반 소매상 대시보드 메인 페이지
- **`lib/supabase/queries/retailer-products.ts`**: 상품 검색 및 구매 관련 데이터베이스 쿼리
- **`actions/retailer/chat-with-gemini.ts`**: Gemini AI 챗봇과의 대화 처리
- **`hooks/use-market-prices.ts`**: 실시간 농산물 시세 데이터 관리
- **`components/retailer/ProductCard.tsx`**: 상품 표시 및 장바구니 담기 컴포넌트
- **`stores/cart-store.ts`**: Zustand를 사용한 장바구니 상태 관리
- **`lib/payments/process-payment.ts`**: Toss Payments 결제 처리 로직
- **`CLAUDE.md`**: Claude Code를 위한 프로젝트 가이드
- **`docs/retailer/RE_PRD.md`**: 소매상 기능 요구사항 정의서

## 추가 리소스

- [Next.js 15 문서](https://nextjs.org/docs)
- [Clerk 문서](https://clerk.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)
- [Tailwind CSS v4 문서](https://tailwindcss.com/docs)

## 추가 설정 및 팁

### Gemini AI 설정

프로젝트에서 Gemini AI를 사용하기 위해서는 Google AI Studio에서 API 키를 발급받아야 합니다:

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. 새로운 API 키 생성
3. `.env` 파일에 `GOOGLE_AI_API_KEY` 추가

### Toss Payments 설정

실제 결제 기능을 사용하기 위해서는 Toss Payments에서 API 키를 발급받아야 합니다:

1. [Toss Payments 개발자 센터](https://developers.tosspayments.com) 접속
2. 테스트용 API 키 발급
3. `.env` 파일에 관련 키들 추가

### KAMIS API 설정

농산물 시세 정보를 사용하기 위해서는 농림축산식품부 KAMIS API 키가 필요합니다:

1. [KAMIS 개발자 포털](https://www.kamis.or.kr)에서 회원가입 및 API 키 발급
2. `.env` 파일에 API 키 추가

### Package.json 업데이트

현재 `package.json`의 프로젝트 이름이 `saas-mini-course`로 되어 있습니다. 실제 프로젝트명에 맞게 변경하는 것을 권장합니다:

```json
{
  "name": "farmtobiz-retailer",
  "version": "0.1.0",
  "private": true
}
```

---

**FarmToBiz Retailer** - AI 기반 농수산물 B2B 플랫폼 🚀
#   l i n k m a r k e t 
 
 #   f a r m t o b i z - r e t a i l e r 
 
 #   f a r m t o b i z - r e t a i l e r 
 
 