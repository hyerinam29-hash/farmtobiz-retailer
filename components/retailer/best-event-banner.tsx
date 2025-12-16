/**
 * @file components/retailer/best-event-banner.tsx
 * @description 베스트 랭킹 이벤트 배너 컴포넌트
 *
 * 베스트 페이지 상단에 표시되는 보라색 그라디언트 배너입니다.
 * 디자인 핸드오프 이미지 기반으로 구현되었습니다.
 */

import Image from "next/image";

export default function BestEventBanner() {
  return (
    <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-700 dark:to-indigo-800 rounded-3xl overflow-hidden shadow-xl group mb-12 transition-colors duration-200">
      {/* 배경 장식 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-indigo-700/20 dark:from-purple-500/30 dark:to-indigo-900/30 transition-colors duration-200"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
        {/* 왼쪽 텍스트 영역 */}
        <div className="text-white mb-10 md:mb-0 max-w-xl relative z-20 text-center md:text-left w-full md:w-auto">
          {/* 상단 태그 */}
          <div className="inline-block bg-white/20 backdrop-blur-sm px-5 py-1.5 rounded-full text-sm font-bold mb-6 border border-white/30 shadow-sm">
            ✨ 팜투비즈 단독 기획전
          </div>
          
          {/* 메인 타이틀 */}
          <h2 className="text-2xl md:text-4xl font-black mb-5 md:mb-6 leading-tight drop-shadow-lg tracking-tight whitespace-pre-wrap break-keep">
            🏆 베스트 랭킹<br className="hidden md:block" />
            <span className="block md:inline">가장 사랑받는 상품 모음</span>
          </h2>
          
          {/* 설명 텍스트 */}
          <p className="text-base md:text-lg font-medium mb-8 md:mb-10 text-white/95 drop-shadow-md leading-relaxed whitespace-pre-wrap break-keep">
            사장님들이 가장 많이 찾으신<br className="hidden md:block" />
            <span className="block md:inline">인기 상품을 만나보세요!</span>
          </p>
          
          {/* 랭킹 업데이트 정보 */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-3 shadow-lg">
              <div>
                <p className="text-purple-100 text-xs font-medium">랭킹 업데이트</p>
                <p className="text-white font-bold">매일 아침 09:00 기준</p>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 이미지 영역 (모바일에서는 숨김) */}
        <div className="relative z-20 perspective-1000 mt-4 md:mt-0">
          <div className="relative w-72 h-48 md:w-96 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white/40 dark:border-white/30 bg-purple-200 dark:bg-purple-800 transition-colors duration-200">
            <Image
              src="https://images.unsplash.com/photo-1761054189536-15ddd7ad9f11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTU3ODB8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0cyUyMGFuZCUyMHZlZ2V0YWJsZXMlMjBhc3NvcnRtZW50JTIwbWFya2V0fGVufDB8fHx8MTc2NTM2MTY1Mnww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="신선한 과일과 채소가 진열된 베스트 상품"
              fill
              sizes="(min-width: 768px) 384px, 288px"
              className="object-cover"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      
      {/* 하단 장식 요소 (모바일에서만 표시) */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl md:hidden"></div>
    </div>
  );
}

