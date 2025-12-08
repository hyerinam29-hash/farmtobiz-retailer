/**
 * @file components/retailer/best-event-banner.tsx
 * @description 베스트 랭킹 이벤트 배너 컴포넌트
 *
 * 베스트 페이지 상단에 표시되는 보라색 그라디언트 배너입니다.
 * 디자인 핸드오프 이미지 기반으로 구현되었습니다.
 */

import { RefreshCw } from "lucide-react";

export default function BestEventBanner() {
  return (
    <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl overflow-hidden shadow-xl transform hover:scale-[1.005] transition-all duration-500 group mb-12">
      {/* 배경 장식 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-indigo-700/20"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-8 lg:p-16">
        {/* 왼쪽 텍스트 영역 */}
        <div className="text-white mb-6 md:mb-0 max-w-xl relative z-20 text-center md:text-left w-full md:w-auto">
          {/* 상단 태그 */}
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 md:px-5 py-1.5 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6 border border-white/30 shadow-sm">
            ✨ 팜투비즈 단독 기획전
          </div>
          
          {/* 메인 타이틀 */}
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 leading-tight drop-shadow-lg tracking-tight whitespace-pre-wrap break-keep">
            🏆 베스트 랭킹<br className="hidden md:block" />
            <span className="block md:inline">가장 사랑받는 상품 모음</span>
          </h2>
          
          {/* 설명 텍스트 */}
          <p className="text-sm md:text-lg lg:text-xl font-medium mb-6 md:mb-10 text-white/95 drop-shadow-md leading-relaxed whitespace-pre-wrap break-keep">
            사장님들이 가장 많이 찾으신<br className="hidden md:block" />
            <span className="block md:inline">인기 상품을 만나보세요!</span>
          </p>
          
          {/* 랭킹 업데이트 정보 */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/20 flex items-center gap-3 shadow-lg">
              <div className="bg-white rounded-full p-2 flex-shrink-0">
                <RefreshCw className="text-purple-600 w-4 h-4 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-purple-100 text-xs font-medium">랭킹 업데이트</p>
                <p className="text-white font-bold text-sm md:text-base">매일 아침 09:00 기준</p>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 이미지 영역 (모바일에서는 숨김) */}
        <div className="relative z-20 perspective-1000 mt-4 md:mt-0 hidden md:block">
          <div className="w-64 h-40 md:w-96 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white/40 transform -rotate-3 hover:rotate-0 transition-all duration-500 bg-purple-200 flex items-center justify-center">
            <span className="text-5xl md:text-6xl">👑</span>
          </div>
          {/* BEST 뱃지 */}
          <div className="absolute -top-6 -right-4 md:-right-8 bg-purple-400 text-gray-900 px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-base font-black shadow-lg border-4 border-white transform rotate-6 z-30">
            BEST 🔥
          </div>
        </div>
      </div>
      
      {/* 하단 장식 요소 (모바일에서만 표시) */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl md:hidden"></div>
    </div>
  );
}

