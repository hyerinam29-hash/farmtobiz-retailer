import React from 'react';
import { Search, ChevronRight, ShoppingCart } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                 UI Components                              */
/* -------------------------------------------------------------------------- */

// 상품 카드 컴포넌트 (Static - 과일)
const ProductCard = () => {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col border border-gray-100 shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
      {/* 상품 이미지 */}
      <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gray-100">
        <div className="w-full h-full bg-orange-50 flex items-center justify-center text-gray-400">
          {/* 이미지 대체 */}
          <span className="text-4xl">🍎</span>
        </div>
        <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
          GAP인증
        </span>
      </div>

      {/* 상품 정보 */}
      <div className="p-5 space-y-3 flex-1 flex flex-col bg-white">
        <div className="flex-1">
          <h3 className="font-bold text-base text-gray-900 line-clamp-2">
            프리미엄 청송 꿀사과 5kg
          </h3>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            경북 청송 · 고당도
          </p>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <div className="font-black text-xl text-green-600 tracking-tight">35,000원</div>
          <div className="text-xs text-gray-400 mt-0.5">개당 2,500원 (예상)</div>
        </div>

        <button className="w-full py-2 text-sm h-10 border-2 border-green-500/20 rounded-xl text-green-600 font-bold hover:bg-green-50 flex items-center justify-center gap-2">
          <ShoppingCart size={16} />
          <span>담기</span>
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 Page Component                             */
/* -------------------------------------------------------------------------- */

export const CategoryPage = () => {
  return (
    <div className="relative overflow-hidden min-h-screen bg-[#F8F9FA] font-sans">
      {/* 3D 배경 장식 요소 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-green-200/40 to-emerald-100/0 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/30 to-indigo-50/0 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-20 relative z-10">
      
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* [좌측] 카테고리 사이드바 */}
          <aside className="w-full md:w-48 lg:w-56 flex-shrink-0 hidden md:block">
            <div className="sticky top-24">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-200">카테고리</h2>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex justify-between items-center">
                    채소 
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-3 rounded-lg text-sm font-bold bg-green-50 text-green-600 shadow-sm translate-x-1 flex justify-between items-center">
                    과일 <ChevronRight size={16} />
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex justify-between items-center">
                    수산물
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex justify-between items-center">
                    곡물/견과
                  </a>
                </li>
              </ul>

              <div className="mt-10">
                 <h3 className="text-sm font-bold mb-4 text-gray-800">필터</h3>
                 <div className="space-y-3">
                   <label className="flex items-center gap-2 cursor-pointer">
                     <div className="w-5 h-5 rounded border border-gray-300 bg-white"></div>
                     <span className="text-sm text-gray-600">혜택상품</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer">
                     <div className="w-5 h-5 rounded border border-gray-300 bg-white"></div>
                     <span className="text-sm text-gray-600">신상품</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer">
                     <div className="w-5 h-5 rounded border border-gray-300 bg-white"></div>
                     <span className="text-sm text-gray-600">무료배송</span>
                   </label>
                 </div>
              </div>
            </div>
          </aside>

          {/* [우측] 메인 컨텐츠 영역 */}
          <main className="flex-1 min-w-0">
            
            {/* 카테고리 타이틀 */}
            <div className="mb-8">
               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">과일</h1>
               
               {/* 서브 카테고리 탭 */}
               <div className="flex gap-2 overflow-x-auto pb-2">
                 <button className="whitespace-nowrap px-4 py-2 rounded-full text-sm border bg-gray-900 text-white border-gray-900 font-bold">
                   전체보기
                 </button>
                 <button className="whitespace-nowrap px-4 py-2 rounded-full text-sm border bg-white text-gray-600 border-gray-200 hover:bg-gray-50">
                   제철과일
                 </button>
                 <button className="whitespace-nowrap px-4 py-2 rounded-full text-sm border bg-white text-gray-600 border-gray-200 hover:bg-gray-50">
                   국산과일
                 </button>
                 <button className="whitespace-nowrap px-4 py-2 rounded-full text-sm border bg-white text-gray-600 border-gray-200 hover:bg-gray-50">
                   수입과일
                 </button>
               </div>
            </div>

            {/* 베스트 상품 섹션 */}
            <section className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-green-600">BEST</span> 과일 랭킹 🏆
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 랭킹 1위 */}
                <div className="flex md:flex-col gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative w-32 md:w-full aspect-square flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl">🍎</span>
                    <div className="absolute top-0 left-0 bg-gray-900 text-white w-8 h-8 flex items-center justify-center font-bold text-lg shadow-md z-10">1</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">청송 꿀사과 5kg</h4>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-1">새콤달콤 과즙이 풍부해요</p>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">15%</span>
                      <span className="font-bold text-lg">35,000원</span>
                    </div>
                    <button className="mt-3 w-full py-2 border border-gray-200 rounded-lg flex items-center justify-center gap-2 text-sm font-bold text-gray-600">
                       <ShoppingCart size={16} /> 담기
                    </button>
                  </div>
                </div>

                {/* 랭킹 2위 */}
                <div className="flex md:flex-col gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative w-32 md:w-full aspect-square flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl">🍊</span>
                    <div className="absolute top-0 left-0 bg-gray-900 text-white w-8 h-8 flex items-center justify-center font-bold text-lg shadow-md z-10">2</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">타이벡 감귤 3kg</h4>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-1">고당도 프리미엄 감귤</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">18,900원</span>
                    </div>
                    <button className="mt-3 w-full py-2 border border-gray-200 rounded-lg flex items-center justify-center gap-2 text-sm font-bold text-gray-600">
                       <ShoppingCart size={16} /> 담기
                    </button>
                  </div>
                </div>

                {/* 랭킹 3위 */}
                <div className="flex md:flex-col gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative w-32 md:w-full aspect-square flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl">🍇</span>
                    <div className="absolute top-0 left-0 bg-gray-900 text-white w-8 h-8 flex items-center justify-center font-bold text-lg shadow-md z-10">3</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">샤인머스캣 2kg</h4>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-1">망고향 가득한 달콤함</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">29,000원</span>
                    </div>
                    <button className="mt-3 w-full py-2 border border-gray-200 rounded-lg flex items-center justify-center gap-2 text-sm font-bold text-gray-600">
                       <ShoppingCart size={16} /> 담기
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 전체 상품 리스트 */}
            <section>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                 <div className="text-sm text-gray-600">총 <span className="font-bold text-gray-900">24</span>개</div>
                 <div className="flex items-center gap-4 text-sm text-gray-500">
                   <button className="font-bold text-gray-900">추천순</button>
                   <span className="w-px h-3 bg-gray-300"></span>
                   <button className="hover:text-gray-800">신상품순</button>
                   <span className="w-px h-3 bg-gray-300"></span>
                   <button className="hover:text-gray-800">낮은가격순</button>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-6 gap-y-10">
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
