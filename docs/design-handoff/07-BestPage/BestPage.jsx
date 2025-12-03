import React from 'react';
import { Download, RefreshCw, ShoppingCart } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 UI Components                              */
/* -------------------------------------------------------------------------- */

const EventBanner = () => (
  <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl overflow-hidden shadow-xl transform hover:scale-[1.005] transition-all duration-500 group">
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
      <div className="text-white mb-10 md:mb-0 max-w-xl relative z-20 text-center md:text-left">
        <div className="inline-block bg-white/20 backdrop-blur-sm px-5 py-1.5 rounded-full text-sm font-bold mb-6 border border-white/30 shadow-sm">
          ✨ 팜투비즈 단독 기획전
        </div>
        <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight drop-shadow-lg tracking-tight whitespace-pre-wrap break-keep">
          🏆 베스트 랭킹<br/>가장 사랑받는 상품 모음
        </h2>
        <p className="text-lg md:text-xl font-medium mb-10 text-white/95 drop-shadow-md leading-relaxed whitespace-pre-wrap break-keep">
          사장님들이 가장 많이 찾으신<br/>인기 상품을 만나보세요!
        </p>
        
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-3 shadow-lg">
            <div className="bg-white rounded-full p-2">
              <RefreshCw className="text-purple-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-purple-100 text-xs font-medium">랭킹 업데이트</p>
              <p className="text-white font-bold">매일 아침 09:00 기준</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 perspective-1000 mt-4 md:mt-0">
        <div className="w-72 h-48 md:w-96 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white/40 transform -rotate-3 hover:rotate-0 transition-all duration-500 bg-purple-200 flex items-center justify-center">
          <span className="text-6xl">👑</span>
        </div>
        <div className="absolute -top-8 -right-4 md:-right-8 bg-purple-400 text-gray-900 px-6 py-3 rounded-full text-sm md:text-base font-black shadow-lg border-4 border-white transform rotate-6 z-30">
          BEST 🔥
        </div>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const BestPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden font-sans">
      {/* 배경 장식 */}
      <div className="absolute -top-20 left-0 w-96 h-96 bg-gradient-to-br from-purple-100/40 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-100/30 to-transparent rounded-full blur-3xl -z-10"></div>
      
      <EventBanner />
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
          <span className="text-3xl">👑</span> 실시간 베스트 랭킹
        </h2>

        {/* 1~3위 Top Rank (하드코딩) */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mb-16">
          {/* 1위 */}
          <div className="relative group cursor-pointer">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg mb-4 bg-gray-100 flex items-center justify-center">
              <span className="text-6xl">🥇</span>
              <div className="absolute top-0 left-0 bg-purple-600 text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-black text-xl md:text-2xl shadow-md z-10">
                1
              </div>
            </div>
            <div className="text-center px-2">
              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">청송 꿀사과 5kg</h3>
              <p className="text-sm text-gray-500 mb-2 line-clamp-1">재주문 1위, 당도 보장</p>
              <div className="text-xl font-black text-purple-700">32,000원</div>
            </div>
          </div>

          {/* 2위 */}
          <div className="relative group cursor-pointer">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg mb-4 bg-gray-100 flex items-center justify-center">
              <span className="text-6xl">🥈</span>
              <div className="absolute top-0 left-0 bg-purple-600 text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-black text-xl md:text-2xl shadow-md z-10">
                2
              </div>
            </div>
            <div className="text-center px-2">
              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">의성 깐마늘 1kg</h3>
              <p className="text-sm text-gray-500 mb-2 line-clamp-1">알이 굵고 단단해요</p>
              <div className="text-xl font-black text-purple-700">11,500원</div>
            </div>
          </div>

          {/* 3위 */}
          <div className="relative group cursor-pointer">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg mb-4 bg-gray-100 flex items-center justify-center">
              <span className="text-6xl">🥉</span>
              <div className="absolute top-0 left-0 bg-purple-600 text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-black text-xl md:text-2xl shadow-md z-10">
                3
              </div>
            </div>
            <div className="text-center px-2">
              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">제주 노지 감귤 10kg</h3>
              <p className="text-sm text-gray-500 mb-2 line-clamp-1">새콤달콤 제철 감귤</p>
              <div className="text-xl font-black text-purple-700">18,900원</div>
            </div>
          </div>
        </div>

        {/* 4~10위 List (하드코딩) */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* 4위 */}
          <div className="flex items-center gap-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-100/50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
            <div className="font-black text-2xl text-gray-300 w-8 text-center">4</div>
            <div className="w-24 h-32 md:w-32 md:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative flex items-center justify-center text-3xl">
              🥬
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">강원 고랭지 배추 3입</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">속이 꽉 찬 배추, 김장용으로 최고</p>
              <div className="font-black text-xl text-gray-900">12,000원</div>
            </div>
            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-purple-600 hover:text-purple-600 transition-colors bg-white shadow-sm flex-shrink-0">
              <ShoppingCart size={20} />
            </button>
          </div>

          {/* 5위 */}
          <div className="flex items-center gap-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-100/50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
            <div className="font-black text-2xl text-gray-300 w-8 text-center">5</div>
            <div className="w-24 h-32 md:w-32 md:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative flex items-center justify-center text-3xl">
              🍠
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">해남 꿀고구마 3kg</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">달콤하고 촉촉한 꿀고구마</p>
              <div className="font-black text-xl text-gray-900">15,900원</div>
            </div>
            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-purple-600 hover:text-purple-600 transition-colors bg-white shadow-sm flex-shrink-0">
              <ShoppingCart size={20} />
            </button>
          </div>

          {/* 6위 */}
          <div className="flex items-center gap-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-100/50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
            <div className="font-black text-2xl text-gray-300 w-8 text-center">6</div>
            <div className="w-24 h-32 md:w-32 md:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative flex items-center justify-center text-3xl">
              🧅
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">무안 양파 5kg</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">단단하고 저장성 좋은 양파</p>
              <div className="font-black text-xl text-gray-900">9,900원</div>
            </div>
            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-purple-600 hover:text-purple-600 transition-colors bg-white shadow-sm flex-shrink-0">
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestPage;
