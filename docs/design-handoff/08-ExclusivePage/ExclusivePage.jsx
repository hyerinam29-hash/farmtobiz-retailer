import React from 'react';
import { ShieldCheck, Fish, Apple, RotateCw, BadgePercent, Trophy, Truck, Star, Package, ShoppingCart } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 UI Components                              */
/* -------------------------------------------------------------------------- */

const ProductCard = ({ tag }) => (
  <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col border border-gray-100 shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
    <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gray-100">
      <span className="text-4xl">🎁</span>
      {tag && (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 border border-white/20">
          {tag}
        </span>
      )}
    </div>
    <div className="p-5 space-y-3 flex-1 flex flex-col bg-white">
      <div className="flex-1">
        <h3 className="font-bold text-base text-gray-900 line-clamp-2">팜투비즈 단독 기획 상품</h3>
        <p className="text-xs text-gray-500 mt-1">오직 여기서만 만날 수 있어요</p>
      </div>
      <div className="border-t border-gray-100 pt-3">
        <div className="font-black text-xl text-purple-600 tracking-tight">45,000원</div>
      </div>
      <button className="w-full py-2 text-sm h-10 border-2 border-purple-500/20 rounded-xl text-purple-600 font-bold hover:bg-purple-50 flex items-center justify-center gap-2">
        <ShoppingCart size={16} />
        <span>담기</span>
      </button>
    </div>
  </div>
);

const EventBanner = () => (
  <div className="relative bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-3xl overflow-hidden shadow-xl transform hover:scale-[1.005] transition-all duration-500 group">
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
      <div className="text-white mb-10 md:mb-0 max-w-xl relative z-20 text-center md:text-left">
        <div className="inline-block bg-white/20 backdrop-blur-sm px-5 py-1.5 rounded-full text-sm font-bold mb-6 border border-white/30 shadow-sm">
          ✨ 팜투비즈 단독 기획전
        </div>
        <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight drop-shadow-lg tracking-tight whitespace-pre-wrap break-keep">
          💜 팜투비즈 단독<br/>오직 여기서만 만나요!
        </h2>
        <p className="text-lg md:text-xl font-medium mb-10 text-white/95 drop-shadow-md leading-relaxed whitespace-pre-wrap break-keep">
          산지 직송 독점 계약 상품<br/>최대 혜택으로 준비했습니다
        </p>
        
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-3 shadow-lg">
            <div className="bg-white rounded-full p-2">
              <ShieldCheck className="text-violet-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-violet-100 text-xs font-medium">품질 보증</p>
              <p className="text-white font-bold">100% 산지 직송 보장</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 perspective-1000 mt-4 md:mt-0">
        <div className="w-72 h-48 md:w-96 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white/40 transform -rotate-3 hover:rotate-0 transition-all duration-500 bg-violet-200 flex items-center justify-center">
          <span className="text-6xl">💎</span>
        </div>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const ExclusivePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <EventBanner />
      
      <h2 className="text-2xl font-bold text-purple-700 mb-6 mt-12">💜 팜투비즈 단독 상품</h2>
      
      {/* 단독관 아이콘 메뉴 (하드코딩) */}
      <div className="flex justify-center gap-8 mb-16 overflow-x-auto py-4">
        <div className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px]">
          <div className="w-20 h-20 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform duration-300 border-4 border-white ring-1 ring-gray-100">
            <RotateCw size={32} />
          </div>
          <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900">재구매많은</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px]">
          <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform duration-300 border-4 border-white ring-1 ring-gray-100">
            <BadgePercent size={32} />
          </div>
          <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900">단독특가</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px]">
          <div className="w-20 h-20 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform duration-300 border-4 border-white ring-1 ring-gray-100">
            <Trophy size={32} />
          </div>
          <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900">베스트랭킹</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px]">
          <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform duration-300 border-4 border-white ring-1 ring-gray-100">
            <Truck size={32} />
          </div>
          <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900">산지직송</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px]">
          <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform duration-300 border-4 border-white ring-1 ring-gray-100">
            <Star size={32} />
          </div>
          <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900">리뷰좋은</span>
        </div>
        <div className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px]">
          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform duration-300 border-4 border-white ring-1 ring-gray-100">
            <Package size={32} />
          </div>
          <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900">대용량</span>
        </div>
      </div>

      {/* 첫 번째 상품 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <ProductCard tag="Only" />
        <ProductCard tag="Only" />
        <ProductCard tag="Only" />
        <ProductCard tag="Only" />
        <ProductCard tag="Only" />
        <ProductCard tag="Only" />
        <ProductCard tag="Only" />
        <ProductCard tag="Only" />
      </div>

      {/* 중간 이벤트 배너 1 */}
      <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-16 cursor-pointer group bg-purple-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-4">
          <h3 className="text-2xl md:text-4xl font-bold mb-2">팜투비즈 X 명품 농장</h3>
          <p className="text-lg md:text-xl opacity-90">오직 여기서만 만날 수 있는 프리미엄 라인업</p>
        </div>
      </div>

      {/* 두 번째 상품 그리드 */}
      <h3 className="text-xl font-bold text-gray-800 mb-6">👀 지금 뜨는 단독 상품</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <ProductCard tag="단독특가" />
        <ProductCard tag="단독특가" />
        <ProductCard tag="단독특가" />
        <ProductCard tag="단독특가" />
        <ProductCard tag="단독특가" />
        <ProductCard tag="단독특가" />
        <ProductCard tag="단독특가" />
        <ProductCard tag="단독특가" />
      </div>

      {/* 중간 이벤트 배너 2 */}
      <div className="flex flex-col md:flex-row gap-6 mb-16">
        <div className="flex-1 h-40 bg-purple-100 rounded-2xl flex items-center justify-between p-8 cursor-pointer hover:shadow-md transition-shadow">
          <div>
            <div className="text-purple-600 font-bold mb-1">Only Farm to Biz</div>
            <h4 className="text-xl font-bold text-gray-900">수산물 직송전</h4>
          </div>
          <Fish size={80} className="text-purple-300" strokeWidth={1.5} />
        </div>
        <div className="flex-1 h-40 bg-orange-100 rounded-2xl flex items-center justify-between p-8 cursor-pointer hover:shadow-md transition-shadow">
          <div>
            <div className="text-orange-600 font-bold mb-1">Premium Quality</div>
            <h4 className="text-xl font-bold text-gray-900">고당도 과일관</h4>
          </div>
          <Apple size={80} className="text-orange-300" strokeWidth={1.5} />
        </div>
      </div>

      {/* 세 번째 상품 그리드 */}
      <h3 className="text-xl font-bold text-gray-800 mb-6">🎁 선물하기 좋은 패키지</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ProductCard tag="선물추천" />
        <ProductCard tag="선물추천" />
        <ProductCard tag="선물추천" />
        <ProductCard tag="선물추천" />
      </div>
    </div>
  );
};

export default ExclusivePage;
