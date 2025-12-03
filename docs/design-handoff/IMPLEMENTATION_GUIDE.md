# 🚀 개발자 구현 가이드

> **이 코드를 실제 프로젝트에 바로 사용하는 방법**

---

## ⚡️ 빠른 시작 (3단계)

### 1️⃣ 필수 파일 복사
```bash
# 프로젝트 루트에서 실행
cp -r design-handoff/01-HomePage/HomePage.jsx src/pages/
cp -r design-handoff/02-CategoryPage-Vegetable/CategoryPage.jsx src/pages/
# ... (필요한 페이지 복사)
cp -r design-handoff/21-WishlistPage/WishlistPage.jsx src/pages/
cp -r design-handoff/22-ProductDetail-ShineMuscat/ProductDetailPage.jsx src/pages/ProductDetailShineMuscatPage.jsx

# 공통 컴포넌트 복사 (필요 시)
cp design-handoff/00-Components/Header/Header.jsx src/components/layout/
```

### 2️⃣ 의존성 파일 복사
```bash
# Mock 데이터 복사 (실제 API로 교체할 때까지 임시 사용)
cp -r ../src/data ./src/
cp -r ../src/components ./src/
cp -r ../src/utils ./src/
```

### 3️⃣ 라우팅 설정
`src/App.jsx`에 라우트 추가:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
// ... 다른 페이지 import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/product-shine-muscat" element={<ProductDetailShineMuscatPage />} />
        {/* ... 다른 라우트 */}
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🔧 실제 API로 교체하기

### ❌ 현재 (Mock 데이터)
```jsx
// HomePage.jsx
import { allProducts } from '../data/products';  // Mock 데이터
const products = Object.values(allProducts).flat();
```

### ✅ 실제 API 연동 후
```jsx
// HomePage.jsx
import { useState, useEffect } from 'react';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Supabase 또는 실제 API 호출
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // 나머지 코드 동일...
}
```

---

## 📋 교체해야 할 Mock 데이터 목록

### 1. **상품 데이터** (`src/data/products.js`)
```js
// 현재: 하드코딩된 상품 리스트
export const allProducts = { ... }

// 실제: Supabase 테이블
// products (id, name, price, category, img, origin, ...)
```

### 2. **배송 데이터** (`src/data/mockData.js`)
```js
// 현재: 가짜 배송 정보
export const deliveryData = [...]

// 실제: Supabase 테이블
// deliveries (id, order_id, status, tracking_number, ...)
```

### 3. **주문 내역** (`src/data/mockData.js`)
```js
// 현재: 가짜 주문 내역
export const recentOrders = [...]

// 실제: Supabase 테이블
// orders (id, user_id, total, status, created_at, ...)
```

---

## 🎯 구현해야 할 기능 (우선순위)

### 🔴 필수 (Phase 1)
- [ ] **Supabase 연결** - 데이터베이스 설정
- [ ] **상품 조회 API** - Mock 데이터 → 실제 DB
- [ ] **인증 시스템** - 로그인/회원가입 기능
- [ ] **장바구니 상태 관리** - Zustand/Redux

### 🟡 중요 (Phase 2)
- [ ] **검색 기능** - 실시간 검색 구현
- [ ] **필터링** - 카테고리/가격/정렬
- [ ] **결제 연동** - 토스페이먼츠/아임포트
- [ ] **주문 관리** - CRUD 기능

### 🟢 추가 (Phase 3)
- [ ] **이미지 업로드** - Supabase Storage
- [ ] **리뷰 시스템** - 별점/댓글
- [ ] **알림 기능** - 주문 상태 변경 시
- [ ] **관리자 페이지** - 상품/주문 관리

---

## 🔌 Supabase 설정 예시

### 1. 환경 변수 설정
`.env.local` 파일 생성:
```env
REACT_APP_SUPABASE_URL=your-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Supabase 클라이언트 설정
`src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 3. 데이터 가져오기 예시
```js
import { supabase } from '../lib/supabase';

// 상품 목록 가져오기
const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .eq('category', 'VEGETABLE');
```

---

## 🛡️ 주의사항

### ⚠️ 이 코드는 디자인 템플릿입니다
- **UI/UX만 완성**되어 있습니다
- **실제 기능 구현**은 개발자가 해야 합니다
- **보안, 성능 최적화**는 프로덕션 배포 전 필수

### 🔒 보안 체크리스트
- [ ] API 키를 환경 변수로 관리
- [ ] SQL Injection 방어
- [ ] XSS 공격 방어
- [ ] CSRF 토큰 사용
- [ ] 입력 값 검증 (Validation)

### ⚡️ 성능 최적화
- [ ] 이미지 최적화 (WebP, lazy loading)
- [ ] 코드 스플리팅 (React.lazy)
- [ ] 메모이제이션 (useMemo, useCallback)
- [ ] 번들 사이즈 분석 (webpack-bundle-analyzer)

---

## 📞 문의

구현 중 문제가 있으면:
1. **프로젝트 루트의 `docs/CONFLICT_PREVENTION.md` 참고**
2. **GitHub Issues에 질문 남기기**
3. **개발팀과 코드 리뷰 진행**

---

**작성일**: 2025. 12. 2.
**작성자**: Farm to Biz 디자인 팀
**버전**: 1.1 (디자인 핸드오프 완료)
