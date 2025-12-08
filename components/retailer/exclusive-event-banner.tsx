/**
 * @file components/retailer/exclusive-event-banner.tsx
 * @description 단독관 상단 히어로 배너 컴포넌트
 *
 * 단독관 페이지 상단에 표시되는 보라색 그라디언트 배너입니다.
 * 디자인 핸드오프 이미지 기반으로 구현되었습니다.
 */

import { ShieldCheck } from "lucide-react";

export default function ExclusiveEventBanner() {
  return (
    <div className="relative bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-3xl overflow-hidden shadow-xl group mb-12 w-full">
      {/* 배경 장식 */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-fuchsia-700/20"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
        {/* 왼쪽 텍스트 영역 */}
        <div className="text-white mb-10 md:mb-0 max-w-xl relative z-20 text-center md:text-left w-full md:w-auto">
          {/* 상단 태그 */}
          <div className="inline-block bg-white/20 backdrop-blur-sm px-5 py-1.5 rounded-full text-sm font-bold mb-6 border border-white/30 shadow-sm">
            ✨ 팜투비즈 단독 기획전
          </div>
          
          {/* 메인 타이틀 */}
          <h2 className="text-2xl md:text-4xl font-black mb-5 md:mb-6 leading-tight drop-shadow-lg tracking-tight whitespace-pre-wrap break-keep">
            💜 팜투비즈 단독<br/>오직 여기서만 만나요!
          </h2>
          
          {/* 설명 텍스트 */}
          <p className="text-base md:text-lg font-medium mb-8 md:mb-10 text-white/95 drop-shadow-md leading-relaxed whitespace-pre-wrap break-keep">
            산지 직송 독점 계약 상품<br/>최대 혜택으로 준비했습니다
          </p>
          
          {/* 품질 보증 배지 */}
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

        {/* 오른쪽 이미지 영역 */}
        <div className="relative z-20 perspective-1000 mt-4 md:mt-0">
          <div className="w-72 h-48 md:w-96 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white/40 transform -rotate-3 hover:rotate-0 transition-all duration-500 bg-violet-200 flex items-center justify-center">
            <span className="text-6xl">💎</span>
          </div>
        </div>
      </div>
    </div>
  );
}

