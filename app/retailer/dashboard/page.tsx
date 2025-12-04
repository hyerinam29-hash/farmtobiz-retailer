/**
 * @file app/retailer/dashboard/page.tsx
 * @description 소매점 대시보드 페이지
 *
 * 소매점 사용자의 메인 대시보드입니다.
 *
 * 주요 기능:
 * 1. AI 추천 상품 모듈 (R.DASH.02)
 * 2. 최근 주문 요약 (R.DASH.03)
 * 3. 배송 예정 알림
 * 4. 일일 특가 섹션
 * 5. 반응형 디자인 (모바일/태블릿/데스크톱)
 *
 * @dependencies
 * - app/retailer/layout.tsx (레이아웃)
 * - components/retailer/ai-recommendation-list.tsx (AI 추천 상품 리스트)
 *
 * @see {@link PRD.md} - R.DASH.01~04 요구사항
 */

"use client";

import { 
  ChevronRight, 
  Clock, 
  ShoppingCart, 
  Truck, 
  Package
} from 'lucide-react';
import AIRecommendationList from "@/components/retailer/ai-recommendation-list";

// 임시 목 데이터 - AI 추천 상품 (추후 API로 교체 예정)
const mockRecommendedProducts = [
  {
    id: "1",
    name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    standardized_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    category: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    specification: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    price: 0, // 가격 삭제, 나중에 내용 추가 가능
    moq: 1,
    image_url: null, // 데모 이미지 삭제, 나중에 이미지 추가 가능
    is_seasonal: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    stock_warning: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    anonymous_seller_id: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    seller_region: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
  },
  {
    id: "2",
    name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    standardized_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    category: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    specification: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    price: 0, // 가격 삭제, 나중에 내용 추가 가능
    moq: 1,
    image_url: null, // 데모 이미지 삭제, 나중에 이미지 추가 가능
    is_seasonal: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    stock_warning: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    anonymous_seller_id: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    seller_region: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
  },
  {
    id: "3",
    name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    standardized_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    category: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    specification: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    price: 0, // 가격 삭제, 나중에 내용 추가 가능
    moq: 2,
    image_url: null, // 데모 이미지 삭제, 나중에 이미지 추가 가능
    is_seasonal: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    stock_warning: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    anonymous_seller_id: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    seller_region: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
  },
  {
    id: "4",
    name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    standardized_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    category: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    specification: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    price: 0, // 가격 삭제, 나중에 내용 추가 가능
    moq: 1,
    image_url: null, // 데모 이미지 삭제, 나중에 이미지 추가 가능
    is_seasonal: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    stock_warning: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    anonymous_seller_id: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    seller_region: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
  },
];

// 임시 목 데이터 - 최근 주문 (추후 API로 교체 예정)
const mockRecentOrders = [
  {
    id: "1",
    order_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    product_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    status: "delivered" as const,
    status_label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_method: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_scheduled_time: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    total_price: 0, // 가격 삭제, 나중에 내용 추가 가능
  },
  {
    id: "2",
    order_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    product_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    status: "shipping" as const,
    status_label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_method: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_scheduled_time: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    total_price: 0, // 가격 삭제, 나중에 내용 추가 가능
  },
  {
    id: "3",
    order_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    product_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    status: "preparing" as const,
    status_label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_method: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_scheduled_time: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    total_price: 0, // 가격 삭제, 나중에 내용 추가 가능
  },
];

// 임시 목 데이터 - 배송 예정 알림 (추후 API로 교체 예정)
const mockDeliverySchedules = [
  {
    id: "2",
    order_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    product_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_date: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_time: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_method: "일반 배송" as const,
    status: "shipping" as const,
  },
  {
    id: "3",
    order_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    product_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_date: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_time: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_method: "새벽 배송" as const,
    status: "preparing" as const,
  },
];

