import React from 'react';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';

// 카테고리 데이터 (하드코딩)
const CATEGORIES = [
  { id: 'VEGETABLE', label: '채소' },
  { id: 'FRUIT', label: '과일' },
  { id: 'SEAFOOD', label: '수산물' },
  { id: 'GRAIN', label: '곡물/견과' },
  { id: 'MEAT', label: '정육/계란' },
  { id: 'PROCESSED', label: '가공식품' },
];

/* -------------------------------------------------------------------------- */
/*                                 UI Components                              */
/* -------------------------------------------------------------------------- */

// Link 컴포넌트 대체 (a 태그 사용)
const Link = ({ to, children, className }) => {
  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
};

// 헤더 컴포넌트 (UI Only)
export const Header = () => {
  // 현재 경로 확인 함수 (하드코딩된 예시 - 실제 구현 시 제거 필요)
  const isActive = (path) => path === '/'; 

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer group">
          <img
            src="https://placehold.co/200x60/5B9A6F/ffffff?text=Farm+to+Biz"
            alt="Farm to Biz Logo"
            className="h-14 object-contain"
          />
        </Link>

        {/* 검색바 */}
        <div className="flex-1 max-w-2xl mx-10 bg-gray-100 rounded-full px-6 py-3 flex items-center shadow-inner">
          <Search className="text-gray-400 w-6 h-6 mr-3" />
          <input
            type="text"
            placeholder="품목이나 거래처를 검색하세요"
            className="bg-transparent border-none outline-none w-full text-base text-gray-600 placeholder-gray-400"
          />
        </div>

        {/* 우측 메뉴 */}
        <div className="flex flex-col items-end justify-center h-full gap-2">
          <div className="flex items-center gap-4 text-base font-medium text-gray-600">
            <Link to="/customer-service" className="cursor-pointer hover:text-green-600 transition-colors">고객센터</Link>
            <span className="w-px h-3 bg-gray-300"></span>
            <Link to="/login" className="cursor-pointer hover:text-green-600 transition-colors">로그인 / 회원가입</Link>
          </div>

          <div className="flex items-center gap-8 mt-1">
            <Link to="/my-page" className="flex flex-col items-center gap-1 cursor-pointer group">
              <User size={32} strokeWidth={1.5} className="text-gray-900 group-hover:text-green-600 transition-colors" />
              <span className="text-sm text-gray-800 font-bold group-hover:text-green-600">나의상회</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center gap-1 cursor-pointer group relative">
              <ShoppingCart size={32} strokeWidth={1.5} className="text-gray-900 group-hover:text-green-600 transition-colors" />
              <span className="text-sm text-gray-800 font-bold group-hover:text-green-600">장바구니</span>
              <div className="absolute -top-1 -right-2 w-6 h-6 bg-green-600 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-sm border-2 border-white">
                2
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 카테고리 네비게이션 */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-14">
          {/* 카테고리 라벨 (드롭다운 메뉴) */}
          <div className="relative group z-50 border-r border-gray-200 pr-10 mr-8 shrink-0 h-full flex items-center">
            <div className="flex items-center gap-3 font-bold text-lg text-gray-800 cursor-pointer hover:text-green-600 transition-colors">
              <Menu size={24} /> 카테고리
            </div>

            {/* 드롭다운 메뉴 */}
            <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-b-xl border border-gray-100 py-3 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
              {CATEGORIES.map((cat) => (
                <Link 
                  key={cat.id} 
                  to={`/category/${cat.id}`}
                  className="block px-6 py-3.5 text-base text-gray-600 hover:bg-gray-50 hover:text-green-600 hover:font-bold transition-colors"
                >
                  <div className="flex items-center justify-between">
                    {cat.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 나머지 메뉴 링크들 */}
          <div className="flex items-center gap-10 overflow-x-auto no-scrollbar flex-1 h-full">
            {/* 홈 버튼 */}
            <Link
              to="/"
              className={`flex items-center h-full text-lg font-bold whitespace-nowrap border-b-[3px] transition-colors ${
                isActive('/')
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-800 hover:text-green-600'
              }`}
            >
              홈
            </Link>

            {/* 신규 추가 메뉴 (마켓컬리 스타일) */}
            <Link
              to="/best"
              className="flex items-center h-full text-lg font-bold whitespace-nowrap border-b-[3px] border-transparent text-gray-800 hover:text-green-600 transition-colors"
            >
              베스트
            </Link>
            <Link
              to="/exclusive"
              className="flex items-center h-full text-lg font-bold whitespace-nowrap border-b-[3px] border-transparent text-gray-800 hover:text-purple-700 transition-colors"
            >
              단독
            </Link>
            <Link
              to="/special"
              className="flex items-center h-full text-lg font-bold whitespace-nowrap border-b-[3px] border-transparent text-gray-800 hover:text-green-600 transition-colors"
            >
              연말특가
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

