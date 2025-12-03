# 📖 디자인 전달 폴더 사용 가이드

> 이 문서는 `design-handoff/` 폴더의 사용법을 설명합니다.

---

## 🎯 이 폴더는 무엇인가요?

이 폴더는 **개발자가 디자인을 쉽게 이해하고 참고**할 수 있도록 만든 **Figma 스타일 디자인 가이드**입니다.

실제 코드는 포함되어 있지 않고, **순수 디자인 참고 자료**만 들어있습니다:
- 📸 각 페이지의 스크린샷 (Desktop + Mobile)
- 📝 디자인 명세서 (색상, 폰트, 간격 등)
- 🎨 디자인 시스템 가이드

---

## 📂 폴더 구조

```
design-handoff/
├── README.md                           # 전체 가이드
├── HOW_TO_USE.md                       # 이 파일 (사용법)
│
├── 00-Components/                        # 공통 컴포넌트
│   └── Header/
│       ├── specs.md                 # 디자인 명세서
│       └── Header.jsx               # ⭐️ 실제 React 코드
│
├── 01-HomePage/                        # 메인 대시보드
│   ├── desktop.png                     # 데스크톱 스크린샷 (1920x1080)
│   ├── mobile.png                      # 모바일 스크린샷 (375x812)
│   └── specs.md                        # 디자인 명세서
│
├── 02-CategoryPage-Vegetable/          # 카테고리 - 채소
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 03-CategoryPage-Fruit/              # 카테고리 - 과일
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 04-ProductDetailPage/               # 상품 상세
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 05-CartPage/                        # 장바구니
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 06-OrderPage/                       # 주문/결제
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 07-BestPage/                        # 베스트 랭킹
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 08-ExclusivePage/                   # 단독 상품
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 09-SpecialPage/                     # 연말 특가
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 10-CustomerServicePage/             # 고객센터
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 11-MarketPricePage/                 # 실시간 시세표
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 12-MyPage/                          # 마이페이지
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 13-LoginPage/                       # 로그인
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 14-SignupPage/                      # 회원가입
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 15-SearchPage/                      # 검색 결과
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 16-DeliveryTrackingPage/            # 배송 조회
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 17-OrderDetailPage/                 # 주문 상세
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 18-OrderCompletePage/               # 주문 완료
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 19-ReviewWritePage/                 # 리뷰 작성
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 20-ProfileEditPage/                 # 회원정보 수정
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
├── 21-WishlistPage/                    # 찜한 상품
│   ├── desktop.png
│   ├── mobile.png
│   └── specs.md
│
└── 22-ProductDetail-ShineMuscat/       # 상품 상세 (샤인머스켓)
    ├── desktop.png
    ├── mobile.png
    └── specs.md
```

**총 22개 페이지 × 3개 파일 = 66개 파일 + 문서 2개 = 68개 파일**
**총 용량: 23MB**

---

## 🚀 빠른 시작 (개발자용)

### Step 1: 전체 가이드 읽기
먼저 `README.md`를 읽어 전체 구조를 파악하세요.

```bash
cd design-handoff
open README.md  # Mac
# 또는 code README.md (VSCode)
```

### Step 2: 페이지별 스크린샷 확인
각 페이지 폴더에 들어가 `desktop.png`와 `mobile.png`를 확인하세요.

```bash
# 예시: HomePage 확인
cd 01-HomePage
open desktop.png  # 데스크톱 화면
open mobile.png   # 모바일 화면
```

### Step 3: 디자인 명세서 읽기
`specs.md` 파일에는 다음 정보가 포함되어 있습니다:
- **색상 팔레트** (Primary, Secondary, Accent 등)
- **타이포그래피** (폰트, 크기, 굵기)
- **레이아웃 간격** (섹션 간격, 패딩, 마진)
- **컴포넌트 스타일** (버튼, 카드, 입력창 등)
- **개발 노트** (TODO 리스트, 주의사항)

```bash
open 01-HomePage/specs.md
```

### Step 4: 실제 코드 확인
디자인을 확인한 후, 실제 React 코드는 프로젝트 루트의 `src/pages/` 폴더에 있습니다.

```bash
cd ..  # design-handoff 폴더에서 나가기
cd src/pages
ls -la  # 모든 페이지 파일 확인
```

---

## 📖 각 파일의 역할

### 1. `desktop.png` - 데스크톱 스크린샷
- **해상도**: 1920 × 1080
- **용도**: 데스크톱 화면 디자인 참고
- **특징**: 전체 페이지 캡처 (스크롤 포함)

### 2. `mobile.png` - 모바일 스크린샷
- **해상도**: 375 × 812 (iPhone 12 Pro)
- **용도**: 모바일 화면 디자인 참고
- **특징**: 전체 페이지 캡처 (스크롤 포함)

### 3. `specs.md` - 디자인 명세서
페이지별로 다음 정보를 포함합니다:

#### 📱 화면 정보
- 페이지명
- URL
- 작성일

