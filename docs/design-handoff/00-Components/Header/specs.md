# 공통 헤더 (Header) - 디자인 명세서

## 📱 컴포넌트 정보
- **이름**: Header
- **용도**: 사이트 전체 공통 상단 네비게이션
- **작성일**: 2025. 12. 2.

---

## 🎨 디자인 시스템

### 색상 (Colors)
- **Background**: #FFFFFF (흰색)
- **Border**: #E5E7EB (회색 선)
- **Text Primary**: #1F2937 (진한 회색)
- **Accent**: #5B9A6F (녹색 - 활성 상태)

### 크기 (Dimensions)
- **Top Bar Height**: 96px (h-24)
- **Nav Bar Height**: 56px (h-14)
- **Max Width**: 1280px (max-w-7xl)

---

## 🧩 구조 및 레이아웃

### 1. 상단 영역 (Top Bar)
- **로고**: 좌측 정렬, 높이 56px
- **검색바**: 중앙 정렬, 배경 #F3F4F6, 둥근 모서리 (Full Rounded)
- **유틸리티 메뉴**: 우측 정렬 (고객센터, 로그인, 마이페이지, 장바구니)

### 2. 네비게이션 바 (Nav Bar)
- **카테고리 메뉴**: 좌측 위치, Hover 시 드롭다운 메뉴 표시
- **메인 메뉴**: 홈, 베스트, 단독, 연말특가 (가로 나열)
- **활성 상태**: 하단 3px Border (#5B9A6F)

### 3. 드롭다운 메뉴
- **Trigger**: "카테고리" 메뉴 Hover
- **Width**: 224px (w-56)
- **Animation**: Fade In + Slide Down

---

## 💡 개발자 노트
- [ ] `sticky top-0` 및 `z-index: 100` 적용하여 스크롤 시 상단 고정 필요
- [ ] 현재 경로(`useLocation`)에 따라 메뉴 활성 상태(Active Style) 처리 필요
- [ ] 장바구니 뱃지(Badge) 수량 동적 연동 필요
- [ ] 모바일 반응형 처리는 햄버거 메뉴 등으로 변환 고려 (현재는 데스크톱 기준)

