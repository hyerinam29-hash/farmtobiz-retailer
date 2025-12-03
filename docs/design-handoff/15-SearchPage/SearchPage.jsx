import React from 'react';
import { Search, AlertCircle, ShoppingCart } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 UI Components                              */
/* -------------------------------------------------------------------------- */

const Button = ({ children, variant = 'primary', size = 'md', className = '' }) => {
  const baseStyles = 'font-bold rounded-xl flex items-center justify-center gap-2 transition-all';
  const variants = {
    primary: 'bg-green-500 text-white border-b-4 border-green-700 shadow-lg active:border-b-0 active:translate-y-1',
    outline: 'bg-transparent text-gray-600 border-2 border-b-4 border-gray-300 hover:bg-gray-50 active:border-b-2 active:translate-y-0.5',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg w-full',
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, padding = 'md', className = '' }) => {
  const paddings = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

const ProductCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer">
    <div className="aspect-square bg-gray-100 relative flex items-center justify-center overflow-hidden">
      <span className="text-4xl group-hover:scale-110 transition-transform">🍎</span>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
    </div>
    <div className="p-4">
      <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">청송 꿀사과 5kg</h3>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        당도가 높고 아삭한 식감이 일품인 프리미엄 사과입니다.
      </p>
      <div className="flex items-center justify-between">
        <span className="font-bold text-lg text-gray-900">32,000원</span>
        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white transition-colors">
          <ShoppingCart size={16} />
        </button>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const SearchPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500 font-sans">
      {/* 검색 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Search className="text-green-600" />
          <span className="text-green-600">'사과'</span> 검색 결과
          <span className="text-gray-500 text-lg font-normal ml-2">(4건)</span>
        </h1>
      </div>

      {/* 검색 결과 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>

      {/* 검색 결과 없음 (주석 처리됨 - 필요시 주석 해제하여 확인) */}
      {/* 
      <Card padding="lg" className="text-center py-20">
        <AlertCircle size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">검색 결과가 없습니다</h3>
        <p className="text-gray-500 mb-6">다른 검색어로 다시 시도해보세요.</p>
        <Button variant="outline">
          홈으로 돌아가기
        </Button>
      </Card> 
      */}
    </div>
  );
};

export default SearchPage;
