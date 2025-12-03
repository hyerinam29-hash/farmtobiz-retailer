import React from 'react';
import { Clock, Zap, AlertTriangle, ShoppingCart } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 UI Components                              */
/* -------------------------------------------------------------------------- */

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col border border-gray-100 shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
      {/* 상품 이미지 */}
      <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gray-100">
        <div className="w-full h-full bg-red-50 flex items-center justify-center text-gray-400">
          {/* 이미지 대체 */}
          <span className="text-4xl">🔥</span>
        </div>
        {product.tag && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 animate-pulse">
            {product.tag}
          </span>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-5 space-y-3 flex-1 flex flex-col bg-white">
        <div className="flex-1">
          <h3 className="font-bold text-base text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            한정수량 특가
          </p>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-end gap-2 mb-1">
            <span className="text-xl font-black text-red-600">{product.price}</span>
            <span className="text-sm text-gray-400 line-through mb-1">{product.originalPrice}</span>
          </div>
        </div>

        <button className="w-full py-2 text-sm h-10 border-2 border-red-500/20 rounded-xl text-red-600 font-bold hover:bg-red-50 flex items-center justify-center gap-2">
          <ShoppingCart size={16} />
          <span>담기</span>
        </button>
      </div>
    </div>
  );
};

const EventBanner = () => (
  <div className="relative bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl overflow-hidden shadow-xl transform hover:scale-[1.005] transition-all duration-500 group">
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
      <div className="text-white mb-10 md:mb-0 max-w-xl relative z-20 text-center md:text-left">
        <div className="inline-block bg-white/20 backdrop-blur-sm px-5 py-1.5 rounded-full text-sm font-bold mb-6 border border-white/30 shadow-sm">
          ✨ 팜투비즈 단독 기획전
        </div>
        <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight drop-shadow-lg tracking-tight whitespace-pre-wrap break-keep">
          🔥 연말 결산 특가<br/>최대 80% 할인 혜택
        </h2>
        <p className="text-lg md:text-xl font-medium mb-10 text-white/95 drop-shadow-md leading-relaxed whitespace-pre-wrap break-keep">
          한 해 동안 사랑받은 상품을<br/>역대급 가격으로 만나보세요
        </p>
        
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-3 shadow-lg">
            <div className="bg-white rounded-full p-2">
              <AlertTriangle className="text-red-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-red-100 text-xs font-medium">한정 수량</p>
              <p className="text-white font-bold">재고 소진 시 조기 종료</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 perspective-1000 mt-4 md:mt-0">
        <div className="w-72 h-48 md:w-96 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white/40 transform -rotate-3 hover:rotate-0 transition-all duration-500 bg-red-800 flex items-center justify-center">
          <span className="text-6xl">⏰</span>
        </div>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const SpecialPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <EventBanner />
      
      {/* 타임세일 타이머 섹션 */}
      <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white animate-pulse">
            <Zap size={28} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-red-600 leading-none mb-1">오늘만 이 가격!</h2>
            <p className="text-red-400 font-bold text-sm">한정수량 소진 시 조기 마감</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock size={24} className="text-gray-600" />
          <span className="text-gray-600 font-bold mr-2">남은 시간</span>
          <div className="flex gap-2 text-3xl font-black text-gray-900 font-mono">
            <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-red-600">09</div>
            <span className="self-center">:</span>
            <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-red-600">59</div>
            <span className="self-center">:</span>
            <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-red-600">59</div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
        <Zap size={24} /> 실시간 랭킹 특가
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ProductCard product={{ name: '못난이 사과 10kg', price: '19,900원', originalPrice: '45,000원', tag: '55% OFF' }} />
        <ProductCard product={{ name: '파지 고구마 5kg', price: '12,900원', originalPrice: '28,000원', tag: '54% OFF' }} />
        <ProductCard product={{ name: '급냉 오징어 1kg', price: '9,900원', originalPrice: '22,000원', tag: '55% OFF' }} />
        <ProductCard product={{ name: '땡처리 양파 10kg', price: '8,900원', originalPrice: '18,000원', tag: '50% OFF' }} />
        <ProductCard product={{ name: '제주 당근 (특) 5kg', price: '15,900원', originalPrice: '32,000원', tag: '50% OFF' }} />
        <ProductCard product={{ name: '흠집 복숭아 4kg', price: '22,900원', originalPrice: '46,000원', tag: '50% OFF' }} />
        <ProductCard product={{ name: '냉동 블루베리 1kg', price: '11,900원', originalPrice: '24,000원', tag: '50% OFF' }} />
        <ProductCard product={{ name: '햇 감자 (조림용) 5kg', price: '13,900원', originalPrice: '28,000원', tag: '50% OFF' }} />
      </div>
    </div>
  );
};

export default SpecialPage;
