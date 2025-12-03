import React from 'react';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  MapPin,
  Truck,
  Minus,
  Plus,
  ShoppingCart,
  Sparkles,
  Heart,
  Share2
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const ProductDetailPage = () => {
  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-32 font-sans">
      {/* 상단 네비게이션 */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-lg text-gray-800 truncate">
            샤인머스켓 2kg (망고향 가득한 포도)
          </h1>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">
              <Share2 size={22} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">
              <ShoppingCart size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-10">
        {/* 좌측 이미지 영역 */}
        <div className="w-full lg:w-1/2 sticky top-24 self-start">
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl bg-white border-4 border-white flex items-center justify-center bg-green-50">
            <span className="text-9xl">🍇</span>
            <div className="absolute top-6 left-6">
              <span className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-400" /> MD Pick
              </span>
            </div>
            <button className="absolute bottom-6 right-6 w-14 h-14 bg-white/90 backdrop-blur rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all group">
              <Heart size={28} className="text-gray-400 group-hover:text-red-400" />
            </button>
          </div>
          
          {/* 썸네일 리스트 */}
          <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
            <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 border-green-500 shadow-md flex items-center justify-center bg-green-50 text-2xl">🍇</div>
            <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 border-transparent opacity-60 flex items-center justify-center bg-green-50 text-2xl">🍇</div>
            <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 border-transparent opacity-60 flex items-center justify-center bg-green-50 text-2xl">🍇</div>
          </div>
        </div>

        {/* 우측 정보 영역 */}
        <div className="w-full lg:w-1/2">
          {/* 상품 헤더 정보 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-green-500">
              <Sparkles size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-extrabold tracking-wide">
                  산지직송
                </span>
                <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                  <Truck size={14} /> 오늘출발
                </span>
                <div className="flex items-center gap-1 text-yellow-400 ml-auto bg-yellow-50 px-2 py-1 rounded-lg">
                  <Star size={16} fill="currentColor" />
                  <span className="text-gray-800 font-bold text-sm">4.9</span>
                  <span className="text-gray-400 text-xs">(324)</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
                샤인머스켓 2kg
              </h1>
              <p className="text-lg text-gray-500 font-medium mb-8">
                망고향 가득한 포도
              </p>

              <div className="flex items-baseline gap-2 mb-6 border-b border-gray-100 pb-6">
                <span className="text-2xl text-red-500 font-bold">15%</span>
                <span className="text-4xl font-black text-gray-900">25,000원</span>
                <span className="text-gray-400 line-through text-lg ml-2">28,750원</span>
              </div>

              {/* 핵심 정보 요약 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <div className="text-xs text-gray-400 font-bold">원산지</div>
                    <div className="font-bold text-sm">국산 (경북 김천)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <Truck className="text-gray-400" size={20} />
                  <div>
                    <div className="text-xs text-gray-400 font-bold">배송비</div>
                    <div className="font-bold text-sm">무료배송</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 탭 메뉴 */}
          <div className="flex gap-2 mb-6 p-1.5 bg-gray-100 rounded-2xl">
            <button className="flex-1 py-3 rounded-xl text-sm font-bold bg-white text-gray-900 shadow-md">
              상세정보
            </button>
            <button className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-gray-600">
              구매후기 (128)
            </button>
            <button className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-gray-600">
              문의 (5)
            </button>
          </div>

          {/* 탭 컨텐츠 영역 */}
          <div className="min-h-[400px]">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">상품 필수 정보</h3>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-inner">
                  <div className="text-xs text-gray-500 mb-1 font-bold uppercase">BRIX</div>
                  <div className="font-bold text-gray-800">18Brix 이상</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-inner">
                  <div className="text-xs text-gray-500 mb-1 font-bold uppercase">ORIGINTYPE</div>
                  <div className="font-bold text-gray-800">국내산</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-inner">
                  <div className="text-xs text-gray-500 mb-1 font-bold uppercase">GRADE</div>
                  <div className="font-bold text-gray-800">특(수출용)</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-inner">
                  <div className="text-xs text-gray-500 mb-1 font-bold uppercase">FARMING</div>
                  <div className="font-bold text-gray-800">시설재배</div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">상세 설명</h3>
                <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 min-h-[300px] flex flex-col items-center justify-center gap-4 border border-gray-100 border-dashed">
                   <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl grayscale opacity-50">🍇</div>
                   <p>생산자가 직접 전하는 산지의 생생한 이야기를<br/>곧 업데이트할 예정입니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 구매 바 */}
      <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[calc(100%-3rem)] max-w-7xl z-40">
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-[2rem] p-2 pr-3 shadow-2xl flex items-center justify-between gap-4 pl-6 ring-1 ring-black/5">
          
          {/* 수량 선택 */}
          <div className="hidden md:flex items-center gap-4 bg-gray-100/80 rounded-2xl p-1.5 border border-gray-200/50">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm hover:scale-95 active:scale-90 transition-all">
              <Minus size={18} />
            </button>
            <div className="w-12 text-center font-bold text-lg tabular-nums">1</div>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm hover:scale-95 active:scale-90 transition-all">
              <Plus size={18} />
            </button>
          </div>

          <div className="flex flex-col md:hidden">
            <span className="text-xs text-gray-500 font-bold">1개 선택</span>
            <span className="font-bold text-gray-900">25,000원</span>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end">
             <div className="text-right hidden md:block mr-4">
              <div className="text-xs text-gray-500 font-bold">총 결제금액</div>
              <div className="font-black text-2xl text-gray-900 leading-none">25,000원</div>
            </div>
            
            <button className="h-12 md:h-14 px-6 md:px-8 rounded-2xl hidden sm:flex bg-white text-green-600 border-2 border-green-600 font-bold hover:bg-green-50">
              장바구니
            </button>
            <button className="h-12 md:h-14 px-8 md:px-12 rounded-2xl flex-1 sm:flex-none text-lg bg-green-500 text-white font-bold shadow-lg hover:bg-green-600">
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