#### 🎨 디자인 시스템
- **색상**: Primary, Secondary, Accent, Background, Text 색상
- **타이포그래피**: H1, H2, H3, 본문, 캡션 크기 및 굵기
- **간격**: 섹션 간격, 컨텐츠 간격, 컴포넌트 간격
- **모서리**: Border Radius 값
- **그림자**: Box Shadow 값

#### 📐 레이아웃
- 반응형 브레이크포인트 (Mobile, Tablet, Desktop)
- 컨테이너 최대 너비
- 패딩 값

#### 🧩 주요 컴포넌트
- 버튼 스타일 (Primary, Secondary, Outline)
- 카드 스타일
- 상품 카드 스타일
- 입력창 스타일

#### 💡 개발자 노트
- TODO 리스트 (개발자가 구현해야 할 기능)
- 주의사항 (Mock 데이터 의존성 등)

---

## 🎨 디자인 시스템 (전체 공통)

### 색상
```css
Primary: #5B9A6F       /* 녹색 - 메인 브랜드 컬러 */
Secondary: #fbbf24     /* 노란색 - 특가/할인 */
Accent: #ef4444        /* 빨간색 - 알림/품절 */
Background: #F8F9FA    /* 연한 회색 - 배경 */
Text Primary: #111827  /* 진한 회색 - 제목 */
Text Secondary: #6B7280 /* 중간 회색 - 본문 */
```

### 폰트
```css
font-family: 'Pretendard', sans-serif;

/* 크기 */
H1: 32px / Bold (모바일: 24px)
H2: 24px / Bold (모바일: 20px)
H3: 20px / Bold (모바일: 18px)
본문: 16px / Regular
캡션: 14px / Regular
작은 텍스트: 12px / Regular
```

### 반응형 브레이크포인트
```css
Mobile: < 640px
Tablet: 640px ~ 1024px
Desktop: > 1024px
```

### 컴포넌트 스타일

#### 버튼
```css
높이: 48px (모바일: 44px)
패딩: 24px (좌우)
Border Radius: 12px

Primary: 녹색 배경 + 흰색 텍스트
Secondary: 흰색 배경 + 회색 테두리
```

#### 카드
```css
배경: 흰색
Border: 1px solid #E5E7EB
Border Radius: 16px
패딩: 24px
그림자: 0 8px 30px rgba(0,0,0,0.04)
```

#### 상품 카드
```css
이미지 비율: 1:1 (정사각형)
Border Radius: 12px
호버 효과: 이미지 확대 (scale 1.05)
```

---

## ⚠️ 중요 안내

### 이 폴더는 디자인 참고용입니다
- ✅ 디자인 시안 확인
- ✅ 디자인 명세 참고
- ✅ 개발자와 커뮤니케이션
- ❌ **실제 코드는 포함되어 있지 않습니다!**

### 실제 개발은
1. **디자인 확인**: `design-handoff/` 폴더에서 스크린샷 및 명세 확인
2. **코드 가져오기**: `src/pages/` 폴더의 React 코드 사용
3. **충돌 방지**: `docs/CONFLICT_PREVENTION.md` 필독
4. **개발 가이드**: `docs/DEVELOPER_GUIDE.md` 참고

---

## 🔧 개발자가 해야 할 일 (체크리스트)

### 1단계: 디자인 이해 (이 폴더 활용)
- [ ] `design-handoff/README.md` 읽기
- [ ] 모든 페이지 스크린샷 확인
- [ ] 각 페이지의 `specs.md` 읽기
- [ ] 디자인 시스템 파악 (색상, 폰트, 간격 등)

### 2단계: 코드 확인
- [ ] `src/pages/` 폴더의 React 코드 확인
- [ ] `docs/CONFLICT_PREVENTION.md` 읽기
- [ ] `docs/DEVELOPER_GUIDE.md` 읽기

### 3단계: 통합 준비
- [ ] Mock 데이터 의존성 파악 (`src/data/` 폴더)
- [ ] API 서비스 생성 (`src/services/`)
- [ ] Supabase 테이블 생성

### 4단계: 개발 서버 통합
- [ ] 별도 폴더에 디자인 코드 복사 (충돌 방지)
- [ ] Mock 데이터를 실제 API로 교체
- [ ] 전역 상태 관리 추가 (Zustand/Redux)
- [ ] 라우팅 통합
- [ ] 테스트

---

## 📞 문의

디자인 관련 질문이 있으시면:
- GitHub Issues에 남겨주세요
- 또는 프로젝트 루트의 `docs/` 폴더 참고

---

**작성일**: 2025. 12. 2.
**생성 도구**: Puppeteer (자동 스크린샷)
**작성자**: Farm to Biz 디자인 팀 (v1.1)

---

## 🎁 보너스: 자동 스크린샷 재생성 방법

페이지가 수정되어 스크린샷을 다시 찍어야 한다면:

```bash
# 1. 개발 서버 실행 (다른 터미널에서)
PORT=3001 npm start

# 2. 스크린샷 재생성
node scripts/captureDesigns.js

# 3. design-handoff 폴더 확인
ls -la design-handoff/
```

모든 페이지의 스크린샷이 자동으로 업데이트됩니다! 🚀
