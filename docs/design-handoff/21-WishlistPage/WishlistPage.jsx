import React from 'react';
import { Heart, Trash2, ShoppingCart, X } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 UI Components                              */
/* -------------------------------------------------------------------------- */

const Card = ({ children, padding = 'md', className = '' }) => {
  const paddings = { md: 'p-6', xl: 'p-12' };
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

const ProductCard = () => (
  <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col border border-gray-100 shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
    {/* 상품 이미지 */}
    <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gray-100">
      <div className="w-full h-full bg-green-50 flex items-center justify-center text-gray-400">
        {/* 이미지 대체 */}
        <span className="text-4xl">🍎</span>
      </div>
      {/* 태그 뱃지 */}
      <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
        인기
      </span>
    </div>

    {/* 상품 정보 */}
    <div className="p-5 space-y-3 flex-1 flex flex-col bg-white">
      <div className="flex-1">
        <h3 className="font-bold text-base text-gray-900 line-clamp-2">
          청송 꿀사과 5kg
        </h3>
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          국산 (경북 청송)
        </p>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div className="font-black text-xl text-green-600 tracking-tight">32,000원</div>
        <div className="text-xs text-gray-400 mt-0.5">1kg 당 6,400원 (예상)</div>
      </div>

      <button className="w-full py-2 text-sm h-10 border-2 border-green-500/20 rounded-xl text-green-600 font-bold hover:bg-green-50 flex items-center justify-center gap-2">
        <ShoppingCart size={16} />
        <span>담기</span>
      </button>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const WishlistPage = () => {
  return (
    <div className="relative overflow-hidden min-h-screen font-sans">
      {/* 3D 배경 장식 요소 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-red-200/40 to-pink-100/0 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-gradient-to-bl from-pink-100/40 to-red-50/0 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-rose-100/30 to-pink-50/0 rounded-full blur-3xl -z-10"></div>

      {/* 3D 플로팅 오브젝트 */}
      <div className="absolute top-[15%] left-[5%] w-32 h-32 bg-gradient-to-br from-white/60 to-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/30 -z-10"></div>
      <div className="absolute top-[40%] right-[10%] w-24 h-24 bg-gradient-to-br from-red-100/60 to-pink-50/10 backdrop-blur-md rounded-[2rem] rotate-12 shadow-lg border border-white/30 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-20 relative z-10">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart size={24} className="text-white" fill="white" />
            </div>
            찜한 상품
          </h1>
          <p className="text-gray-600">마음에 드는 상품을 저장해두었어요</p>
        </div>

        <button
          className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-2 transition-colors"
        >
          <Trash2 size={16} />
          전체 삭제
        </button>
      </div>

      {/* 찜한 상품 개수 */}
      <Card padding="md" className="mb-6 bg-gradient-to-r from-red-50/50 to-pink-50/50 border-red-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-red-500" />
            <span className="text-gray-700">찜한 상품</span>
          </div>
          <span className="text-xl font-black text-red-500">6개</span>
        </div>
      </Card>

      {/* 찜한 상품 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {/* 상품 1 */}
        <div className="relative group">
          <button className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500">
            <X size={16} />
          </button>
          <button className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-green-700 flex items-center gap-2">
            <ShoppingCart size={16} />
            담기
          </button>
          <ProductCard />
        </div>

        {/* 상품 2 */}
        <div className="relative group">
          <button className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500">
            <X size={16} />
          </button>
          <button className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-green-700 flex items-center gap-2">
            <ShoppingCart size={16} />
            담기
          </button>
          <ProductCard />
        </div>

        {/* 상품 3 */}
        <div className="relative group">
          <button className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500">
            <X size={16} />
          </button>
          <button className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-green-700 flex items-center gap-2">
            <ShoppingCart size={16} />
            담기
          </button>
          <ProductCard />
        </div>

        {/* 상품 4 */}
        <div className="relative group">
          <button className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500">
            <X size={16} />
          </button>
          <button className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-green-700 flex items-center gap-2">
            <ShoppingCart size={16} />
            담기
          </button>
          <ProductCard />
        </div>
        
        {/* 상품 5 */}
        <div className="relative group">
          <button className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500">
            <X size={16} />
          </button>
          <button className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-green-700 flex items-center gap-2">
            <ShoppingCart size={16} />
            담기
          </button>
          <ProductCard />
        </div>

        {/* 상품 6 */}
        <div className="relative group">
          <button className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500">
            <X size={16} />
          </button>
          <button className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-green-700 flex items-center gap-2">
            <ShoppingCart size={16} />
            담기
          </button>
          <ProductCard />
        </div>
      </div>

      {/* 추천 상품 섹션 */}
      <div className="mt-16">
        <h2 className="text-xl font-bold text-gray-900 mb-6">이런 상품은 어때요?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>

      </div>
    </div>
  );
};

export default WishlistPage;