// 버튼 컴포넌트
const Button = ({ children, variant = 'primary', className = '' }: { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'outline'; className?: string }) => {
  const baseStyles = 'font-bold rounded-xl flex items-center justify-center gap-2 relative overflow-hidden transition-all';
  const variants = {
    primary: 'bg-green-600 text-white border-b-4 border-green-800 shadow-lg hover:bg-green-500 active:border-b-0 active:translate-y-1',
    secondary: 'bg-white text-green-600 border-2 border-b-4 border-green-600 shadow-md hover:bg-green-50 active:border-b-2 active:translate-y-0.5',
    outline: 'bg-transparent text-gray-600 border-2 border-b-4 border-gray-300 hover:bg-gray-50 active:border-b-2 active:translate-y-0.5',
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default function RetailerDashboardPage() {
  return (
    <div className="pb-20 relative overflow-hidden min-h-screen font-sans bg-[#F8F9FA]">
      {/* 3D 배경 장식 요소 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-green-200/40 to-emerald-100/0 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-gradient-to-bl from-yellow-100/40 to-orange-50/0 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/30 to-indigo-50/0 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

      {/* 3D 플로팅 오브젝트 */}
      <div className="absolute top-[15%] left-[5%] w-32 h-32 bg-gradient-to-br from-white/60 to-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/30 -z-10"></div>
      <div className="absolute top-[40%] right-[10%] w-24 h-24 bg-gradient-to-br from-green-100/60 to-emerald-50/10 backdrop-blur-md rounded-[2rem] rotate-12 shadow-lg border border-white/30 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-12 relative z-10">
        {/* 섹션 1: 이 상품 어때요? */}
        <section className="relative pt-8">
          <div className="text-center mb-10">
            <div className="inline-block mb-3">
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                POPULAR
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-3">
              이 상품 어때요?
            </h2>
            <p className="text-gray-600 text-lg">가장 인기 있는 상품만 모아봤어요</p>
          </div>
          
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 shadow-md p-4 md:p-6">
            <AIRecommendationList products={mockRecommendedProducts} />
          </div>
        </section>

        {/* 일일 특가 섹션 */}
        <section className="flex flex-col md:flex-row gap-8 md:gap-16 items-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12 border border-red-100 shadow-lg relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="flex items-center gap-2 text-red-500 font-bold text-lg md:text-xl">
              <Clock size={24} />
              <span>일일특가 24시간 한정</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              제주 노지 감귤 10kg<br />
              <span className="text-green-600">40% 초특가 할인</span>
            </h2>
            
            <p className="text-gray-600 text-lg">제주의 햇살을 머금은 달콤한 감귤</p>
            
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-gray-900">18,900원</span>
              <span className="text-xl text-gray-400 line-through mb-1">31,500원</span>
            </div>

            <div className="flex gap-4 pt-4">
              <div className="flex gap-2 text-3xl font-bold text-gray-800 font-mono">
                <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">12</div>
                <span className="self-center">:</span>
                <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">34</div>
                <span className="self-center">:</span>
                <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">56</div>
              </div>
            </div>
             
            <Button variant="primary" className="w-full md:w-auto px-10 py-4 text-lg mt-4 bg-red-500 border-red-700 hover:bg-red-600">
              지금 바로 구매하기
            </Button>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-orange-100 flex items-center justify-center text-8xl group-hover:scale-[1.02] transition-transform duration-500">
              🍊
              <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg animate-bounce">
                -40% OFF
              </div>
            </div>
          </div>
        </section>

        {/* 배너 광고 */}
        <section className="w-full h-32 md:h-40 rounded-2xl overflow-hidden relative cursor-pointer bg-gray-800 flex items-center justify-center hover:scale-[1.01] transition-transform">
          <div className="text-center text-white z-10">
            <h3 className="text-2xl font-bold mb-1">우리 농산물 살리기 프로젝트</h3>
            <p className="text-white/90">산지 직송으로 더 신선하게 만나보세요</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-gray-900 opacity-90"></div>
        </section>

        {/* 섹션 2: 놓치면 후회할 가격 */}
        <section className="relative">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="inline-block mb-3">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                  HOT DEAL
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-3">
                놓치면 후회할 가격 😱
              </h2>
              <p className="text-gray-600 text-lg">최대 50% 할인된 특가 상품을 만나보세요</p>
            </div>
            <button className="text-gray-400 hover:text-green-600 font-medium flex items-center gap-1 transition-colors">
              전체보기 <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* 상품 카드들은 AI 추천 상품 리스트 재사용 */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col border border-gray-100 shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gray-100 group-hover:bg-green-50 transition-colors">
                <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-6xl drop-shadow-sm">🍎</span>
                </div>
                <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                  산지직송
                </span>
                <button className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-800 shadow-lg translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-600 hover:text-white">
                  <ShoppingCart size={20} />
                </button>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col bg-white">
                <div className="flex-1">
                  <h3 className="font-bold text-base text-gray-900 line-clamp-2">
                    청송 꿀사과 5kg (가정용)
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    경북 청송 · 무료배송
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="font-black text-xl text-green-600 tracking-tight">32,000원</div>
                  <div className="text-xs text-gray-400 mt-0.5">1kg 당 6,400원 (예상)</div>
                </div>
                <Button variant="outline" className="w-full py-2 text-sm h-10 border-gray-200">
                  <ShoppingCart size={16} />
                  <span>담기</span>
                </Button>
              </div>
            </div>
            {/* 추가 상품 카드들... */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col border border-gray-100 shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gray-100 group-hover:bg-green-50 transition-colors">
                <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-6xl drop-shadow-sm">🍊</span>
                </div>
                <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                  산지직송
                </span>
                <button className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-800 shadow-lg translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-600 hover:text-white">
                  <ShoppingCart size={20} />
                </button>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col bg-white">
                <div className="flex-1">
                  <h3 className="font-bold text-base text-gray-900 line-clamp-2">
                    제주 감귤 10kg
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    제주도 · 무료배송
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="font-black text-xl text-green-600 tracking-tight">28,000원</div>
                  <div className="text-xs text-gray-400 mt-0.5">1kg 당 2,800원 (예상)</div>
                </div>
                <Button variant="outline" className="w-full py-2 text-sm h-10 border-gray-200">
                  <ShoppingCart size={16} />
                  <span>담기</span>
                </Button>
              </div>
            </div>
            <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col border border-gray-100 shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gray-100 group-hover:bg-green-50 transition-colors">
                <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-6xl drop-shadow-sm">🥬</span>
                </div>
                <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                  산지직송
                </span>
                <button className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-800 shadow-lg translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-600 hover:text-white">
                  <ShoppingCart size={20} />
                </button>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col bg-white">
                <div className="flex-1">
                  <h3 className="font-bold text-base text-gray-900 line-clamp-2">
                    친환경 유기농 상추 1kg
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    경기도 · 무료배송
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="font-black text-xl text-green-600 tracking-tight">15,000원</div>
                  <div className="text-xs text-gray-400 mt-0.5">1kg 당 15,000원 (예상)</div>
                </div>
                <Button variant="outline" className="w-full py-2 text-sm h-10 border-gray-200">
                  <ShoppingCart size={16} />
                  <span>담기</span>
                </Button>
              </div>
            </div>
            <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col border border-gray-100 shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gray-100 group-hover:bg-green-50 transition-colors">
                <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-6xl drop-shadow-sm">🍅</span>
                </div>
                <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                  산지직송
                </span>
                <button className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-800 shadow-lg translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-600 hover:text-white">
                  <ShoppingCart size={20} />
                </button>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col bg-white">
                <div className="flex-1">
                  <h3 className="font-bold text-base text-gray-900 line-clamp-2">
                    토마토 3kg 박스
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    경상남도 · 무료배송
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="font-black text-xl text-green-600 tracking-tight">24,000원</div>
                  <div className="text-xs text-gray-400 mt-0.5">1kg 당 8,000원 (예상)</div>
                </div>
                <Button variant="outline" className="w-full py-2 text-sm h-10 border-gray-200">
                  <ShoppingCart size={16} />
                  <span>담기</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 배송 조회 & 주문 내역 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* 배송 조회 */}
          <div className="bg-white/80 backdrop-blur-xl border border-green-100 rounded-3xl p-8 shadow-lg h-full relative overflow-hidden hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Truck size={24} className="text-green-600" /> 배송 조회
              </h3>
              <button className="text-sm text-gray-400 hover:text-green-600">더보기</button>
            </div>
            <div className="space-y-4">
              {mockDeliverySchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 cursor-pointer hover:bg-white hover:border-green-200 transition-all group">
                  <div className="bg-white p-3 rounded-full shadow-sm text-green-600 group-hover:scale-110 transition-transform">
                    <Truck size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">
                      {schedule.product_name || schedule.delivery_method}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      {schedule.delivery_date} {schedule.delivery_time} 도착 예정
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                    schedule.status === "shipping" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {schedule.status === "shipping" ? "배송중" : "배송준비"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 주문 내역 */}
          <div className="bg-white/80 backdrop-blur-xl border border-purple-100 rounded-3xl p-8 shadow-lg h-full relative overflow-hidden hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Package size={24} className="text-purple-600" /> 최근 주문 내역
              </h3>
              <button className="text-sm text-gray-400 hover:text-green-600">더보기</button>
            </div>
            <div className="space-y-4">
              {mockRecentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 cursor-pointer hover:bg-white hover:border-purple-200 transition-all group">
                  <div className="bg-white p-3 rounded-full shadow-sm text-gray-600 group-hover:scale-110 transition-transform">
                    <Package size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">
                      {order.product_name || "주문 내역"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.delivery_scheduled_time || "날짜 정보 없음"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">
                      {order.total_price > 0 ? `${order.total_price.toLocaleString()}원` : "가격 정보 없음"}
                    </div>
                    <button className="text-xs text-green-600 font-bold hover:underline mt-1">재주문</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 하단 브랜드 배너 */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
           <div className="relative z-10">
             <h2 className="text-2xl md:text-4xl font-black text-white mb-4 drop-shadow-lg">
               Farm to Biz 멤버십
             </h2>
             <p className="text-gray-200 mb-8 max-w-xl mx-auto text-lg">
               지금 가입하고 매달 쏟아지는 할인 쿠폰과<br/>
               무료 배송 혜택을 받아보세요!
             </p>
             <button className="bg-white text-gray-900 px-10 py-4 rounded-full font-black text-lg hover:bg-gray-100 transition-all shadow-xl hover:scale-105 active:scale-95">
               멤버십 혜택 자세히 보기
             </button>
           </div>
        </section>
      </div>
    </div>
  );
}
